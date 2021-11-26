(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@jsplumb/core'), require('@jsplumb/util'), require('@jsplumb/common')) :
  typeof define === 'function' && define.amd ? define(['exports', '@jsplumb/core', '@jsplumb/util', '@jsplumb/common'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.jsPlumbBrowserUI = {}, global.jsPlumb, global.jsPlumbUtil, global.jsPlumbCommon));
}(this, (function (exports, core, util, common) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

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

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
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

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
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
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
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

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
    if (matchOnElementAlso && matchesSelector$1(el, selector, container)) {
      return el;
    } else {
      el = el.parentNode;
    }
    while (el != null && el !== container) {
      if (matchesSelector$1(el, selector)) {
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
    cn = util.fastTrim(cn);
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
      util.log("JSPLUMB: cannot set class list", e);
    }
  }
  function _getClassName(el) {
    return el.className != null ? typeof el.className.baseVal === "undefined" ? el.className : el.className.baseVal : "";
  }
  function _classManip(el, classesToAdd, classesToRemove) {
    var cta = classesToAdd == null ? [] : Array.isArray(classesToAdd) ? classesToAdd : classesToAdd.split(/\s+/);
    var ctr = classesToRemove == null ? [] : Array.isArray(classesToRemove) ? classesToRemove : classesToRemove.split(/\s+/);
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
    return !util.isString(el) && !Array.isArray(el) && el.length != null && el.documentElement == null && el.nodeType == null;
  }
  function isArrayLike(el) {
    return !util.isString(el) && (Array.isArray(el) || isNodeList(el));
  }
  function getClass(el) {
    return _getClassName(el);
  }
  function addClass(el, clazz) {
    var _one = function _one(el, clazz) {
      if (el != null && clazz != null && clazz.length > 0) {
        if (el.classList) {
          var parts = util.fastTrim(clazz).split(/\s+/);
          util.forEach(parts, function (part) {
            el.classList.add(part);
          });
        } else {
          _classManip(el, clazz);
        }
      }
    };
    if (isNodeList(el)) {
      util.forEach(el, function (el) {
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
          var parts = util.fastTrim(clazz).split(/\s+/);
          parts.forEach(function (part) {
            el.classList.remove(part);
          });
        } else {
          _classManip(el, null, clazz);
        }
      }
    };
    if (isNodeList(el)) {
      util.forEach(el, function (el) {
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
      util.forEach(el, function (el) {
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
  var ELEMENT_SVG = "svg";
  var ELEMENT_PATH = "path";
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
  function _applyStyles(parent, node, style) {
    node.setAttribute(FILL, style.fill ? style.fill : core.NONE);
    node.setAttribute(STROKE, style.stroke ? style.stroke : core.NONE);
    if (style.strokeWidth) {
      node.setAttribute(STROKE_WIDTH, style.strokeWidth);
    }
    if (style[DASHSTYLE] && style[LINE_WIDTH] && !style[STROKE_DASHARRAY]) {
      var sep = style[DASHSTYLE].indexOf(",") === -1 ? " " : ",",
          parts = style[DASHSTYLE].split(sep),
          styleToUse = "";
      util.forEach(parts, function (p) {
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

  function compoundEvent(stem, event, subevent) {
    var a = [stem, event];
    if (subevent) {
      a.push(subevent);
    }
    return a.join(":");
  }
  var ATTRIBUTE_CONTAINER = "data-jtk-container";
  var ATTRIBUTE_GROUP_CONTENT = "data-jtk-group-content";
  var ATTRIBUTE_JTK_ENABLED = "data-jtk-enabled";
  var ATTRIBUTE_JTK_SCOPE = "data-jtk-scope";
  var ENDPOINT = "endpoint";
  var ELEMENT = "element";
  var CONNECTION = "connection";
  var ELEMENT_DIV = "div";
  var EVENT_CLICK = "click";
  var EVENT_CONTEXTMENU = "contextmenu";
  var EVENT_DBL_CLICK = "dblclick";
  var EVENT_DBL_TAP = "dbltap";
  var EVENT_FOCUS = "focus";
  var EVENT_MOUSEDOWN = "mousedown";
  var EVENT_MOUSEENTER = "mouseenter";
  var EVENT_MOUSEEXIT = "mouseexit";
  var EVENT_MOUSEMOVE = "mousemove";
  var EVENT_MOUSEUP = "mouseup";
  var EVENT_MOUSEOUT = "mouseout";
  var EVENT_MOUSEOVER = "mouseover";
  var EVENT_TAP = "tap";
  var EVENT_DRAG_MOVE = "drag:move";
  var EVENT_DRAG_STOP = "drag:stop";
  var EVENT_DRAG_START = "drag:start";
  var EVENT_REVERT = "revert";
  var EVENT_CONNECTION_ABORT = "connection:abort";
  var EVENT_CONNECTION_DRAG = "connection:drag";
  var EVENT_ELEMENT_CLICK = compoundEvent(ELEMENT, EVENT_CLICK);
  var EVENT_ELEMENT_DBL_CLICK = compoundEvent(ELEMENT, EVENT_DBL_CLICK);
  var EVENT_ELEMENT_DBL_TAP = compoundEvent(ELEMENT, EVENT_DBL_TAP);
  var EVENT_ELEMENT_MOUSE_OUT = compoundEvent(ELEMENT, EVENT_MOUSEOUT);
  var EVENT_ELEMENT_MOUSE_OVER = compoundEvent(ELEMENT, EVENT_MOUSEOVER);
  var EVENT_ELEMENT_MOUSE_MOVE = compoundEvent(ELEMENT, EVENT_MOUSEMOVE);
  var EVENT_ELEMENT_MOUSE_UP = compoundEvent(ELEMENT, EVENT_MOUSEUP);
  var EVENT_ELEMENT_MOUSE_DOWN = compoundEvent(ELEMENT, EVENT_MOUSEDOWN);
  var EVENT_ELEMENT_CONTEXTMENU = compoundEvent(ELEMENT, EVENT_CONTEXTMENU);
  var EVENT_ELEMENT_TAP = compoundEvent(ELEMENT, EVENT_TAP);
  var EVENT_ENDPOINT_CLICK = compoundEvent(ENDPOINT, EVENT_CLICK);
  var EVENT_ENDPOINT_DBL_CLICK = compoundEvent(ENDPOINT, EVENT_DBL_CLICK);
  var EVENT_ENDPOINT_DBL_TAP = compoundEvent(ENDPOINT, EVENT_DBL_TAP);
  var EVENT_ENDPOINT_MOUSEOUT = compoundEvent(ENDPOINT, EVENT_MOUSEOUT);
  var EVENT_ENDPOINT_MOUSEOVER = compoundEvent(ENDPOINT, EVENT_MOUSEOVER);
  var EVENT_ENDPOINT_MOUSEUP = compoundEvent(ENDPOINT, EVENT_MOUSEUP);
  var EVENT_ENDPOINT_MOUSEDOWN = compoundEvent(ENDPOINT, EVENT_MOUSEDOWN);
  var EVENT_ENDPOINT_TAP = compoundEvent(ENDPOINT, EVENT_TAP);
  var EVENT_CONNECTION_CLICK = compoundEvent(CONNECTION, EVENT_CLICK);
  var EVENT_CONNECTION_DBL_CLICK = compoundEvent(CONNECTION, EVENT_DBL_CLICK);
  var EVENT_CONNECTION_DBL_TAP = compoundEvent(CONNECTION, EVENT_DBL_TAP);
  var EVENT_CONNECTION_MOUSEOUT = compoundEvent(CONNECTION, EVENT_MOUSEOUT);
  var EVENT_CONNECTION_MOUSEOVER = compoundEvent(CONNECTION, EVENT_MOUSEOVER);
  var EVENT_CONNECTION_MOUSEUP = compoundEvent(CONNECTION, EVENT_MOUSEUP);
  var EVENT_CONNECTION_MOUSEDOWN = compoundEvent(CONNECTION, EVENT_MOUSEDOWN);
  var EVENT_CONNECTION_CONTEXTMENU = compoundEvent(CONNECTION, EVENT_CONTEXTMENU);
  var EVENT_CONNECTION_TAP = compoundEvent(CONNECTION, EVENT_TAP);
  var PROPERTY_POSITION = "position";
  var SELECTOR_CONNECTOR = core.cls(core.CLASS_CONNECTOR);
  var SELECTOR_ENDPOINT = core.cls(core.CLASS_ENDPOINT);
  var SELECTOR_GROUP = core.att(core.ATTRIBUTE_GROUP);
  var SELECTOR_GROUP_CONTAINER = core.att(ATTRIBUTE_GROUP_CONTENT);
  var SELECTOR_OVERLAY = core.cls(core.CLASS_OVERLAY);

  function _touch(target, pageX, pageY, screenX, screenY, clientX, clientY) {
    return new Touch({
      target: target,
      identifier: util.uuid(),
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
  var isMouseDevice = ("onmousedown" in document.documentElement);
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
  function _bind(obj, type, fn, originalFn, options) {
    _store(obj, type, fn);
    originalFn.__tauid = fn.__tauid;
    if (obj.addEventListener) {
      obj.addEventListener(type, fn, false, options);
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
    _each$1(obj, function (_el) {
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
  function _each$1(obj, fn) {
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
              if (matchesSelector(target, c[i], obj)) {
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
  var DefaultHandler = function DefaultHandler(obj, evt, fn, children, options) {
    if (isTouchDevice && touchMap[evt]) {
      var tfn = _curryChildFilter(children, obj, fn, touchMap[evt]);
      _bind(obj, touchMap[evt], tfn, fn, options);
    }
    if (evt === EVENT_FOCUS && obj.getAttribute(core.ATTRIBUTE_TABINDEX) == null) {
      obj.setAttribute(core.ATTRIBUTE_TABINDEX, "1");
    }
    _bind(obj, evt, _curryChildFilter(children, obj, fn, evt), fn, options);
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
  var TapHandler = function () {
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
                    if (tt.downSelectors[i] == null || matchesSelector(target, tt.downSelectors[i], obj)) {
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
                            if (tt[eventId][i][1] == null || matchesSelector(currentTarget, tt[eventId][i][1], obj)) {
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
              DefaultHandler(obj, EVENT_MOUSEDOWN, down);
              DefaultHandler(obj, EVENT_MOUSEUP, up);
            }
            obj.__taTapHandler.downSelectors.push(children);
            obj.__taTapHandler[evt].push([fn, children]);
            fn.__taUnstore = function () {
              if (obj.__taTapHandler != null) {
                util.removeWithFunction(obj.__taTapHandler.downSelectors, function (ds) {
                  return ds === children;
                });
                _d(obj.__taTapHandler[evt], fn);
                if (obj.__taTapHandler.downSelectors.length === 0) {
                  _unbind(obj, EVENT_MOUSEDOWN, obj.__taTapHandler.downHandler);
                  _unbind(obj, EVENT_MOUSEUP, obj.__taTapHandler.upHandler);
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
  var MouseEnterExitHandler = function () {
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
              if (children == null && t == obj && !obj.__tamee.over || matchesSelector(t, children, obj) && (t.__tamee == null || !t.__tamee.over)) {
                meeHelper(EVENT_MOUSEENTER, e, obj, t);
                t.__tamee = t.__tamee || {};
                t.__tamee.over = true;
                activeElements.push(t);
              }
            },
                out = function out(e) {
              var t = _t(e);
              for (var i = 0; i < activeElements.length; i++) {
                if (t == activeElements[i] && !matchesSelector(e.relatedTarget || e.toElement, "*", t)) {
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
  var EventManager = function () {
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
      value: function _doBind(el, evt, fn, children, options) {
        if (fn == null) return;
        var jel = el;
        if (evt === EVENT_TAP || evt === EVENT_DBL_TAP || evt === EVENT_CONTEXTMENU) {
          this.tapHandler(jel, evt, fn, children, options);
        } else if (evt === EVENT_MOUSEENTER || evt == EVENT_MOUSEEXIT) this.mouseEnterExitHandler(jel, evt, fn, children, options);else {
          DefaultHandler(jel, evt, fn, children, options);
        }
      }
    }, {
      key: "on",
      value: function on(el, event, children, fn, options) {
        var _c = fn == null ? null : children,
            _f = fn == null ? children : fn;
        this._doBind(el, event, _f, _c, options);
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
        _each$1(el, function (_el) {
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
    if (matchesSelector$1(childElement, selector, parentElement)) {
      return childElement;
    } else {
      var currentParent = childElement.parentNode;
      while (currentParent != null && currentParent !== parentElement) {
        if (matchesSelector$1(currentParent, selector, parentElement)) {
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
      obj._katavorioId = util.uuid();
      return obj._katavorioId;
    } else {
      return obj;
    }
  }
  function isInsideParent(instance, _el, pos) {
    var p = _el.parentNode,
        s = instance.getSize(p),
        ss = instance.getSize(_el),
        leftEdge = pos.x,
        rightEdge = leftEdge + ss.w,
        topEdge = pos.y,
        bottomEdge = topEdge + ss.h;
    return rightEdge > 0 && leftEdge < s.w && bottomEdge > 0 && topEdge < s.h;
  }
  function findMatchingSelector(availableSelectors, parentElement, childElement) {
    var el = null;
    var draggableId = parentElement.getAttribute("katavorio-draggable"),
        prefix = draggableId != null ? "[katavorio-draggable='" + draggableId + "'] " : "";
    for (var i = 0; i < availableSelectors.length; i++) {
      el = findDelegateElement(parentElement, childElement, prefix + availableSelectors[i].selector);
      if (el != null) {
        if (availableSelectors[i].filter) {
          var matches = matchesSelector$1(childElement, availableSelectors[i].filter, el),
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
  var CLASS_DRAGGABLE$1 = ATTRIBUTE_DRAGGABLE;
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
    draggable: CLASS_DRAGGABLE$1,
    drag: "katavorio-drag",
    selected: "katavorio-drag-selected",
    noSelect: "katavorio-drag-no-select",
    ghostProxy: "katavorio-ghost-proxy",
    clonedDrag: "katavorio-clone-drag"
  };
  var _events = [EVENT_STOP, EVENT_START, EVENT_DRAG, EVENT_DROP, EVENT_OVER, EVENT_OUT, EVENT_BEFORE_START];
  var _devNull = function _devNull() {};
  var _each = function _each(obj, fn) {
    if (obj == null) return;
    obj = !util.isString(obj) && obj.tagName == null && obj.length != null ? obj : [obj];
    for (var i = 0; i < obj.length; i++) {
      fn.apply(obj[i], [obj[i]]);
    }
  };
  var _inputFilter = function _inputFilter(e, el, collicat) {
    var t = e.srcElement || e.target;
    return !matchesSelector$1(t, collicat.getInputFilterSelector(), el);
  };
  var Base = function () {
    function Base(el, k) {
      _classCallCheck(this, Base);
      this.el = el;
      this.k = k;
      _defineProperty(this, "_class", void 0);
      _defineProperty(this, "uuid", util.uuid());
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
        _each(this.scopes, function (s) {
          m[s] = true;
        });
        _each(scopes ? scopes.split(/\s+/) : [], function (s) {
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
        _each(this.scopes, function (s) {
          m[s] = true;
        });
        _each(scopes ? scopes.split(/\s+/) : [], function (s) {
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
        _each(this.scopes, function (s) {
          m[s] = true;
        });
        _each(scopes ? scopes.split(/\s+/) : [], function (s) {
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
  exports.ContainmentType = void 0;
  (function (ContainmentType) {
    ContainmentType["notNegative"] = "notNegative";
    ContainmentType["parent"] = "parent";
    ContainmentType["parentEnclosed"] = "parentEnclosed";
  })(exports.ContainmentType || (exports.ContainmentType = {}));
  var Drag = function (_Base) {
    _inherits(Drag, _Base);
    var _super = _createSuper(Drag);
    function Drag(el, params, k) {
      var _this;
      _classCallCheck(this, Drag);
      _this = _super.call(this, el, k);
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
      _this.k.eventManager.on(document, EVENT_MOUSEMOVE, _this.moveListener);
      _this.k.eventManager.on(document, EVENT_MOUSEUP, _this.upListener);
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
          removeClass(document.body, _classes.noSelect);
          this.unmark(e);
          this.stop(e);
          this._moving = false;
          if (this.clone) {
            this._dragEl && this._dragEl.parentNode && this._dragEl.parentNode.removeChild(this._dragEl);
            this._dragEl = null;
          } else {
            if (this._activeSelectorParams && this._activeSelectorParams.revertFunction) {
              if (this._activeSelectorParams.revertFunction(this._dragEl, _getPosition(this._dragEl)) === true) {
                _setPosition(this._dragEl, this._posAtDown);
                this._dispatch(EVENT_REVERT, this._dragEl);
              }
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
            addClass(document.body, _classes.noSelect);
            this._dispatch(EVENT_BEFORE_START, {
              el: this.el,
              pos: this._posAtDown,
              e: e,
              drag: this,
              size: this._size
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
              drag: this,
              size: this._size
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
        this._dispatch(EVENT_DRAG, {
          el: this.el,
          pos: cPos,
          e: e,
          drag: this,
          size: this._size,
          originalPos: this._posAtDown
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
          positions.push([this._dragEl, dPos, this, this._size]);
          this._dispatch(EVENT_STOP, {
            el: this._dragEl,
            pos: this._ghostProxyOffsets || dPos,
            finalPos: dPos,
            e: e,
            drag: this,
            selection: positions,
            size: this._size,
            originalPos: {
              x: this._posAtDown.x,
              y: this._posAtDown.y
            }
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
        var out = {
          grid: null,
          thresholdX: DEFAULT_GRID_X / 2,
          thresholdY: DEFAULT_GRID_Y / 2
        };
        if (this._activeSelectorParams != null && this._activeSelectorParams.grid != null) {
          out.grid = this._activeSelectorParams.grid;
          if (this._activeSelectorParams.snapThreshold != null) {
            out.thresholdX = this._activeSelectorParams.snapThreshold;
            out.thresholdY = this._activeSelectorParams.snapThreshold;
          }
        }
        return out;
      }
    }, {
      key: "toGrid",
      value: function toGrid(pos) {
        var _this$resolveGrid = this.resolveGrid(),
            grid = _this$resolveGrid.grid,
            thresholdX = _this$resolveGrid.thresholdX,
            thresholdY = _this$resolveGrid.thresholdY;
        if (grid == null) {
          return pos;
        } else {
          var tx = grid ? grid.w / 2 : thresholdX,
              ty = grid ? grid.h / 2 : thresholdY;
          return util.snapToGrid(pos, grid, tx, ty);
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
            if (util.isString(f)) {
              m = matchesSelector$1(t, f, _this2.el);
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
  var Collicat = function () {
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
      util.extend(this.css, _c);
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

  var CLASS_DRAG_SELECTED = "jtk-drag-selected";
  var DragSelection = function () {
    function DragSelection(instance) {
      _classCallCheck(this, DragSelection);
      this.instance = instance;
      _defineProperty(this, "_dragSelection", []);
      _defineProperty(this, "_dragSizes", new Map());
      _defineProperty(this, "_dragElements", new Map());
      _defineProperty(this, "_dragElementStartPositions", new Map());
      _defineProperty(this, "_dragElementPositions", new Map());
      _defineProperty(this, "__activeSet", void 0);
    }
    _createClass(DragSelection, [{
      key: "_activeSet",
      get: function get() {
        if (this.__activeSet == null) {
          return this._dragSelection;
        } else {
          return this.__activeSet;
        }
      }
    }, {
      key: "length",
      get: function get() {
        return this._dragSelection.length;
      }
    }, {
      key: "filterActiveSet",
      value: function filterActiveSet(fn) {
        var _this = this;
        this.__activeSet = [];
        util.forEach(this._dragSelection, function (p) {
          if (fn(p)) {
            _this.__activeSet.push(p);
          }
        });
      }
    }, {
      key: "clear",
      value: function clear() {
        var _this2 = this;
        this.reset();
        util.forEach(this._dragSelection, function (p) {
          return _this2.instance.removeClass(p.jel, CLASS_DRAG_SELECTED);
        });
        this._dragSelection.length = 0;
      }
    }, {
      key: "reset",
      value: function reset() {
        this._dragElementStartPositions.clear();
        this._dragElementPositions.clear();
        this._dragSizes.clear();
        this._dragElements.clear();
        this.__activeSet = null;
      }
    }, {
      key: "initialisePositions",
      value: function initialisePositions() {
        var _this3 = this;
        util.forEach(this._activeSet, function (p) {
          var off = {
            x: parseInt("" + p.jel.offsetLeft, 10),
            y: parseInt("" + p.jel.offsetTop, 10)
          };
          _this3._dragElementStartPositions.set(p.id, off);
          _this3._dragElementPositions.set(p.id, off);
          _this3._dragSizes.set(p.id, _this3.instance.getSize(p.jel));
        });
      }
    }, {
      key: "updatePositions",
      value: function updatePositions(currentPosition, originalPosition, callback) {
        var _this4 = this;
        var dx = currentPosition.x - originalPosition.x,
            dy = currentPosition.y - originalPosition.y;
        util.forEach(this._activeSet, function (p) {
          var op = _this4._dragElementStartPositions.get(p.id);
          if (op) {
            var x = op.x + dx,
                y = op.y + dy;
            var _s = _this4._dragSizes.get(p.id);
            var _b = {
              x: x,
              y: y,
              w: _s.w,
              h: _s.h
            };
            if (p.jel._jsPlumbParentGroup && p.jel._jsPlumbParentGroup.constrain) {
              var constrainRect = {
                w: p.jel.parentNode.offsetWidth + p.jel.parentNode.scrollLeft,
                h: p.jel.parentNode.offsetHeight + p.jel.parentNode.scrollTop
              };
              _b.x = Math.max(_b.x, 0);
              _b.y = Math.max(_b.y, 0);
              _b.x = Math.min(_b.x, constrainRect.w - _s.w);
              _b.y = Math.min(_b.y, constrainRect.h - _s.h);
            }
            _this4._dragElementPositions.set(p.id, {
              x: x,
              y: y
            });
            p.jel.style.left = _b.x + "px";
            p.jel.style.top = _b.y + "px";
            callback(p.jel, p.id, _s, _b);
          }
        });
      }
    }, {
      key: "each",
      value: function each(f) {
        var _this5 = this;
        util.forEach(this._activeSet, function (p) {
          var s = _this5._dragSizes.get(p.id);
          var o = _this5._dragElementPositions.get(p.id);
          var orig = _this5._dragElementStartPositions.get(p.id);
          f(p.jel, p.id, o, s, orig);
        });
      }
    }, {
      key: "add",
      value: function add(el, id) {
        var jel = el;
        id = id || this.instance.getId(jel);
        var idx = util.findWithFunction(this._dragSelection, function (p) {
          return p.id === id;
        });
        if (idx === -1) {
          this.instance.addClass(el, CLASS_DRAG_SELECTED);
          this._dragSelection.push({
            id: id,
            jel: jel
          });
        }
      }
    }, {
      key: "remove",
      value: function remove(el) {
        var _this6 = this;
        var jel = el;
        this._dragSelection = this._dragSelection.filter(function (p) {
          var out = p.jel !== jel;
          if (!out) {
            _this6.instance.removeClass(p.jel, CLASS_DRAG_SELECTED);
          }
          return out;
        });
      }
    }, {
      key: "toggle",
      value: function toggle(el) {
        var jel = el;
        var idx = util.findWithFunction(this._dragSelection, function (p) {
          return p.jel === jel;
        });
        if (idx !== -1) {
          this.remove(jel);
        } else {
          this.add(el);
        }
      }
    }]);
    return DragSelection;
  }();

  var CLASS_DELEGATED_DRAGGABLE = "jtk-delegated-draggable";
  var CLASS_DRAGGABLE = "jtk-draggable";
  var CLASS_DRAG_CONTAINER = "jtk-drag";
  var CLASS_GHOST_PROXY = "jtk-ghost-proxy";
  var CLASS_DRAG_ACTIVE = "jtk-drag-active";
  var CLASS_DRAGGED = "jtk-dragged";
  var CLASS_DRAG_HOVER = "jtk-drag-hover";
  var DragManager = function () {
    function DragManager(instance, dragSelection, options) {
      var _this = this;
      _classCallCheck(this, DragManager);
      this.instance = instance;
      this.dragSelection = dragSelection;
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
          draggable: CLASS_DRAGGABLE,
          drag: CLASS_DRAG_CONTAINER,
          selected: CLASS_DRAG_SELECTED,
          active: CLASS_DRAG_ACTIVE,
          hover: CLASS_DRAG_HOVER,
          ghostProxy: CLASS_GHOST_PROXY
        }
      });
      this.instance.bind(core.EVENT_ZOOM, function (z) {
        _this.collicat.setZoom(z);
      });
      options = options || {};
      this._trackScroll = options.trackScroll !== false;
    }
    _createClass(DragManager, [{
      key: "addHandler",
      value: function addHandler(handler, dragOptions) {
        var _this2 = this;
        var o = util.extend({
          selector: handler.selector
        }, dragOptions || {});
        o.start = util.wrap(o.start, function (p) {
          return handler.onStart(p);
        });
        o.drag = util.wrap(o.drag, function (p) {
          return handler.onDrag(p);
        });
        o.stop = util.wrap(o.stop, function (p) {
          return handler.onStop(p);
        });
        var handlerBeforeStart = (handler.onBeforeStart || function (p) {}).bind(handler);
        o.beforeStart = util.wrap(o.beforeStart, function (p) {
          return handlerBeforeStart(p);
        });
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
            case exports.ContainmentType.notNegative:
              {
                o.constrainFunction = function (pos, dragEl, _constrainRect, _size) {
                  return {
                    x: Math.max(0, Math.min(pos.x)),
                    y: Math.max(0, Math.min(pos.y))
                  };
                };
                break;
              }
            case exports.ContainmentType.parent:
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
            case exports.ContainmentType.parentEnclosed:
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
          util.forEach(this._filtersToAdd, function (filterToAdd) {
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
        util.forEach(filters, function (f) {
          _this3.drag.addFilter(f[0], f[1]);
        });
      }
    }, {
      key: "reset",
      value: function reset() {
        var out = [];
        util.forEach(this.handlers, function (p) {
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
        var handlerAndOptions = util.getWithFunction(this.handlers, function (p) {
          return p.handler === handler;
        });
        if (handlerAndOptions != null) {
          util.extend(handlerAndOptions.options, options || {});
        }
      }
    }]);
    return DragManager;
  }();

  function decodeDragGroupSpec(instance, spec) {
    if (util.isString(spec)) {
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
    var details = util.getFromSetWithFunction(dragGroup.members, function (m) {
      return m.el === el;
    });
    if (details !== null) {
      return details.active === true;
    } else {
      return false;
    }
  }
  function getAncestors(el) {
    var ancestors = [];
    var p = el._jsPlumbParentGroup;
    while (p != null) {
      ancestors.push(p.el);
      p = p.group;
    }
    return ancestors;
  }
  var ElementDragHandler = function () {
    function ElementDragHandler(instance, _dragSelection) {
      _classCallCheck(this, ElementDragHandler);
      this.instance = instance;
      this._dragSelection = _dragSelection;
      _defineProperty(this, "selector", "> " + core.SELECTOR_MANAGED_ELEMENT + ":not(" + core.cls(core.CLASS_OVERLAY) + ")");
      _defineProperty(this, "_dragOffset", null);
      _defineProperty(this, "_groupLocations", []);
      _defineProperty(this, "_intersectingGroups", []);
      _defineProperty(this, "_currentDragParentGroup", null);
      _defineProperty(this, "_dragGroupByElementIdMap", {});
      _defineProperty(this, "_dragGroupMap", {});
      _defineProperty(this, "_currentDragGroup", null);
      _defineProperty(this, "_currentDragGroupOffsets", new Map());
      _defineProperty(this, "_currentDragGroupSizes", new Map());
      _defineProperty(this, "_dragPayload", null);
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
      key: "getDropGroup",
      value: function getDropGroup() {
        var dropGroup = null;
        if (this._intersectingGroups.length > 0) {
          var targetGroup = this._intersectingGroups[0].groupLoc.group;
          var intersectingElement = this._intersectingGroups[0].intersectingElement;
          var currentGroup = intersectingElement._jsPlumbParentGroup;
          if (currentGroup !== targetGroup) {
            if (currentGroup == null || !currentGroup.overrideDrop(intersectingElement, targetGroup)) {
              dropGroup = this._intersectingGroups[0];
            }
          }
        }
        return dropGroup;
      }
    }, {
      key: "onStop",
      value: function onStop(params) {
        var _this = this;
        var jel = params.drag.getDragElement();
        var dropGroup = this.getDropGroup();
        var elementsToProcess = [];
        elementsToProcess.push({
          el: jel,
          id: this.instance.getId(jel),
          pos: params.finalPos,
          originalGroup: jel._jsPlumbParentGroup,
          redrawResult: null,
          originalPos: params.originalPos,
          reverted: false,
          dropGroup: dropGroup != null ? dropGroup.groupLoc.group : null
        });
        this._dragSelection.each(function (el, id, o, s, orig) {
          if (el !== params.el) {
            var pp = {
              x: o.x,
              y: o.y
            };
            var x = pp.x,
                y = pp.y;
            if (el._jsPlumbParentGroup && el._jsPlumbParentGroup.constrain) {
              var constrainRect = {
                w: el.parentNode.offsetWidth + el.parentNode.scrollLeft,
                h: el.parentNode.offsetHeight + el.parentNode.scrollTop
              };
              x = Math.max(x, 0);
              y = Math.max(y, 0);
              x = Math.min(x, constrainRect.w - s.w);
              y = Math.min(y, constrainRect.h - s.h);
              pp.x = x;
              pp.y = y;
            }
            elementsToProcess.push({
              el: el,
              id: id,
              pos: pp,
              originalPos: orig,
              originalGroup: el._jsPlumbParentGroup,
              redrawResult: null,
              reverted: false,
              dropGroup: dropGroup != null ? dropGroup.groupLoc.group : null
            });
          }
        });
        util.forEach(elementsToProcess, function (p) {
          var wasInGroup = p.originalGroup != null,
              isInOriginalGroup = wasInGroup && isInsideParent(_this.instance, p.el, p.pos),
              parentOffset = {
            x: 0,
            y: 0
          };
          if (wasInGroup && !isInOriginalGroup) {
            if (dropGroup == null) {
              var orphanedPosition = _this._pruneOrOrphan(p, true, true);
              if (orphanedPosition.pos != null) {
                p.pos = orphanedPosition.pos.pos;
              } else {
                if (!orphanedPosition.pruned && p.originalGroup.revert) {
                  p.pos = p.originalPos;
                  p.reverted = true;
                }
              }
            }
          } else if (wasInGroup && isInOriginalGroup) {
            parentOffset = _this.instance.viewport.getPosition(p.originalGroup.elId);
          }
          if (dropGroup != null && !isInOriginalGroup) {
            _this.instance.groupManager.addToGroup(dropGroup.groupLoc.group, false, p.el);
          } else {
            p.dropGroup = null;
          }
          if (p.reverted) {
            _this.instance.setPosition(p.el, p.pos);
          }
          p.redrawResult = _this.instance.setElementPosition(p.el, p.pos.x + parentOffset.x, p.pos.y + parentOffset.y);
          _this.instance.removeClass(p.el, CLASS_DRAGGED);
          _this.instance.select({
            source: p.el
          }).removeClass(_this.instance.elementDraggingClass + " " + _this.instance.sourceElementDraggingClass, true);
          _this.instance.select({
            target: p.el
          }).removeClass(_this.instance.elementDraggingClass + " " + _this.instance.targetElementDraggingClass, true);
        });
        if (elementsToProcess[0].originalGroup != null) {
          var currentGroup = jel._jsPlumbParentGroup;
          if (currentGroup !== elementsToProcess[0].originalGroup) {
            var originalElement = params.drag.getDragElement(true);
            if (elementsToProcess[0].originalGroup.ghost) {
              var o1 = this.instance.getOffset(this.instance.getGroupContentArea(currentGroup));
              var o2 = this.instance.getOffset(this.instance.getGroupContentArea(elementsToProcess[0].originalGroup));
              var o = {
                x: o2.x + params.pos.x - o1.x,
                y: o2.y + params.pos.y - o1.y
              };
              originalElement.style.left = o.x + "px";
              originalElement.style.top = o.y + "px";
              this.instance.revalidate(originalElement);
            }
          }
        }
        this.instance.fire(EVENT_DRAG_STOP, {
          elements: elementsToProcess,
          e: params.e,
          el: jel,
          payload: this._dragPayload
        });
        this._cleanup();
      }
    }, {
      key: "_cleanup",
      value: function _cleanup() {
        var _this2 = this;
        util.forEach(this._groupLocations, function (groupLoc) {
          _this2.instance.removeClass(groupLoc.el, CLASS_DRAG_ACTIVE);
          _this2.instance.removeClass(groupLoc.el, CLASS_DRAG_HOVER);
        });
        this._currentDragParentGroup = null;
        this._groupLocations.length = 0;
        this.instance.hoverSuspended = false;
        this._dragOffset = null;
        this._dragSelection.reset();
        this._dragPayload = null;
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
        var _one = function _one(el, bounds, findIntersectingGroups) {
          if (findIntersectingGroups) {
            var ancestorsOfIntersectingGroups = new Set();
            util.forEach(_this3._groupLocations, function (groupLoc) {
              if (!ancestorsOfIntersectingGroups.has(groupLoc.group.id) && util.intersects(bounds, groupLoc.r)) {
                if (groupLoc.group !== _this3._currentDragParentGroup) {
                  _this3.instance.addClass(groupLoc.el, CLASS_DRAG_HOVER);
                }
                _this3._intersectingGroups.push({
                  groupLoc: groupLoc,
                  intersectingElement: params.drag.getDragElement(true),
                  d: 0
                });
                util.forEach(_this3.instance.groupManager.getAncestors(groupLoc.group), function (g) {
                  return ancestorsOfIntersectingGroups.add(g.id);
                });
              } else {
                _this3.instance.removeClass(groupLoc.el, CLASS_DRAG_HOVER);
              }
            });
          }
          _this3.instance.setElementPosition(el, bounds.x, bounds.y);
          _this3.instance.fire(EVENT_DRAG_MOVE, {
            el: el,
            e: params.e,
            pos: {
              x: bounds.x,
              y: bounds.y
            },
            originalPosition: _this3.originalPosition,
            payload: _this3._dragPayload
          });
        };
        var elBounds = {
          x: ui.x,
          y: ui.y,
          w: elSize.w,
          h: elSize.h
        };
        _one(el, elBounds, true);
        this._dragSelection.updatePositions(finalPos, this.originalPosition, function (el, id, s, b) {
          _one(el, b, false);
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
          _one(v[1], _b, false);
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
        var nd = el.getAttribute(core.ATTRIBUTE_NOT_DRAGGABLE);
        if (this.instance.elementsDraggable === false || nd != null && nd !== common.FALSE) {
          cont = false;
        }
        if (cont) {
          this._groupLocations.length = 0;
          this._intersectingGroups.length = 0;
          this.instance.hoverSuspended = true;
          var originalElement = params.drag.getDragElement(true),
              descendants = originalElement.querySelectorAll(core.SELECTOR_MANAGED_ELEMENT),
              ancestors = getAncestors(originalElement),
              a = [];
          Array.prototype.push.apply(a, descendants);
          Array.prototype.push.apply(a, ancestors);
          this._dragSelection.filterActiveSet(function (p) {
            return a.indexOf(p.jel) === -1;
          });
          this._dragSelection.initialisePositions();
          var _one = function _one(_el) {
            if (!_el._isJsPlumbGroup || _this4.instance.allowNestedGroups) {
              var isNotInAGroup = !_el._jsPlumbParentGroup;
              var membersAreDroppable = isNotInAGroup || _el._jsPlumbParentGroup.dropOverride !== true;
              var isGhostOrNotConstrained = !isNotInAGroup && (_el._jsPlumbParentGroup.ghost || _el._jsPlumbParentGroup.constrain !== true);
              if (isNotInAGroup || membersAreDroppable && isGhostOrNotConstrained) {
                util.forEach(_this4.instance.groupManager.getGroups(), function (group) {
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
                    var groupLocation = {
                      el: groupEl,
                      r: boundingRect,
                      group: group
                    };
                    _this4._groupLocations.push(groupLocation);
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
          } else {
            this._dragPayload = dragStartReturn;
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
      key: "addToDragGroup",
      value: function addToDragGroup(spec) {
        var _this5 = this;
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
        util.forEach(els, function (el) {
          var elId = _this5.instance.getId(el);
          dragGroup.members.add({
            elId: elId,
            el: el,
            active: details.active
          });
          _this5._dragGroupByElementIdMap[elId] = dragGroup;
        });
      }
    }, {
      key: "removeFromDragGroup",
      value: function removeFromDragGroup() {
        var _this6 = this;
        for (var _len2 = arguments.length, els = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          els[_key2] = arguments[_key2];
        }
        util.forEach(els, function (el) {
          var id = _this6.instance.getId(el);
          var dragGroup = _this6._dragGroupByElementIdMap[id];
          if (dragGroup != null) {
            var s = new Set();
            dragGroup.members.forEach(function (member) {
              if (member.el !== el) {
                s.add(member);
              }
            });
            dragGroup.members = s;
            delete _this6._dragGroupByElementIdMap[id];
          }
        });
      }
    }, {
      key: "setDragGroupState",
      value: function setDragGroupState(state) {
        var _this7 = this;
        for (var _len3 = arguments.length, els = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          els[_key3 - 1] = arguments[_key3];
        }
        var elementIds = els.map(function (el) {
          return _this7.instance.getId(el);
        });
        util.forEach(elementIds, function (id) {
          var dragGroup = _this7._dragGroupByElementIdMap[id];
          if (dragGroup != null) {
            var member = util.getFromSetWithFunction(dragGroup.members, function (m) {
              return m.elId === id;
            });
            if (member != null) {
              member.active = state;
            }
          }
        });
      }
    }, {
      key: "_pruneOrOrphan",
      value: function _pruneOrOrphan(params, doNotTransferToAncestor, isDefinitelyNotInsideParent) {
        var jel = params.el;
        var orphanedPosition = {
          pruned: false,
          pos: null
        };
        if (isDefinitelyNotInsideParent || !isInsideParent(this.instance, jel, params.pos)) {
          var group = jel._jsPlumbParentGroup;
          if (group.prune) {
            if (jel._isJsPlumbGroup) {
              this.instance.removeGroup(jel._jsPlumbGroup);
            } else {
              group.remove(params.el, true);
            }
            orphanedPosition.pruned = true;
          } else if (group.orphan) {
            orphanedPosition.pos = this.instance.groupManager.orphan(params.el, doNotTransferToAncestor);
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
    return ElementDragHandler;
  }();

  function _makeFloatingEndpoint(paintStyle, endpoint, referenceCanvas, sourceElement, instance, scope) {
    var floatingAnchor = core.createFloatingAnchor(instance, sourceElement);
    var p = {
      paintStyle: paintStyle,
      preparedAnchor: floatingAnchor,
      element: sourceElement,
      scope: scope
    };
    if (endpoint != null) {
      if (util.isAssignableFrom(endpoint, core.EndpointRepresentation)) {
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
  var SELECTOR_DRAG_ACTIVE_OR_HOVER = core.cls(CLASS_DRAG_ACTIVE, CLASS_DRAG_HOVER);
  var EndpointDragHandler = function () {
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
      _defineProperty(this, "selector", core.cls(core.CLASS_ENDPOINT));
      var container = instance.getContainer();
      this.mousedownHandler = this._mousedownHandler.bind(this);
      this.mouseupHandler = this._mouseupHandler.bind(this);
      instance.on(container, EVENT_MOUSEDOWN, core.SELECTOR_MANAGED_ELEMENT, this.mousedownHandler);
      instance.on(container, EVENT_MOUSEUP, [core.SELECTOR_MANAGED_ELEMENT, core.cls(core.CLASS_ENDPOINT)].join(","), this.mouseupHandler);
    }
    _createClass(EndpointDragHandler, [{
      key: "_resolveDragParent",
      value: function _resolveDragParent(def, eventTarget) {
        var container = this.instance.getContainer();
        var parent = findParent(eventTarget, core.SELECTOR_MANAGED_ELEMENT, container, true);
        if (def.parentSelector != null) {
          var child = findParent(eventTarget, def.parentSelector, container, true);
          if (child != null) {
            parent = findParent(child.parentNode, core.SELECTOR_MANAGED_ELEMENT, container, false);
          }
          return child || parent;
        } else {
          return parent;
        }
      }
    }, {
      key: "_mousedownHandler",
      value: function _mousedownHandler(e) {
        var sourceEl;
        var sourceDef;
        if (e.which === 3 || e.button === 2) {
          return;
        }
        var eventTarget = e.target || e.srcElement;
        sourceDef = this._getSourceDefinition(e);
        if (sourceDef != null) {
          sourceEl = this._resolveDragParent(sourceDef.def, eventTarget);
          if (sourceEl == null || sourceEl.getAttribute(ATTRIBUTE_JTK_ENABLED) === common.FALSE) {
            return;
          }
        }
        if (sourceDef) {
          var sourceElement = e.currentTarget,
              def;
          if (eventTarget.getAttribute(ATTRIBUTE_JTK_ENABLED) !== common.FALSE) {
            consume(e);
            this._activeDefinition = sourceDef;
            def = sourceDef.def;
            var sourceCount = this.instance.select({
              source: sourceEl
            }).length;
            if (sourceDef.maxConnections >= 0 && sourceCount >= sourceDef.maxConnections) {
              consume(e);
              if (def.onMaxConnections) {
                def.onMaxConnections({
                  element: sourceEl,
                  maxConnections: sourceDef.maxConnections
                }, e);
              }
              e.stopImmediatePropagation && e.stopImmediatePropagation();
              return false;
            }
            var elxy = getPositionOnElement(e, sourceEl, this.instance.currentZoom);
            var tempEndpointParams = {
              element: sourceEl
            };
            util.extend(tempEndpointParams, def);
            tempEndpointParams.isTemporarySource = true;
            if (def.scope) {
              tempEndpointParams.scope = def.scope;
            } else {
              var scopeFromElement = eventTarget.getAttribute(ATTRIBUTE_JTK_SCOPE);
              if (scopeFromElement != null) {
                tempEndpointParams.scope = scopeFromElement;
              }
            }
            var extractedParameters = def.parameterExtractor ? def.parameterExtractor(sourceEl, eventTarget) : {};
            tempEndpointParams = util.merge(tempEndpointParams, extractedParameters);
            this._originalAnchor = tempEndpointParams.anchor || (this.instance.areDefaultAnchorsSet() ? this.instance.defaults.anchors[0] : this.instance.defaults.anchor);
            tempEndpointParams.anchor = [elxy.x, elxy.y, 0, 0];
            tempEndpointParams.deleteOnEmpty = true;
            this.ep = this.instance._internal_newEndpoint(tempEndpointParams);
            var payload = {};
            if (def.extract) {
              for (var att in def.extract) {
                var v = eventTarget.getAttribute(att);
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
      }
    }, {
      key: "_mouseupHandler",
      value: function _mouseupHandler(e) {
        var el = e.currentTarget || e.srcElement;
        if (el._jsPlumbOrphanedEndpoints) {
          util.each(el._jsPlumbOrphanedEndpoints, this.instance._maybePruneEndpoint.bind(this.instance));
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
        var n = createElement(ELEMENT_DIV, {
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
          type: this.ep.edgeType,
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
        this.jpc.suspendedElementType = anchorIdx === 0 ? core.SOURCE : core.TARGET;
        this.instance.setHover(this.jpc.suspendedEndpoint, false);
        this.floatingEndpoint.referenceEndpoint = this.jpc.suspendedEndpoint;
        this.floatingEndpoint.mergeParameters(this.jpc.suspendedEndpoint.parameters);
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
        var payload = {};
        var beforeDrag = this.instance.checkCondition(this.jpc == null ? core.INTERCEPT_BEFORE_DRAG : core.INTERCEPT_BEFORE_START_DETACH, {
          endpoint: this.ep,
          source: this.ep.element,
          sourceId: this.ep.elementId,
          connection: this.jpc
        });
        if (beforeDrag === false) {
          _continue = false;
        }
        else if (_typeof(beforeDrag) === "object") {
          payload = beforeDrag;
          util.extend(payload, this.payload || {});
        } else {
          payload = this.payload || {};
        }
        return [_continue, payload];
      }
    }, {
      key: "_createFloatingEndpoint",
      value: function _createFloatingEndpoint(canvasElement) {
        var endpointToFloat = this.ep.endpoint;
        if (this.ep.edgeType != null) {
          var aae = this.instance._deriveEndpointAndAnchorSpec(this.ep.edgeType);
          endpointToFloat = aae.endpoints[1];
        }
        this.floatingEndpoint = _makeFloatingEndpoint(this.ep.getPaintStyle(), endpointToFloat, canvasElement, this.placeholderInfo.element, this.instance, this.ep.scope);
        this.floatingAnchor = this.floatingEndpoint._anchor;
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
        var matchingEndpoints = this.instance.getContainer().querySelectorAll([".", core.CLASS_ENDPOINT, "[", core.ATTRIBUTE_SCOPE_PREFIX, this.ep.scope, "]"].join(""));
        util.forEach(matchingEndpoints, function (candidate) {
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
                targetEl: candidate,
                r: boundingRect,
                endpoint: candidate.jtk.endpoint,
                def: null
              });
              _this.instance.addClass(candidate, CLASS_DRAG_ACTIVE);
            }
          }
        });
        if (isSourceDrag) {
          var sourceDef = util.getWithFunction(this.instance.sourceSelectors, function (sSel) {
            return sSel.isEnabled() && (sSel.def.def.scope == null || sSel.def.def.scope === _this.ep.scope);
          });
          if (sourceDef != null) {
            var targetZones = this.instance.getContainer().querySelectorAll(sourceDef.redrop === core.REDROP_POLICY_ANY ? core.SELECTOR_MANAGED_ELEMENT : sourceDef.selector);
            util.forEach(targetZones, function (el) {
              if (el.getAttribute(ATTRIBUTE_JTK_ENABLED) !== common.FALSE) {
                var scopeFromElement = el.getAttribute(ATTRIBUTE_JTK_SCOPE);
                if (scopeFromElement != null && scopeFromElement !== _this.ep.scope) {
                  return;
                }
                var d = {
                  r: null,
                  el: el
                };
                d.targetEl = findParent(el, core.SELECTOR_MANAGED_ELEMENT, _this.instance.getContainer(), true);
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
                _this.instance.addClass(d.targetEl, CLASS_DRAG_ACTIVE);
              }
            });
          }
        } else {
          var targetDefs = util.getAllWithFunction(this.instance.targetSelectors, function (tSel) {
            return tSel.isEnabled();
          });
          targetDefs.forEach(function (targetDef) {
            var targetZones = _this.instance.getContainer().querySelectorAll(targetDef.selector);
            util.forEach(targetZones, function (el) {
              if (el.getAttribute(ATTRIBUTE_JTK_ENABLED) !== common.FALSE) {
                var scopeFromElement = el.getAttribute(ATTRIBUTE_JTK_SCOPE);
                if (scopeFromElement != null && scopeFromElement !== _this.ep.scope) {
                  return;
                }
                var d = {
                  r: null,
                  el: el
                };
                if (targetDef.def.def.parentSelector != null) {
                  d.targetEl = findParent(el, targetDef.def.def.parentSelector, _this.instance.getContainer(), true);
                }
                if (d.targetEl == null) {
                  d.targetEl = findParent(el, core.SELECTOR_MANAGED_ELEMENT, _this.instance.getContainer(), true);
                }
                if (targetDef.def.def.allowLoopback === false || _this._activeDefinition && _this._activeDefinition.def.allowLoopback === false) {
                  if (d.targetEl === _this.ep.element) {
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
                _this.instance.addClass(d.targetEl, CLASS_DRAG_ACTIVE);
              }
            });
          });
        }
        this.endpointDropTargets.sort(function (a, b) {
          if (a.targetEl._isJsPlumbGroup && !b.targetEl._isJsPlumbGroup) {
            return 1;
          } else if (!a.targetEl._isJsPlumbGroup && b.targetEl._isJsPlumbGroup) {
            return -1;
          } else {
            if (a.targetEl._isJsPlumbGroup && b.targetEl._isJsPlumbGroup) {
              if (_this.instance.groupManager.isAncestor(a.targetEl._jsPlumbGroup, b.targetEl._jsPlumbGroup)) {
                return -1;
              } else if (_this.instance.groupManager.isAncestor(b.targetEl._jsPlumbGroup, a.targetEl._jsPlumbGroup)) {
                return 1;
              }
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
            if (util.intersects(boundingRect, this.endpointDropTargets[i].r)) {
              newDropTarget = this.endpointDropTargets[i];
              break;
            }
          }
          if (newDropTarget !== this.currentDropTarget && this.currentDropTarget != null) {
            idx = this._getFloatingAnchorIndex();
            this.instance.removeClass(this.currentDropTarget.el, CLASS_DRAG_HOVER);
            if (this.currentDropTarget.endpoint) {
              this.currentDropTarget.endpoint.endpoint.removeClass(this.instance.endpointDropAllowedClass);
              this.currentDropTarget.endpoint.endpoint.removeClass(this.instance.endpointDropForbiddenClass);
            }
            this.floatingAnchor.out();
          }
          if (newDropTarget != null) {
            this.instance.addClass(newDropTarget.el, CLASS_DRAG_HOVER);
            idx = this._getFloatingAnchorIndex();
            if (newDropTarget.endpoint != null) {
              _cont = newDropTarget.endpoint.isSource && idx === 0 || newDropTarget.endpoint.isTarget && idx !== 0 || this.jpc.suspendedEndpoint && newDropTarget.endpoint.referenceEndpoint && newDropTarget.endpoint.referenceEndpoint.id === this.jpc.suspendedEndpoint.id;
              if (_cont) {
                var bb = this.instance.checkCondition(core.CHECK_DROP_ALLOWED, {
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
                this.floatingAnchor.over(newDropTarget.endpoint);
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
        var idx = this._getFloatingAnchorIndex();
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
        var classesToRemove = core.classList(CLASS_DRAG_HOVER, CLASS_DRAG_ACTIVE);
        var matchingSelectors = this.instance.getContainer().querySelectorAll(SELECTOR_DRAG_ACTIVE_OR_HOVER);
        util.forEach(matchingSelectors, function (el) {
          _this2.instance.removeClass(el, classesToRemove);
        });
        if (this.jpc && this.jpc.endpoints != null) {
          var existingConnection = this.jpc.suspendedEndpoint != null;
          var idx = this._getFloatingAnchorIndex();
          var suspendedEndpoint = this.jpc.suspendedEndpoint;
          var dropEndpoint;
          if (this.currentDropTarget != null) {
            dropEndpoint = this._getDropEndpoint(p, this.jpc);
            if (dropEndpoint == null) {
              !this._reattachOrDiscard(p.e);
            } else {
              if (suspendedEndpoint && suspendedEndpoint.id === dropEndpoint.id) {
                this._doForceReattach(idx);
              } else {
                if (!dropEndpoint.enabled) {
                  this._reattachOrDiscard(p.e);
                } else if (dropEndpoint.isFull()) {
                  dropEndpoint.fire(core.EVENT_MAX_CONNECTIONS, {
                    endpoint: this,
                    connection: this.jpc,
                    maxConnections: this.instance.defaults.maxConnections
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
      key: "_getSourceDefinition",
      value: function _getSourceDefinition(evt) {
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
          var eventTarget = p.e.target || p.e.srcElement;
          if (targetDefinition == null) {
            return null;
          }
          var eps = this.instance._deriveEndpointAndAnchorSpec(jpc.getType().join(" "), true);
          var pp = eps.endpoints ? util.extend(p, {
            endpoint: targetDefinition.def.endpoint || eps.endpoints[1]
          }) : p;
          var anchorsToUse = this.instance.validAnchorsSpec(eps.anchors) ? eps.anchors : this.instance.areDefaultAnchorsSet() ? this.instance.defaults.anchors : null;
          if (anchorsToUse) {
            pp = util.extend(pp, {
              anchor: targetDefinition.def.anchor || anchorsToUse[1]
            });
          }
          if (targetDefinition.def.portId != null) {
            pp.portId = targetDefinition.def.portId;
          }
          var extractedParameters = targetDefinition.def.parameterExtractor ? targetDefinition.def.parameterExtractor(this.currentDropTarget.el, eventTarget) : {};
          pp = util.merge(pp, extractedParameters);
          pp.element = this.currentDropTarget.targetEl;
          dropEndpoint = this.instance._internal_newEndpoint(pp);
          dropEndpoint._mtNew = true;
          dropEndpoint.deleteOnEmpty = true;
          if (targetDefinition.def.parameters) {
            dropEndpoint.mergeParameters(targetDefinition.def.parameters);
          }
          if (targetDefinition.def.extract) {
            var tpayload = {};
            for (var att in targetDefinition.def.extract) {
              var v = this.currentDropTarget.el.getAttribute(att);
              if (v) {
                tpayload[targetDefinition.def.extract[att]] = v;
              }
            }
            dropEndpoint.mergeParameters(tpayload);
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
        return this.jpc.isReattach() || this.jpc._forceReattach || !util.functionChain(true, false, [[this.jpc.endpoints[0], core.IS_DETACH_ALLOWED, [this.jpc]], [this.jpc.endpoints[1], core.IS_DETACH_ALLOWED, [this.jpc]], [this.jpc, core.IS_DETACH_ALLOWED, [this.jpc]], [this.instance, core.CHECK_CONDITION, [core.INTERCEPT_BEFORE_DETACH, this.jpc]]]);
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
        if (util.isObject(optionalData)) {
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
        util.addToDictionary(this.instance.endpointsByElement, info.id, ep);
      }
    }, {
      key: "_getFloatingAnchorIndex",
      value: function _getFloatingAnchorIndex() {
        return this.floatingIndex == null ? 1 : this.floatingIndex;
      }
    }]);
    return EndpointDragHandler;
  }();

  var GroupDragHandler = function (_ElementDragHandler) {
    _inherits(GroupDragHandler, _ElementDragHandler);
    var _super = _createSuper(GroupDragHandler);
    function GroupDragHandler(instance, dragSelection) {
      var _this;
      _classCallCheck(this, GroupDragHandler);
      _this = _super.call(this, instance, dragSelection);
      _this.instance = instance;
      _this.dragSelection = dragSelection;
      _defineProperty(_assertThisInitialized(_this), "selector", [">", SELECTOR_GROUP, core.SELECTOR_MANAGED_ELEMENT].join(" "));
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
    }]);
    return GroupDragHandler;
  }(ElementDragHandler);

  var HTMLElementOverlay = function () {
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
        var el = createElement(ELEMENT_DIV, {}, o.instance.overlayClass + " " + (o.cssClass ? o.cssClass : ""));
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
          o.canvas.style.position = core.ABSOLUTE;
          o.instance._appendElement(o.canvas, o.instance.getContainer());
          o.instance.getId(o.canvas);
          var ts = "translate(-50%, -50%)";
          o.canvas.style.webkitTransform = ts;
          o.canvas.style.mozTransform = ts;
          o.canvas.style.msTransform = ts;
          o.canvas.style.oTransform = ts;
          o.canvas.style.transform = ts;
          if (!o.isVisible()) {
            o.canvas.style.display = core.NONE;
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
        o.canvas && o.canvas.parentNode && o.canvas.parentNode.removeChild(o.canvas);
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

  var SVGElementOverlay = function (_Overlay) {
    _inherits(SVGElementOverlay, _Overlay);
    var _super = _createSuper(SVGElementOverlay);
    function SVGElementOverlay() {
      var _this;
      _classCallCheck(this, SVGElementOverlay);
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      _this = _super.call.apply(_super, [this].concat(args));
      _defineProperty(_assertThisInitialized(_this), "path", void 0);
      return _this;
    }
    _createClass(SVGElementOverlay, null, [{
      key: "ensurePath",
      value: function ensurePath(o) {
        if (o.path == null) {
          o.path = _node(ELEMENT_PATH, {
            "jtk-overlay-id": o.id
          });
          var parent = null;
          if (o.component instanceof core.Connection) {
            var connector = o.component.connector;
            parent = connector != null ? connector.canvas : null;
          } else if (o.component instanceof core.Endpoint) {
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
  }(core.Overlay);

  var SvgComponent = function () {
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

  function paintSvgConnector(instance, connector, paintStyle, extents) {
    getConnectorElement(instance, connector);
    SvgComponent.paint(connector, false, paintStyle, extents);
    var p = "",
        offset = [0, 0];
    if (extents.xmin < 0) {
      offset[0] = -extents.xmin;
    }
    if (extents.ymin < 0) {
      offset[1] = -extents.ymin;
    }
    if (connector.segments.length > 0) {
      p = instance.getPathData(connector);
      var a = {
        d: p,
        transform: "translate(" + offset[0] + "," + offset[1] + ")",
        "pointer-events": "visibleStroke"
      },
          outlineStyle = null;
      if (paintStyle.outlineStroke) {
        var outlineWidth = paintStyle.outlineWidth || 1,
            outlineStrokeWidth = paintStyle.strokeWidth + 2 * outlineWidth;
        outlineStyle = util.extend({}, paintStyle);
        outlineStyle.stroke = paintStyle.outlineStroke;
        outlineStyle.strokeWidth = outlineStrokeWidth;
        if (connector.bgPath == null) {
          connector.bgPath = _node(ELEMENT_PATH, a);
          instance.addClass(connector.bgPath, instance.connectorOutlineClass);
          _appendAtIndex(connector.canvas, connector.bgPath, 0);
        } else {
          _attr(connector.bgPath, a);
        }
        _applyStyles(connector.canvas, connector.bgPath, outlineStyle);
      }
      var cany = connector;
      if (cany.path == null) {
        cany.path = _node(ELEMENT_PATH, a);
        _appendAtIndex(cany.canvas, cany.path, paintStyle.outlineStroke ? 1 : 0);
      } else {
        if (cany.path.parentNode !== cany.canvas) {
          _appendAtIndex(cany.canvas, cany.path, paintStyle.outlineStroke ? 1 : 0);
        }
        _attr(connector.path, a);
      }
      _applyStyles(connector.canvas, connector.path, paintStyle);
    }
  }
  function getConnectorElement(instance, c) {
    if (c.canvas != null) {
      return c.canvas;
    } else {
      var svg = _node(ELEMENT_SVG, {
        "style": "",
        "width": "0",
        "height": "0",
        "pointer-events": core.NONE,
        "position": core.ABSOLUTE
      });
      c.canvas = svg;
      instance._appendElement(c.canvas, instance.getContainer());
      if (c.cssClass != null) {
        instance.addClass(svg, c.cssClass);
      }
      instance.addClass(svg, instance.connectorClass);
      svg.jtk = svg.jtk || {};
      svg.jtk.connector = c;
      return svg;
    }
  }

  var SvgEndpoint = function () {
    function SvgEndpoint() {
      _classCallCheck(this, SvgEndpoint);
    }
    _createClass(SvgEndpoint, null, [{
      key: "getEndpointElement",
      value: function getEndpointElement(ep) {
        if (ep.canvas != null) {
          return ep.canvas;
        } else {
          var svg = _node(ELEMENT_SVG, {
            "style": "",
            "width": "0",
            "height": "0",
            "pointer-events": core.NONE,
            "position": core.ABSOLUTE
          });
          ep.svg = svg;
          var canvas = createElement(ELEMENT_DIV, {
            position: core.ABSOLUTE
          });
          ep.canvas = canvas;
          var classes = ep.classes.join(" ");
          ep.instance.addClass(canvas, classes);
          var scopes = ep.endpoint.scope.split(/\s/);
          for (var i = 0; i < scopes.length; i++) {
            ep.instance.setAttribute(canvas, core.ATTRIBUTE_SCOPE_PREFIX + scopes[i], common.TRUE);
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
          canvas.style.display = ep.endpoint.visible !== false ? core.BLOCK : core.NONE;
          return canvas;
        }
      }
    }, {
      key: "paint",
      value: function paint(ep, handlers, paintStyle) {
        this.getEndpointElement(ep);
        SvgComponent.paint(ep, true, paintStyle);
        var s = util.extend({}, paintStyle);
        if (s.outlineStroke) {
          s.stroke = s.outlineStroke;
        }
        if (ep.node == null) {
          ep.node = handlers.makeNode(ep, s);
          ep.svg.appendChild(ep.node);
        } else if (handlers.updateNode != null) {
          handlers.updateNode(ep, ep.node);
        }
        _applyStyles(ep.canvas, ep.node, s);
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
    var box = _typeof(el.getBoundingClientRect) !== common.UNDEFINED ? el.getBoundingClientRect() : {
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
    return core.isArrowOverlay(o) || core.isDiamondOverlay(o) || core.isPlainArrowOverlay(o);
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
  function groupDragConstrain(desiredLoc, dragEl, constrainRect, size) {
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
  }
  var BrowserJsPlumbInstance = function (_JsPlumbInstance) {
    _inherits(BrowserJsPlumbInstance, _JsPlumbInstance);
    var _super = _createSuper(BrowserJsPlumbInstance);
    function BrowserJsPlumbInstance(_instanceIndex, defaults) {
      var _this;
      _classCallCheck(this, BrowserJsPlumbInstance);
      _this = _super.call(this, _instanceIndex, defaults);
      _this._instanceIndex = _instanceIndex;
      _defineProperty(_assertThisInitialized(_this), "dragSelection", void 0);
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
      _defineProperty(_assertThisInitialized(_this), "_connectorContextmenu", void 0);
      _defineProperty(_assertThisInitialized(_this), "_connectorMousedown", void 0);
      _defineProperty(_assertThisInitialized(_this), "_connectorMouseup", void 0);
      _defineProperty(_assertThisInitialized(_this), "_endpointMousedown", void 0);
      _defineProperty(_assertThisInitialized(_this), "_endpointMouseup", void 0);
      _defineProperty(_assertThisInitialized(_this), "_overlayMouseover", void 0);
      _defineProperty(_assertThisInitialized(_this), "_overlayMouseout", void 0);
      _defineProperty(_assertThisInitialized(_this), "_elementClick", void 0);
      _defineProperty(_assertThisInitialized(_this), "_elementTap", void 0);
      _defineProperty(_assertThisInitialized(_this), "_elementDblTap", void 0);
      _defineProperty(_assertThisInitialized(_this), "_elementMouseenter", void 0);
      _defineProperty(_assertThisInitialized(_this), "_elementMouseexit", void 0);
      _defineProperty(_assertThisInitialized(_this), "_elementMousemove", void 0);
      _defineProperty(_assertThisInitialized(_this), "_elementMouseup", void 0);
      _defineProperty(_assertThisInitialized(_this), "_elementMousedown", void 0);
      _defineProperty(_assertThisInitialized(_this), "_elementContextmenu", void 0);
      _defineProperty(_assertThisInitialized(_this), "eventManager", void 0);
      _defineProperty(_assertThisInitialized(_this), "draggingClass", "jtk-dragging");
      _defineProperty(_assertThisInitialized(_this), "elementDraggingClass", "jtk-element-dragging");
      _defineProperty(_assertThisInitialized(_this), "hoverClass", "jtk-hover");
      _defineProperty(_assertThisInitialized(_this), "sourceElementDraggingClass", "jtk-source-element-dragging");
      _defineProperty(_assertThisInitialized(_this), "targetElementDraggingClass", "jtk-target-element-dragging");
      _defineProperty(_assertThisInitialized(_this), "hoverSourceClass", "jtk-source-hover");
      _defineProperty(_assertThisInitialized(_this), "hoverTargetClass", "jtk-target-hover");
      _defineProperty(_assertThisInitialized(_this), "dragSelectClass", "jtk-drag-select");
      _defineProperty(_assertThisInitialized(_this), "managedElementsSelector", void 0);
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
      _this.managedElementsSelector = defaults ? defaults.managedElementsSelector || core.SELECTOR_MANAGED_ELEMENT : core.SELECTOR_MANAGED_ELEMENT;
      _this.eventManager = new EventManager();
      _this.dragSelection = new DragSelection(_assertThisInitialized(_this));
      _this.dragManager = new DragManager(_assertThisInitialized(_this), _this.dragSelection, defaults && defaults.dragOptions ? defaults.dragOptions : null);
      _this.dragManager.addHandler(new EndpointDragHandler(_assertThisInitialized(_this)));
      _this.groupDragOptions = {
        constrainFunction: groupDragConstrain
      };
      _this.dragManager.addHandler(new GroupDragHandler(_assertThisInitialized(_this), _this.dragSelection), _this.groupDragOptions);
      _this.elementDragHandler = new ElementDragHandler(_assertThisInitialized(_this), _this.dragSelection);
      _this.elementDragOptions = defaults && defaults.dragOptions || {};
      _this.dragManager.addHandler(_this.elementDragHandler, _this.elementDragOptions);
      var _connClick = function _connClick(event, e) {
        if (!e.defaultPrevented) {
          var connectorElement = findParent(getEventSource(e), SELECTOR_CONNECTOR, this.getContainer(), true);
          this.fire(event, connectorElement.jtk.connector.connection, e);
        }
      };
      _this._connectorClick = _connClick.bind(_assertThisInitialized(_this), EVENT_CONNECTION_CLICK);
      _this._connectorDblClick = _connClick.bind(_assertThisInitialized(_this), EVENT_CONNECTION_DBL_CLICK);
      _this._connectorTap = _connClick.bind(_assertThisInitialized(_this), EVENT_CONNECTION_TAP);
      _this._connectorDblTap = _connClick.bind(_assertThisInitialized(_this), EVENT_CONNECTION_DBL_TAP);
      var _connectorHover = function _connectorHover(state, e) {
        var el = getEventSource(e).parentNode;
        if (el.jtk && el.jtk.connector) {
          this.setConnectorHover(el.jtk.connector, state);
          this.fire(state ? EVENT_CONNECTION_MOUSEOVER : EVENT_CONNECTION_MOUSEOUT, el.jtk.connector.connection, e);
        }
      };
      _this._connectorMouseover = _connectorHover.bind(_assertThisInitialized(_this), true);
      _this._connectorMouseout = _connectorHover.bind(_assertThisInitialized(_this), false);
      var _connectorMouseupdown = function _connectorMouseupdown(state, e) {
        var el = getEventSource(e).parentNode;
        if (el.jtk && el.jtk.connector) {
          this.fire(state ? EVENT_CONNECTION_MOUSEUP : EVENT_CONNECTION_MOUSEDOWN, el.jtk.connector.connection, e);
        }
      };
      _this._connectorMouseup = _connectorMouseupdown.bind(_assertThisInitialized(_this), true);
      _this._connectorMousedown = _connectorMouseupdown.bind(_assertThisInitialized(_this), false);
      _this._connectorContextmenu = function (e) {
        var el = getEventSource(e).parentNode;
        if (el.jtk && el.jtk.connector) {
          this.fire(EVENT_CONNECTION_CONTEXTMENU, el.jtk.connector.connection, e);
        }
      }.bind(_assertThisInitialized(_this));
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
      var _endpointMouseupdown = function _endpointMouseupdown(state, e) {
        var el = getEventSource(e);
        if (el.jtk && el.jtk.endpoint) {
          this.fire(state ? EVENT_ENDPOINT_MOUSEUP : EVENT_ENDPOINT_MOUSEDOWN, el.jtk.endpoint, e);
        }
      };
      _this._endpointMouseup = _endpointMouseupdown.bind(_assertThisInitialized(_this), true);
      _this._endpointMousedown = _endpointMouseupdown.bind(_assertThisInitialized(_this), false);
      var _oClick = function (method, e) {
        consume(e);
        var overlayElement = findParent(getEventSource(e), SELECTOR_OVERLAY, this.getContainer(), true);
        var overlay = overlayElement.jtk.overlay;
        if (overlay) {
          this.fireOverlayMethod(overlay, method, e);
        }
      }.bind(_assertThisInitialized(_this));
      _this._overlayClick = _oClick.bind(_assertThisInitialized(_this), EVENT_CLICK);
      _this._overlayDblClick = _oClick.bind(_assertThisInitialized(_this), EVENT_DBL_CLICK);
      _this._overlayTap = _oClick.bind(_assertThisInitialized(_this), EVENT_TAP);
      _this._overlayDblTap = _oClick.bind(_assertThisInitialized(_this), EVENT_DBL_TAP);
      var _overlayHover = function _overlayHover(state, e) {
        var overlayElement = findParent(getEventSource(e), SELECTOR_OVERLAY, this.getContainer(), true);
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
      _this._elementMousemove = function (e) {
        this.fire(EVENT_ELEMENT_MOUSE_MOVE, getEventSource(e), e);
      }.bind(_assertThisInitialized(_this));
      _this._elementMouseup = function (e) {
        this.fire(EVENT_ELEMENT_MOUSE_UP, getEventSource(e), e);
      }.bind(_assertThisInitialized(_this));
      _this._elementMousedown = function (e) {
        this.fire(EVENT_ELEMENT_MOUSE_DOWN, getEventSource(e), e);
      }.bind(_assertThisInitialized(_this));
      _this._elementContextmenu = function (e) {
        this.fire(EVENT_ELEMENT_CONTEXTMENU, getEventSource(e), e);
      }.bind(_assertThisInitialized(_this));
      _this._attachEventDelegates();
      return _this;
    }
    _createClass(BrowserJsPlumbInstance, [{
      key: "fireOverlayMethod",
      value: function fireOverlayMethod(overlay, event, e) {
        var stem = overlay.component instanceof core.Connection ? CONNECTION : ENDPOINT;
        var mappedEvent = compoundEvent(stem, event);
        overlay.fire(event, {
          e: e,
          overlay: overlay
        });
        this.fire(mappedEvent, overlay.component, e);
      }
    }, {
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
      key: "_getAssociatedElements",
      value: function _getAssociatedElements(el) {
        var a = [];
        if (el.nodeType !== 3 && el.nodeType !== 8) {
          var els = el.querySelectorAll(core.SELECTOR_MANAGED_ELEMENT);
          Array.prototype.push.apply(a, els);
        }
        return a.filter(function (_a) {
          return _a.nodeType !== 3 && _a.nodeType !== 8;
        });
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
          util.forEach(el, function (el) {
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
          util.forEach(el, function (_el) {
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
          var pp = jel.offsetParent != null ? this.getStyle(jel.offsetParent, PROPERTY_POSITION) : core.STATIC,
              p = this.getStyle(jel, PROPERTY_POSITION);
          if (p !== core.ABSOLUTE && p !== core.FIXED && pp !== core.ABSOLUTE && pp !== core.FIXED) {
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
        if (_typeof(window.getComputedStyle) !== common.UNDEFINED) {
          return getComputedStyle(el, null).getPropertyValue(prop);
        } else {
          return el.currentStyle[prop];
        }
      }
    }, {
      key: "getGroupContentArea",
      value: function getGroupContentArea(group) {
        var da = this.getSelector(group.el, SELECTOR_GROUP_CONTAINER);
        return da && da.length > 0 ? da[0] : group.el;
      }
    }, {
      key: "getSelector",
      value: function getSelector(ctx, spec) {
        var sel = null;
        if (arguments.length === 1) {
          if (!util.isString(ctx)) {
            var nodeList = document.createDocumentFragment();
            nodeList.appendChild(ctx);
            return util.fromArray(nodeList.childNodes);
          }
          sel = util.fromArray(document.querySelectorAll(ctx));
        } else {
          sel = util.fromArray(ctx.querySelectorAll(spec));
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
          this.removeAttribute(element, core.ATTRIBUTE_NOT_DRAGGABLE);
        } else {
          this.setAttribute(element, core.ATTRIBUTE_NOT_DRAGGABLE, common.TRUE);
        }
      }
    }, {
      key: "isDraggable",
      value: function isDraggable(el) {
        var d = this.getAttribute(el, core.ATTRIBUTE_NOT_DRAGGABLE);
        return d == null || d === common.FALSE;
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
        this.eventManager.on(currentContainer, EVENT_CLICK, this.managedElementsSelector, this._elementClick);
        this.eventManager.on(currentContainer, EVENT_TAP, this.managedElementsSelector, this._elementTap);
        this.eventManager.on(currentContainer, EVENT_DBL_TAP, this.managedElementsSelector, this._elementDblTap);
        this.eventManager.on(currentContainer, EVENT_MOUSEOVER, SELECTOR_CONNECTOR, this._connectorMouseover);
        this.eventManager.on(currentContainer, EVENT_MOUSEOUT, SELECTOR_CONNECTOR, this._connectorMouseout);
        this.eventManager.on(currentContainer, EVENT_CONTEXTMENU, SELECTOR_CONNECTOR, this._connectorContextmenu);
        this.eventManager.on(currentContainer, EVENT_MOUSEUP, SELECTOR_CONNECTOR, this._connectorMouseup);
        this.eventManager.on(currentContainer, EVENT_MOUSEDOWN, SELECTOR_CONNECTOR, this._connectorMousedown);
        this.eventManager.on(currentContainer, EVENT_MOUSEOVER, SELECTOR_ENDPOINT, this._endpointMouseover);
        this.eventManager.on(currentContainer, EVENT_MOUSEOUT, SELECTOR_ENDPOINT, this._endpointMouseout);
        this.eventManager.on(currentContainer, EVENT_MOUSEUP, SELECTOR_ENDPOINT, this._endpointMouseup);
        this.eventManager.on(currentContainer, EVENT_MOUSEDOWN, SELECTOR_ENDPOINT, this._endpointMousedown);
        this.eventManager.on(currentContainer, EVENT_MOUSEOVER, SELECTOR_OVERLAY, this._overlayMouseover);
        this.eventManager.on(currentContainer, EVENT_MOUSEOUT, SELECTOR_OVERLAY, this._overlayMouseout);
        this.eventManager.on(currentContainer, EVENT_MOUSEOVER, core.SELECTOR_MANAGED_ELEMENT, this._elementMouseenter);
        this.eventManager.on(currentContainer, EVENT_MOUSEOUT, core.SELECTOR_MANAGED_ELEMENT, this._elementMouseexit);
        this.eventManager.on(currentContainer, EVENT_MOUSEMOVE, core.SELECTOR_MANAGED_ELEMENT, this._elementMousemove);
        this.eventManager.on(currentContainer, EVENT_MOUSEUP, core.SELECTOR_MANAGED_ELEMENT, this._elementMouseup);
        this.eventManager.on(currentContainer, EVENT_MOUSEDOWN, core.SELECTOR_MANAGED_ELEMENT, this._elementMousedown);
        this.eventManager.on(currentContainer, EVENT_CONTEXTMENU, core.SELECTOR_MANAGED_ELEMENT, this._elementContextmenu);
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
          this.eventManager.off(currentContainer, EVENT_CONTEXTMENU, this._connectorContextmenu);
          this.eventManager.off(currentContainer, EVENT_MOUSEUP, this._connectorMouseup);
          this.eventManager.off(currentContainer, EVENT_MOUSEDOWN, this._connectorMousedown);
          this.eventManager.off(currentContainer, EVENT_MOUSEOVER, this._endpointMouseover);
          this.eventManager.off(currentContainer, EVENT_MOUSEOUT, this._endpointMouseout);
          this.eventManager.off(currentContainer, EVENT_MOUSEUP, this._endpointMouseup);
          this.eventManager.off(currentContainer, EVENT_MOUSEDOWN, this._endpointMousedown);
          this.eventManager.off(currentContainer, EVENT_MOUSEOVER, this._overlayMouseover);
          this.eventManager.off(currentContainer, EVENT_MOUSEOUT, this._overlayMouseout);
          this.eventManager.off(currentContainer, EVENT_MOUSEENTER, this._elementMouseenter);
          this.eventManager.off(currentContainer, EVENT_MOUSEEXIT, this._elementMouseexit);
          this.eventManager.off(currentContainer, EVENT_MOUSEMOVE, this._elementMousemove);
          this.eventManager.off(currentContainer, EVENT_MOUSEUP, this._elementMouseup);
          this.eventManager.off(currentContainer, EVENT_MOUSEDOWN, this._elementMousedown);
          this.eventManager.off(currentContainer, EVENT_CONTEXTMENU, this._elementContextmenu);
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
        this.setAttribute(newContainer, ATTRIBUTE_CONTAINER, util.uuid().replace("-", ""));
        var currentContainer = this.getContainer();
        if (currentContainer != null) {
          currentContainer.removeAttribute(ATTRIBUTE_CONTAINER);
          var children = util.fromArray(currentContainer.childNodes).filter(function (cn) {
            return cn != null && (_this4.hasClass(cn, core.CLASS_CONNECTOR) || _this4.hasClass(cn, core.CLASS_ENDPOINT) || _this4.hasClass(cn, core.CLASS_OVERLAY) || cn.getAttribute && cn.getAttribute(core.ATTRIBUTE_MANAGED) != null);
          });
          util.forEach(children, function (el) {
            newContainer.appendChild(el);
          });
        }
        _get(_getPrototypeOf(BrowserJsPlumbInstance.prototype), "setContainer", this).call(this, newContainer);
        if (this.eventManager != null) {
          this._attachEventDelegates();
        }
        if (this.dragManager != null) {
          this.dragManager.addHandler(new EndpointDragHandler(this));
          this.dragManager.addHandler(new GroupDragHandler(this, this.dragSelection), this.groupDragOptions);
          this.elementDragHandler = new ElementDragHandler(this, this.dragSelection);
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
        var els = container.querySelectorAll([core.SELECTOR_MANAGED_ELEMENT, SELECTOR_ENDPOINT, SELECTOR_CONNECTOR, SELECTOR_OVERLAY].join(","));
        util.forEach(els, function (el) {
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
        util.forEach(el, function (_el) {
          return _this5.dragSelection.add(_el);
        });
      }
    }, {
      key: "clearDragSelection",
      value: function clearDragSelection() {
        this.dragSelection.clear();
      }
    }, {
      key: "removeFromDragSelection",
      value: function removeFromDragSelection() {
        var _this6 = this;
        for (var _len2 = arguments.length, el = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          el[_key2] = arguments[_key2];
        }
        util.forEach(el, function (_el) {
          return _this6.dragSelection.remove(_el);
        });
      }
    }, {
      key: "toggleDragSelection",
      value: function toggleDragSelection() {
        var _this7 = this;
        for (var _len3 = arguments.length, el = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          el[_key3] = arguments[_key3];
        }
        util.forEach(el, function (_el) {
          return _this7.dragSelection.toggle(_el);
        });
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
      key: "addOverlayClass",
      value: function addOverlayClass(o, clazz) {
        if (core.isLabelOverlay(o)) {
          o.instance.addClass(getLabelElement(o), clazz);
        } else if (isSVGElementOverlay(o)) {
          o.instance.addClass(SVGElementOverlay.ensurePath(o), clazz);
        } else if (core.isCustomOverlay(o)) {
          o.instance.addClass(getCustomElement(o), clazz);
        } else {
          throw "Could not add class to overlay of type [" + o.type + "]";
        }
      }
    }, {
      key: "removeOverlayClass",
      value: function removeOverlayClass(o, clazz) {
        if (core.isLabelOverlay(o)) {
          o.instance.removeClass(getLabelElement(o), clazz);
        } else if (isSVGElementOverlay(o)) {
          o.instance.removeClass(SVGElementOverlay.ensurePath(o), clazz);
        } else if (core.isCustomOverlay(o)) {
          o.instance.removeClass(getCustomElement(o), clazz);
        } else {
          throw "Could not remove class from overlay of type [" + o.type + "]";
        }
      }
    }, {
      key: "paintOverlay",
      value: function paintOverlay(o, params, extents) {
        if (core.isLabelOverlay(o)) {
          getLabelElement(o);
          var XY = o.component.getXY();
          o.canvas.style.left = XY.x + params.d.minx + "px";
          o.canvas.style.top = XY.y + params.d.miny + "px";
        } else if (isSVGElementOverlay(o)) {
          var path = isNaN(params.d.cxy.x) || isNaN(params.d.cxy.y) ? "M 0 0" : "M" + params.d.hxy.x + "," + params.d.hxy.y + " L" + params.d.tail[0].x + "," + params.d.tail[0].y + " L" + params.d.cxy.x + "," + params.d.cxy.y + " L" + params.d.tail[1].x + "," + params.d.tail[1].y + " L" + params.d.hxy.x + "," + params.d.hxy.y;
          SVGElementOverlay.paint(o, path, params, extents);
        } else if (core.isCustomOverlay(o)) {
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
        if (core.isLabelOverlay(o)) {
          s(getLabelElement(o));
        } else if (core.isCustomOverlay(o)) {
          s(getCustomElement(o));
        } else if (isSVGElementOverlay(o)) {
          s(o.path);
        }
      }
    }, {
      key: "reattachOverlay",
      value: function reattachOverlay(o, c) {
        if (core.isLabelOverlay(o)) {
          o.instance._appendElement(getLabelElement(o), this.getContainer());
        } else if (core.isCustomOverlay(o)) {
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
        if (core.isLabelOverlay(o)) {
          canvas = getLabelElement(o);
        } else if (core.isCustomOverlay(o)) {
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
        if (core.isLabelOverlay(o)) {
          var el = getLabelElement(o);
          el.parentNode.removeChild(el);
          delete o.canvas;
          delete o.cachedDimensions;
        } else if (core.isArrowOverlay(o) || core.isDiamondOverlay(o) || core.isPlainArrowOverlay(o)) {
          SVGElementOverlay.destroy(o);
        } else if (core.isCustomOverlay(o)) {
          var _el2 = getCustomElement(o);
          _el2.parentNode.removeChild(_el2);
          delete o.canvas;
          delete o.cachedDimensions;
        }
      }
    }, {
      key: "drawOverlay",
      value: function drawOverlay(o, component, paintStyle, absolutePosition) {
        if (core.isLabelOverlay(o) || core.isCustomOverlay(o)) {
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
            } else if (component instanceof core.EndpointRepresentation) {
              var locToUse = Array.isArray(o.location) ? o.location : [o.location, o.location];
              cxy = {
                x: locToUse[0] * component.w,
                y: locToUse[1] * component.h
              };
            } else {
              var loc = o.location,
                  absolute = false;
              if (util.isString(o.location) || o.location < 0 || o.location > 1) {
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
              xmin: minx,
              xmax: minx + td.w,
              ymin: miny,
              ymax: miny + td.h
            };
          } else {
            return {
              xmin: 0,
              xmax: 0,
              ymin: 0,
              ymax: 0
            };
          }
        } else if (core.isArrowOverlay(o) || core.isDiamondOverlay(o) || core.isPlainArrowOverlay(o)) {
          return o.draw(component, paintStyle, absolutePosition);
        } else {
          throw "Could not draw overlay of type [" + o.type + "]";
        }
      }
    }, {
      key: "updateLabel",
      value: function updateLabel(o) {
        if (util.isFunction(o.label)) {
          var lt = o.label(this);
          if (lt != null) {
            getLabelElement(o).innerText = lt;
          } else {
            getLabelElement(o).innerText = "";
          }
        } else {
          if (o.labelText == null) {
            o.labelText = o.label;
            if (o.labelText != null) {
              getLabelElement(o).innerText = o.labelText;
            } else {
              getLabelElement(o).innerText = "";
            }
          }
        }
      }
    }, {
      key: "setHover",
      value: function setHover(component, hover) {
        component._hover = hover;
        if (component instanceof core.Endpoint && component.endpoint != null) {
          this.setEndpointHover(component, hover);
        } else if (component instanceof core.Connection && component.connector != null) {
          this.setConnectorHover(component.connector, hover);
        }
      }
    }, {
      key: "paintConnector",
      value: function paintConnector(connector, paintStyle, extents) {
        paintSvgConnector(this, connector, paintStyle, extents);
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
      key: "destroyConnector",
      value: function destroyConnector(connection) {
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
        var anchorClass = this.endpointAnchorClassPrefix + (ep.currentAnchorClass ? "-" + ep.currentAnchorClass : "");
        this.removeClass(ep.element, anchorClass);
        cleanup(ep.endpoint);
      }
    }, {
      key: "renderEndpoint",
      value: function renderEndpoint(ep, paintStyle) {
        var renderer = endpointMap[ep.endpoint.type];
        if (renderer != null) {
          SvgEndpoint.paint(ep.endpoint, renderer, paintStyle);
        } else {
          util.log("jsPlumb: no endpoint renderer found for type [" + ep.endpoint.type + "]");
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
      key: "setGroupVisible",
      value: function setGroupVisible(group, state) {
        var m = group.el.querySelectorAll(core.SELECTOR_MANAGED_ELEMENT);
        for (var i = 0; i < m.length; i++) {
          if (state) {
            this.show(m[i], true);
          } else {
            this.hide(m[i], true);
          }
        }
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
  }(core.JsPlumbInstance);

  var CIRCLE = "circle";
  var register$2 = function register() {
    registerEndpointRenderer(core.DotEndpoint.type, {
      makeNode: function makeNode(ep, style) {
        return _node(CIRCLE, {
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

  var RECT = "rect";
  var register$1 = function register() {
    registerEndpointRenderer(core.RectangleEndpoint.type, {
      makeNode: function makeNode(ep, style) {
        return _node(RECT, {
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
  var register = function register() {
    registerEndpointRenderer(core.BlankEndpoint.type, {
      makeNode: function makeNode(ep, style) {
        return _node("rect", BLANK_ATTRIBUTES);
      },
      updateNode: function updateNode(ep, node) {
        _attr(node, BLANK_ATTRIBUTES);
      }
    });
  };

  register$2();
  register();
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

  exports.ATTRIBUTE_CONTAINER = ATTRIBUTE_CONTAINER;
  exports.ATTRIBUTE_GROUP_CONTENT = ATTRIBUTE_GROUP_CONTENT;
  exports.ATTRIBUTE_JTK_ENABLED = ATTRIBUTE_JTK_ENABLED;
  exports.ATTRIBUTE_JTK_SCOPE = ATTRIBUTE_JTK_SCOPE;
  exports.BrowserJsPlumbInstance = BrowserJsPlumbInstance;
  exports.CONNECTION = CONNECTION;
  exports.Collicat = Collicat;
  exports.Drag = Drag;
  exports.ELEMENT = ELEMENT;
  exports.ELEMENT_DIV = ELEMENT_DIV;
  exports.ENDPOINT = ENDPOINT;
  exports.EVENT_BEFORE_START = EVENT_BEFORE_START;
  exports.EVENT_CLICK = EVENT_CLICK;
  exports.EVENT_CONNECTION_ABORT = EVENT_CONNECTION_ABORT;
  exports.EVENT_CONNECTION_CLICK = EVENT_CONNECTION_CLICK;
  exports.EVENT_CONNECTION_CONTEXTMENU = EVENT_CONNECTION_CONTEXTMENU;
  exports.EVENT_CONNECTION_DBL_CLICK = EVENT_CONNECTION_DBL_CLICK;
  exports.EVENT_CONNECTION_DBL_TAP = EVENT_CONNECTION_DBL_TAP;
  exports.EVENT_CONNECTION_DRAG = EVENT_CONNECTION_DRAG;
  exports.EVENT_CONNECTION_MOUSEDOWN = EVENT_CONNECTION_MOUSEDOWN;
  exports.EVENT_CONNECTION_MOUSEOUT = EVENT_CONNECTION_MOUSEOUT;
  exports.EVENT_CONNECTION_MOUSEOVER = EVENT_CONNECTION_MOUSEOVER;
  exports.EVENT_CONNECTION_MOUSEUP = EVENT_CONNECTION_MOUSEUP;
  exports.EVENT_CONNECTION_TAP = EVENT_CONNECTION_TAP;
  exports.EVENT_CONTEXTMENU = EVENT_CONTEXTMENU;
  exports.EVENT_DBL_CLICK = EVENT_DBL_CLICK;
  exports.EVENT_DBL_TAP = EVENT_DBL_TAP;
  exports.EVENT_DRAG = EVENT_DRAG;
  exports.EVENT_DRAG_MOVE = EVENT_DRAG_MOVE;
  exports.EVENT_DRAG_START = EVENT_DRAG_START;
  exports.EVENT_DRAG_STOP = EVENT_DRAG_STOP;
  exports.EVENT_DROP = EVENT_DROP;
  exports.EVENT_ELEMENT_CLICK = EVENT_ELEMENT_CLICK;
  exports.EVENT_ELEMENT_CONTEXTMENU = EVENT_ELEMENT_CONTEXTMENU;
  exports.EVENT_ELEMENT_DBL_CLICK = EVENT_ELEMENT_DBL_CLICK;
  exports.EVENT_ELEMENT_DBL_TAP = EVENT_ELEMENT_DBL_TAP;
  exports.EVENT_ELEMENT_MOUSE_DOWN = EVENT_ELEMENT_MOUSE_DOWN;
  exports.EVENT_ELEMENT_MOUSE_MOVE = EVENT_ELEMENT_MOUSE_MOVE;
  exports.EVENT_ELEMENT_MOUSE_OUT = EVENT_ELEMENT_MOUSE_OUT;
  exports.EVENT_ELEMENT_MOUSE_OVER = EVENT_ELEMENT_MOUSE_OVER;
  exports.EVENT_ELEMENT_MOUSE_UP = EVENT_ELEMENT_MOUSE_UP;
  exports.EVENT_ELEMENT_TAP = EVENT_ELEMENT_TAP;
  exports.EVENT_ENDPOINT_CLICK = EVENT_ENDPOINT_CLICK;
  exports.EVENT_ENDPOINT_DBL_CLICK = EVENT_ENDPOINT_DBL_CLICK;
  exports.EVENT_ENDPOINT_DBL_TAP = EVENT_ENDPOINT_DBL_TAP;
  exports.EVENT_ENDPOINT_MOUSEDOWN = EVENT_ENDPOINT_MOUSEDOWN;
  exports.EVENT_ENDPOINT_MOUSEOUT = EVENT_ENDPOINT_MOUSEOUT;
  exports.EVENT_ENDPOINT_MOUSEOVER = EVENT_ENDPOINT_MOUSEOVER;
  exports.EVENT_ENDPOINT_MOUSEUP = EVENT_ENDPOINT_MOUSEUP;
  exports.EVENT_ENDPOINT_TAP = EVENT_ENDPOINT_TAP;
  exports.EVENT_FOCUS = EVENT_FOCUS;
  exports.EVENT_MOUSEDOWN = EVENT_MOUSEDOWN;
  exports.EVENT_MOUSEENTER = EVENT_MOUSEENTER;
  exports.EVENT_MOUSEEXIT = EVENT_MOUSEEXIT;
  exports.EVENT_MOUSEMOVE = EVENT_MOUSEMOVE;
  exports.EVENT_MOUSEOUT = EVENT_MOUSEOUT;
  exports.EVENT_MOUSEOVER = EVENT_MOUSEOVER;
  exports.EVENT_MOUSEUP = EVENT_MOUSEUP;
  exports.EVENT_OUT = EVENT_OUT;
  exports.EVENT_OVER = EVENT_OVER;
  exports.EVENT_REVERT = EVENT_REVERT;
  exports.EVENT_START = EVENT_START;
  exports.EVENT_STOP = EVENT_STOP;
  exports.EVENT_TAP = EVENT_TAP;
  exports.ElementDragHandler = ElementDragHandler;
  exports.EventManager = EventManager;
  exports.PROPERTY_POSITION = PROPERTY_POSITION;
  exports.SELECTOR_CONNECTOR = SELECTOR_CONNECTOR;
  exports.SELECTOR_ENDPOINT = SELECTOR_ENDPOINT;
  exports.SELECTOR_GROUP = SELECTOR_GROUP;
  exports.SELECTOR_GROUP_CONTAINER = SELECTOR_GROUP_CONTAINER;
  exports.SELECTOR_OVERLAY = SELECTOR_OVERLAY;
  exports.addClass = addClass;
  exports.compoundEvent = compoundEvent;
  exports.consume = consume;
  exports.createElement = createElement;
  exports.createElementNS = createElementNS;
  exports.findParent = findParent;
  exports.getClass = getClass;
  exports.getEventSource = getEventSource;
  exports.getPositionOnElement = getPositionOnElement;
  exports.getTouch = getTouch;
  exports.groupDragConstrain = groupDragConstrain;
  exports.hasClass = hasClass;
  exports.isArrayLike = isArrayLike;
  exports.isInsideParent = isInsideParent;
  exports.isNodeList = isNodeList;
  exports.matchesSelector = matchesSelector$1;
  exports.newInstance = newInstance;
  exports.offsetRelativeToRoot = offsetRelativeToRoot;
  exports.pageLocation = pageLocation;
  exports.ready = ready;
  exports.registerEndpointRenderer = registerEndpointRenderer;
  exports.removeClass = removeClass;
  exports.size = size;
  exports.toggleClass = toggleClass;
  exports.touchCount = touchCount;
  exports.touches = touches;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

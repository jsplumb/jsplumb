(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.jsPlumb = {}));
}(this, (function (exports) { 'use strict';

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

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
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

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance");
  }

  function noSuchPoint() {
    return {
      d: Infinity,
      x: null,
      y: null,
      l: null,
      x1: null,
      y1: null,
      x2: null,
      y2: null
    };
  }
  function EMPTY_BOUNDS() {
    return {
      minX: Infinity,
      maxX: -Infinity,
      minY: Infinity,
      maxY: -Infinity
    };
  }
  var AbstractSegment =
  function () {
    function AbstractSegment(params) {
      _classCallCheck(this, AbstractSegment);
      this.params = params;
      _defineProperty(this, "x1", void 0);
      _defineProperty(this, "x2", void 0);
      _defineProperty(this, "y1", void 0);
      _defineProperty(this, "y2", void 0);
      _defineProperty(this, "bounds", void 0);
      _defineProperty(this, "type", void 0);
      this.x1 = params.x1;
      this.y1 = params.y1;
      this.x2 = params.x2;
      this.y2 = params.y2;
    }
    _createClass(AbstractSegment, [{
      key: "getBounds",
      value: function getBounds() {
        return this.bounds;
      }
    }, {
      key: "findClosestPointOnPath",
      value: function findClosestPointOnPath(x, y) {
        return noSuchPoint();
      }
    }, {
      key: "lineIntersection",
      value: function lineIntersection(x1, y1, x2, y2) {
        return [];
      }
    }, {
      key: "boxIntersection",
      value: function boxIntersection(x, y, w, h) {
        var a = [];
        a.push.apply(a, this.lineIntersection(x, y, x + w, y));
        a.push.apply(a, this.lineIntersection(x + w, y, x + w, y + h));
        a.push.apply(a, this.lineIntersection(x + w, y + h, x, y + h));
        a.push.apply(a, this.lineIntersection(x, y + h, x, y));
        return a;
      }
    }, {
      key: "boundingBoxIntersection",
      value: function boundingBoxIntersection(box) {
        return this.boxIntersection(box.x, box.y, box.w, box.h);
      }
    }]);
    return AbstractSegment;
  }();

  var EndpointRepresentation =
  function () {
    function EndpointRepresentation(endpoint) {
      _classCallCheck(this, EndpointRepresentation);
      this.endpoint = endpoint;
      _defineProperty(this, "typeId", void 0);
      _defineProperty(this, "x", void 0);
      _defineProperty(this, "y", void 0);
      _defineProperty(this, "w", void 0);
      _defineProperty(this, "h", void 0);
      _defineProperty(this, "computedValue", void 0);
      _defineProperty(this, "bounds", EMPTY_BOUNDS());
      _defineProperty(this, "classes", []);
      _defineProperty(this, "instance", void 0);
      this.instance = endpoint.instance;
      if (endpoint.cssClass) {
        this.classes.push(endpoint.cssClass);
      }
    }
    _createClass(EndpointRepresentation, [{
      key: "addClass",
      value: function addClass(c) {
        this.classes.push(c);
        this.instance.addEndpointClass(this.endpoint, c);
      }
    }, {
      key: "removeClass",
      value: function removeClass(c) {
        this.classes = this.classes.filter(function (_c) {
          return _c !== c;
        });
        this.instance.removeEndpointClass(this.endpoint, c);
      }
    }, {
      key: "clone",
      value: function clone() {
        return null;
      }
    }, {
      key: "compute",
      value: function compute(anchorPoint, orientation, endpointStyle) {
        this.computedValue = this._compute(anchorPoint, orientation, endpointStyle);
        this.bounds.minX = this.x;
        this.bounds.minY = this.y;
        this.bounds.maxX = this.x + this.w;
        this.bounds.maxY = this.y + this.h;
      }
    }, {
      key: "setVisible",
      value: function setVisible(v) {
        this.instance.setEndpointVisible(this.endpoint, v);
      }
    }]);
    return EndpointRepresentation;
  }();

  var endpointMap = {};
  var EndpointFactory = {
    get: function get(ep, name, params) {
      var e = endpointMap[name];
      if (!e) {
        throw {
          message: "jsPlumb: unknown endpoint type '" + name + "'"
        };
      } else {
        return new e(ep, params);
      }
    },
    register: function register(name, ep) {
      endpointMap[name] = ep;
    }
  };

  var DotEndpoint =
  function (_EndpointRepresentati) {
    _inherits(DotEndpoint, _EndpointRepresentati);
    function DotEndpoint(endpoint, params) {
      var _this;
      _classCallCheck(this, DotEndpoint);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(DotEndpoint).call(this, endpoint));
      _defineProperty(_assertThisInitialized(_this), "radius", void 0);
      _defineProperty(_assertThisInitialized(_this), "defaultOffset", void 0);
      _defineProperty(_assertThisInitialized(_this), "defaultInnerRadius", void 0);
      params = params || {};
      _this.radius = params.radius || 5;
      _this.defaultOffset = 0.5 * _this.radius;
      _this.defaultInnerRadius = _this.radius / 3;
      return _this;
    }
    _createClass(DotEndpoint, [{
      key: "_compute",
      value: function _compute(anchorPoint, orientation, endpointStyle) {
        var x = anchorPoint[0] - this.radius,
            y = anchorPoint[1] - this.radius,
            w = this.radius * 2,
            h = this.radius * 2;
        if (endpointStyle && endpointStyle.stroke) {
          var lw = endpointStyle.strokeWidth || 1;
          x -= lw;
          y -= lw;
          w += lw * 2;
          h += lw * 2;
        }
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        return [x, y, w, h, this.radius];
      }
    }, {
      key: "getType",
      value: function getType() {
        return DotEndpoint.dotEndpointType;
      }
    }]);
    return DotEndpoint;
  }(EndpointRepresentation);
  _defineProperty(DotEndpoint, "dotEndpointType", "Dot");
  function register() {
    EndpointFactory.register("Dot", DotEndpoint);
  }

  var BlankEndpoint =
  function (_EndpointRepresentati) {
    _inherits(BlankEndpoint, _EndpointRepresentati);
    function BlankEndpoint(endpoint, params) {
      _classCallCheck(this, BlankEndpoint);
      return _possibleConstructorReturn(this, _getPrototypeOf(BlankEndpoint).call(this, endpoint));
    }
    _createClass(BlankEndpoint, [{
      key: "_compute",
      value: function _compute(anchorPoint, orientation, endpointStyle) {
        this.x = anchorPoint[0];
        this.y = anchorPoint[1];
        this.w = 10;
        this.h = 0;
        return [anchorPoint[0], anchorPoint[1], 10, 0];
      }
    }, {
      key: "getType",
      value: function getType() {
        return "Blank";
      }
    }]);
    return BlankEndpoint;
  }(EndpointRepresentation);
  function register$1() {
    EndpointFactory.register("Blank", BlankEndpoint);
  }

  var RectangleEndpoint =
  function (_EndpointRepresentati) {
    _inherits(RectangleEndpoint, _EndpointRepresentati);
    function RectangleEndpoint(endpoint, params) {
      var _this;
      _classCallCheck(this, RectangleEndpoint);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(RectangleEndpoint).call(this, endpoint));
      _defineProperty(_assertThisInitialized(_this), "width", void 0);
      _defineProperty(_assertThisInitialized(_this), "height", void 0);
      params = params || {};
      _this.width = params.width || 10;
      _this.height = params.height || 10;
      return _this;
    }
    _createClass(RectangleEndpoint, [{
      key: "_compute",
      value: function _compute(anchorPoint, orientation, endpointStyle) {
        var width = endpointStyle.width || this.width,
            height = endpointStyle.height || this.height,
            x = anchorPoint[0] - width / 2,
            y = anchorPoint[1] - height / 2;
        this.x = x;
        this.y = y;
        this.w = width;
        this.h = height;
        return [x, y, width, height];
      }
    }, {
      key: "getType",
      value: function getType() {
        return "Rectangle";
      }
    }]);
    return RectangleEndpoint;
  }(EndpointRepresentation);
  function register$2() {
    EndpointFactory.register("Rectangle", RectangleEndpoint);
  }

  function filterList(list, value, missingIsFalse) {
    if (list === "*") {
      return true;
    }
    return list.length > 0 ? list.indexOf(value) !== -1 : !missingIsFalse;
  }
  function extend(o1, o2, keys) {
    var i;
    o1 = o1 || {};
    o2 = o2 || {};
    var _o1 = o1,
        _o2 = o2;
    if (keys) {
      for (i = 0; i < keys.length; i++) {
        _o1[keys[i]] = _o2[keys[i]];
      }
    } else {
      for (i in _o2) {
        _o1[i] = _o2[i];
      }
    }
    return o1;
  }
  function isArray(a) {
    return Array.isArray(a);
  }
  function isNumber(n) {
    return Object.prototype.toString.call(n) === "[object Number]";
  }
  function isString(s) {
    return typeof s === "string";
  }
  function isBoolean(s) {
    return typeof s === "boolean";
  }
  function isDate(o) {
    return Object.prototype.toString.call(o) === "[object Date]";
  }
  function isFunction(o) {
    return Object.prototype.toString.call(o) === "[object Function]";
  }
  function isEmpty(o) {
    for (var i in o) {
      if (o.hasOwnProperty(i)) {
        return false;
      }
    }
    return true;
  }
  var IS = {
    anObject: function anObject(o) {
      return o == null ? false : Object.prototype.toString.call(o) === "[object Object]";
    },
    aString: function aString(o) {
      return isString(o);
    }
  };
  function clone(a) {
    if (isString(a)) {
      return "" + a;
    } else if (isBoolean(a)) {
      return !!a;
    } else if (isDate(a)) {
      return new Date(a.getTime());
    } else if (isFunction(a)) {
      return a;
    } else if (isArray(a)) {
      var b = [];
      for (var i = 0; i < a.length; i++) {
        b.push(clone(a[i]));
      }
      return b;
    } else if (IS.anObject(a)) {
      var c = {};
      for (var j in a) {
        c[j] = clone(a[j]);
      }
      return c;
    } else {
      return a;
    }
  }
  function merge(a, b, collations, overwrites) {
    var cMap = {},
        ar,
        i,
        oMap = {};
    collations = collations || [];
    overwrites = overwrites || [];
    for (i = 0; i < collations.length; i++) {
      cMap[collations[i]] = true;
    }
    for (i = 0; i < overwrites.length; i++) {
      oMap[overwrites[i]] = true;
    }
    var c = clone(a);
    for (i in b) {
      if (c[i] == null || oMap[i]) {
        c[i] = b[i];
      } else if (isString(b[i]) || isBoolean(b[i])) {
        if (!cMap[i]) {
          c[i] = b[i];
        } else {
          ar = [];
          ar.push.apply(ar, isArray(c[i]) ? c[i] : [c[i]]);
          ar.push.apply(ar, isBoolean(b[i]) ? b[i] : [b[i]]);
          c[i] = ar;
        }
      } else {
        if (isArray(b[i])) {
          ar = [];
          if (isArray(c[i])) {
            ar.push.apply(ar, c[i]);
          }
          ar.push.apply(ar, b[i]);
          c[i] = ar;
        } else if (IS.anObject(b[i])) {
          if (!IS.anObject(c[i])) {
            c[i] = {};
          }
          for (var j in b[i]) {
            c[i][j] = b[i][j];
          }
        }
      }
    }
    return c;
  }
  function functionChain(successValue, failValue, fns) {
    for (var i = 0; i < fns.length; i++) {
      var o = fns[i][0][fns[i][1]].apply(fns[i][0], fns[i][2]);
      if (o === failValue) {
        return o;
      }
    }
    return successValue;
  }
  function populate(model, values, functionPrefix, doNotExpandFunctions) {
    var getValue = function getValue(fromString) {
      var matches = fromString.match(/(\${.*?})/g);
      if (matches != null) {
        for (var i = 0; i < matches.length; i++) {
          var val = values[matches[i].substring(2, matches[i].length - 1)] || "";
          if (val != null) {
            fromString = fromString.replace(matches[i], val);
          }
        }
      }
      return fromString;
    };
    var _one = function _one(d) {
      if (d != null) {
        if (isString(d)) {
          return getValue(d);
        } else if (isFunction(d) && !doNotExpandFunctions && (functionPrefix == null || (d.name || "").indexOf(functionPrefix) === 0)) {
          return d(values);
        } else if (isArray(d)) {
          var r = [];
          for (var i = 0; i < d.length; i++) {
            r.push(_one(d[i]));
          }
          return r;
        } else if (IS.anObject(d)) {
          var s = {};
          for (var j in d) {
            s[j] = _one(d[j]);
          }
          return s;
        } else {
          return d;
        }
      }
    };
    return _one(model);
  }
  function findWithFunction(a, f) {
    if (a) {
      for (var i = 0; i < a.length; i++) {
        if (f(a[i])) {
          return i;
        }
      }
    }
    return -1;
  }
  function removeWithFunction(a, f) {
    var idx = findWithFunction(a, f);
    if (idx > -1) {
      a.splice(idx, 1);
    }
    return idx !== -1;
  }
  function remove(l, v) {
    var idx = l.indexOf(v);
    if (idx > -1) {
      l.splice(idx, 1);
    }
    return idx !== -1;
  }
  function addToDictionary(map, key, value, insertAtStart) {
    var l = map[key];
    if (l == null) {
      l = [];
      map[key] = l;
    }
    l[insertAtStart ? "unshift" : "push"](value);
    return l;
  }
  function suggest(list, item, insertAtHead) {
    if (list.indexOf(item) === -1) {
      if (insertAtHead) {
        list.unshift(item);
      } else {
        list.push(item);
      }
      return true;
    }
    return false;
  }
  var lut = [];
  for (var i = 0; i < 256; i++) {
    lut[i] = (i < 16 ? '0' : '') + i.toString(16);
  }
  function uuid() {
    var d0 = Math.random() * 0xffffffff | 0;
    var d1 = Math.random() * 0xffffffff | 0;
    var d2 = Math.random() * 0xffffffff | 0;
    var d3 = Math.random() * 0xffffffff | 0;
    return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' + lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' + lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] + lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
  }
  function rotatePoint(point, center, rotation) {
    var radial = [point[0] - center[0], point[1] - center[1]],
        cr = Math.cos(rotation / 360 * Math.PI * 2),
        sr = Math.sin(rotation / 360 * Math.PI * 2);
    return [radial[0] * cr - radial[1] * sr + center[0], radial[1] * cr + radial[0] * sr + center[1], cr, sr];
  }
  function rotatePointXY(point, center, rotation) {
    var r = rotatePoint([point.x, point.y], [center.x, center.y], rotation);
    return {
      x: r[0],
      y: r[1],
      cr: r[2],
      sr: r[3]
    };
  }
  function rotateAnchorOrientation(orientation, rotation) {
    var r = rotatePoint(orientation, [0, 0], rotation);
    return [Math.round(r[0]), Math.round(r[1])];
  }
  function fastTrim(s) {
    if (s == null) {
      return null;
    }
    var str = s.replace(/^\s\s*/, ''),
        ws = /\s/,
        i = str.length;
    while (ws.test(str.charAt(--i))) {}
    return str.slice(0, i + 1);
  }
  function each(obj, fn) {
    obj = obj.length == null || typeof obj === "string" ? [obj] : obj;
    for (var _i = 0; _i < obj.length; _i++) {
      fn(obj[_i]);
    }
  }
  function log() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    if ( typeof console !== "undefined") {
      try {
        var msg = arguments[arguments.length - 1];
        console.log(msg);
      } catch (e) {}
    }
  }
  function wrap(wrappedFunction, newFunction, returnOnThisValue) {
    return function () {
      var r = null;
      try {
        if (newFunction != null) {
          r = newFunction.apply(this, arguments);
        }
      } catch (e) {
        log("jsPlumb function failed : " + e);
      }
      if (wrappedFunction != null && (returnOnThisValue == null || r !== returnOnThisValue)) {
        try {
          r = wrappedFunction.apply(this, arguments);
        } catch (e) {
          log("wrapped function failed : " + e);
        }
      }
      return r;
    };
  }
  function sortHelper(_array, _fn) {
    return _array.sort(_fn);
  }
  function _mergeOverrides(def, values) {
    var m = extend({}, def);
    for (var _i4 in values) {
      if (values[_i4]) {
        m[_i4] = values[_i4];
      }
    }
    return m;
  }
  function optional(obj) {
    return {
      isDefined: function isDefined() {
        return obj != null;
      },
      ifPresent: function ifPresent(fn) {
        if (obj != null) {
          fn(obj);
        }
      },
      map: function map(fn) {
        if (obj != null) {
          return fn(obj);
        } else {
          return null;
        }
      }
    };
  }
  function getsert(map, key, valueGenerator) {
    if (!map.has(key)) {
      map.set(key, valueGenerator());
    }
    return map.get(key);
  }

  var AbstractConnector =
  function () {
    function AbstractConnector(instance, connection, params) {
      _classCallCheck(this, AbstractConnector);
      this.instance = instance;
      this.connection = connection;
      _defineProperty(this, "type", void 0);
      _defineProperty(this, "edited", false);
      _defineProperty(this, "stub", void 0);
      _defineProperty(this, "sourceStub", void 0);
      _defineProperty(this, "targetStub", void 0);
      _defineProperty(this, "maxStub", void 0);
      _defineProperty(this, "typeId", void 0);
      _defineProperty(this, "gap", void 0);
      _defineProperty(this, "sourceGap", void 0);
      _defineProperty(this, "targetGap", void 0);
      _defineProperty(this, "segments", []);
      _defineProperty(this, "totalLength", 0);
      _defineProperty(this, "segmentProportions", []);
      _defineProperty(this, "segmentProportionalLengths", []);
      _defineProperty(this, "paintInfo", null);
      _defineProperty(this, "strokeWidth", void 0);
      _defineProperty(this, "x", void 0);
      _defineProperty(this, "y", void 0);
      _defineProperty(this, "w", void 0);
      _defineProperty(this, "h", void 0);
      _defineProperty(this, "segment", void 0);
      _defineProperty(this, "bounds", EMPTY_BOUNDS());
      _defineProperty(this, "cssClass", void 0);
      _defineProperty(this, "geometry", void 0);
      this.stub = params.stub || this.getDefaultStubs();
      this.sourceStub = isArray(this.stub) ? this.stub[0] : this.stub;
      this.targetStub = isArray(this.stub) ? this.stub[1] : this.stub;
      this.gap = params.gap || 0;
      this.sourceGap = isArray(this.gap) ? this.gap[0] : this.gap;
      this.targetGap = isArray(this.gap) ? this.gap[1] : this.gap;
      this.maxStub = Math.max(this.sourceStub, this.targetStub);
      this.cssClass = params.cssClass || "";
    }
    _createClass(AbstractConnector, [{
      key: "getTypeDescriptor",
      value: function getTypeDescriptor() {
        return "connector";
      }
    }, {
      key: "getIdPrefix",
      value: function getIdPrefix() {
        return "_jsplumb_connector";
      }
    }, {
      key: "setGeometry",
      value: function setGeometry(g, internal) {
        this.geometry = g;
        this.edited = g != null && !internal;
      }
    }, {
      key: "exportGeometry",
      value: function exportGeometry() {
        return this.geometry;
      }
    }, {
      key: "importGeometry",
      value: function importGeometry(g) {
        this.geometry = g;
        return true;
      }
    }, {
      key: "resetGeometry",
      value: function resetGeometry() {
        this.geometry = null;
        this.edited = false;
      }
    }, {
      key: "resetBounds",
      value: function resetBounds() {
        this.bounds = EMPTY_BOUNDS();
      }
    }, {
      key: "getPathData",
      value: function getPathData() {
        var p = "";
        for (var i = 0; i < this.segments.length; i++) {
          p += this.instance.getPath(this.segments[i], i === 0);
          p += " ";
        }
        return p;
      }
    }, {
      key: "findSegmentForPoint",
      value: function findSegmentForPoint(x, y) {
        var out = {
          d: Infinity,
          s: null,
          x: null,
          y: null,
          l: null,
          x1: null,
          y1: null,
          x2: null,
          y2: null,
          index: null,
          connectorLocation: null
        };
        for (var i = 0; i < this.segments.length; i++) {
          var _s = this.segments[i].findClosestPointOnPath(x, y);
          if (_s.d < out.d) {
            out.d = _s.d;
            out.l = _s.l;
            out.x = _s.x;
            out.y = _s.y;
            out.s = this.segments[i];
            out.x1 = _s.x1;
            out.x2 = _s.x2;
            out.y1 = _s.y1;
            out.y2 = _s.y2;
            out.index = i;
            out.connectorLocation = this.segmentProportions[i][0] + _s.l * (this.segmentProportions[i][1] - this.segmentProportions[i][0]);
          }
        }
        return out;
      }
    }, {
      key: "lineIntersection",
      value: function lineIntersection(x1, y1, x2, y2) {
        var out = [];
        for (var i = 0; i < this.segments.length; i++) {
          out.push.apply(out, this.segments[i].lineIntersection(x1, y1, x2, y2));
        }
        return out;
      }
    }, {
      key: "boxIntersection",
      value: function boxIntersection(x, y, w, h) {
        var out = [];
        for (var i = 0; i < this.segments.length; i++) {
          out.push.apply(out, this.segments[i].boxIntersection(x, y, w, h));
        }
        return out;
      }
    }, {
      key: "boundingBoxIntersection",
      value: function boundingBoxIntersection(box) {
        var out = [];
        for (var i = 0; i < this.segments.length; i++) {
          out.push.apply(out, this.segments[i].boundingBoxIntersection(box));
        }
        return out;
      }
    }, {
      key: "_updateSegmentProportions",
      value: function _updateSegmentProportions() {
        var curLoc = 0;
        for (var i = 0; i < this.segments.length; i++) {
          var sl = this.segments[i].getLength();
          this.segmentProportionalLengths[i] = sl / this.totalLength;
          this.segmentProportions[i] = [curLoc, curLoc += sl / this.totalLength];
        }
      }
    }, {
      key: "_findSegmentForLocation",
      value: function _findSegmentForLocation(location, absolute) {
        var idx, i, inSegmentProportion;
        if (absolute) {
          location = location > 0 ? location / this.totalLength : (this.totalLength + location) / this.totalLength;
        }
        if (location === 1) {
          idx = this.segments.length - 1;
          inSegmentProportion = 1;
        } else if (location === 0) {
          inSegmentProportion = 0;
          idx = 0;
        } else {
          if (location >= 0.5) {
            idx = 0;
            inSegmentProportion = 0;
            for (i = this.segmentProportions.length - 1; i > -1; i--) {
              if (this.segmentProportions[i][1] >= location && this.segmentProportions[i][0] <= location) {
                idx = i;
                inSegmentProportion = (location - this.segmentProportions[i][0]) / this.segmentProportionalLengths[i];
                break;
              }
            }
          } else {
            idx = this.segmentProportions.length - 1;
            inSegmentProportion = 1;
            for (i = 0; i < this.segmentProportions.length; i++) {
              if (this.segmentProportions[i][1] >= location) {
                idx = i;
                inSegmentProportion = (location - this.segmentProportions[i][0]) / this.segmentProportionalLengths[i];
                break;
              }
            }
          }
        }
        return {
          segment: this.segments[idx],
          proportion: inSegmentProportion,
          index: idx
        };
      }
    }, {
      key: "_addSegment",
      value: function _addSegment(clazz, params) {
        if (params.x1 === params.x2 && params.y1 === params.y2) {
          return;
        }
        var s = new clazz(this.instance, params);
        this.segments.push(s);
        this.totalLength += s.getLength();
        this.updateBounds(s);
      }
    }, {
      key: "_clearSegments",
      value: function _clearSegments() {
        this.totalLength = 0;
        this.segments.length = 0;
        this.segmentProportions.length = 0;
        this.segmentProportionalLengths.length = 0;
      }
    }, {
      key: "getLength",
      value: function getLength() {
        return this.totalLength;
      }
    }, {
      key: "_prepareCompute",
      value: function _prepareCompute(params) {
        this.strokeWidth = params.strokeWidth;
        var segment = this.instance.geometry.quadrant(this.instance.geometry.pointXYFromArray(params.sourcePos), this.instance.geometry.pointXYFromArray(params.targetPos)),
            swapX = params.targetPos[0] < params.sourcePos[0],
            swapY = params.targetPos[1] < params.sourcePos[1],
            lw = params.strokeWidth || 1,
            so = params.sourceEndpoint.anchor.getOrientation(params.sourceEndpoint),
            to = params.targetEndpoint.anchor.getOrientation(params.targetEndpoint),
            x = swapX ? params.targetPos[0] : params.sourcePos[0],
            y = swapY ? params.targetPos[1] : params.sourcePos[1],
            w = Math.abs(params.targetPos[0] - params.sourcePos[0]),
            h = Math.abs(params.targetPos[1] - params.sourcePos[1]);
        if (so[0] === 0 && so[1] === 0 || to[0] === 0 && to[1] === 0) {
          var index = w > h ? 0 : 1,
              oIndex = [1, 0][index];
          so = [0, 0];
          to = [0, 0];
          so[index] = params.sourcePos[index] > params.targetPos[index] ? -1 : 1;
          to[index] = params.sourcePos[index] > params.targetPos[index] ? 1 : -1;
          so[oIndex] = 0;
          to[oIndex] = 0;
        }
        var sx = swapX ? w + this.sourceGap * so[0] : this.sourceGap * so[0],
            sy = swapY ? h + this.sourceGap * so[1] : this.sourceGap * so[1],
            tx = swapX ? this.targetGap * to[0] : w + this.targetGap * to[0],
            ty = swapY ? this.targetGap * to[1] : h + this.targetGap * to[1],
            oProduct = so[0] * to[0] + so[1] * to[1];
        var result = {
          sx: sx,
          sy: sy,
          tx: tx,
          ty: ty,
          xSpan: Math.abs(tx - sx),
          ySpan: Math.abs(ty - sy),
          mx: (sx + tx) / 2,
          my: (sy + ty) / 2,
          so: so,
          to: to,
          x: x,
          y: y,
          w: w,
          h: h,
          segment: segment,
          startStubX: sx + so[0] * this.sourceStub,
          startStubY: sy + so[1] * this.sourceStub,
          endStubX: tx + to[0] * this.targetStub,
          endStubY: ty + to[1] * this.targetStub,
          isXGreaterThanStubTimes2: Math.abs(sx - tx) > this.sourceStub + this.targetStub,
          isYGreaterThanStubTimes2: Math.abs(sy - ty) > this.sourceStub + this.targetStub,
          opposite: oProduct === -1,
          perpendicular: oProduct === 0,
          orthogonal: oProduct === 1,
          sourceAxis: so[0] === 0 ? "y" : "x",
          points: [x, y, w, h, sx, sy, tx, ty],
          stubs: [this.sourceStub, this.targetStub]
        };
        result.anchorOrientation = result.opposite ? "opposite" : result.orthogonal ? "orthogonal" : "perpendicular";
        return result;
      }
    }, {
      key: "getSegments",
      value: function getSegments() {
        return this.segments;
      }
    }, {
      key: "updateBounds",
      value: function updateBounds(segment) {
        var segBounds = segment.getBounds();
        this.bounds.minX = Math.min(this.bounds.minX, segBounds.minX);
        this.bounds.maxX = Math.max(this.bounds.maxX, segBounds.maxX);
        this.bounds.minY = Math.min(this.bounds.minY, segBounds.minY);
        this.bounds.maxY = Math.max(this.bounds.maxY, segBounds.maxY);
      }
    }, {
      key: "dumpSegmentsToConsole",
      value: function dumpSegmentsToConsole() {
        log("SEGMENTS:");
        for (var i = 0; i < this.segments.length; i++) {
          log(this.segments[i].type, "" + this.segments[i].getLength(), "" + this.segmentProportions[i]);
        }
      }
    }, {
      key: "pointOnPath",
      value: function pointOnPath(location, absolute) {
        var seg = this._findSegmentForLocation(location, absolute);
        return seg.segment && seg.segment.pointOnPath(seg.proportion, false) || {
          x: 0,
          y: 0
        };
      }
    }, {
      key: "gradientAtPoint",
      value: function gradientAtPoint(location, absolute) {
        var seg = this._findSegmentForLocation(location, absolute);
        return seg.segment && seg.segment.gradientAtPoint(seg.proportion, false) || 0;
      }
    }, {
      key: "pointAlongPathFrom",
      value: function pointAlongPathFrom(location, distance, absolute) {
        var seg = this._findSegmentForLocation(location, absolute);
        return seg.segment && seg.segment.pointAlongPathFrom(seg.proportion, distance, false) || {
          x: 0,
          y: 0
        };
      }
    }, {
      key: "compute",
      value: function compute(params) {
        this.paintInfo = this._prepareCompute(params);
        this._clearSegments();
        this._compute(this.paintInfo, params);
        this.x = this.paintInfo.points[0];
        this.y = this.paintInfo.points[1];
        this.w = this.paintInfo.points[2];
        this.h = this.paintInfo.points[3];
        this.segment = this.paintInfo.segment;
        this._updateSegmentProportions();
      }
    }, {
      key: "applyType",
      value: function applyType(t) {
        this.instance.applyConnectorType(this, t);
      }
    }, {
      key: "setAnchorOrientation",
      value: function setAnchorOrientation(idx, orientation) {}
    }]);
    return AbstractConnector;
  }();

  var connectorMap = {};
  var Connectors = {
    get: function get(instance, connection, name, params) {
      var c = connectorMap[name];
      if (!c) {
        throw {
          message: "jsPlumb: unknown connector type '" + name + "'"
        };
      } else {
        return new c(instance, connection, params);
      }
    },
    register: function register(name, conn) {
      connectorMap[name] = conn;
    }
  };

  var StraightSegment =
  function (_AbstractSegment) {
    _inherits(StraightSegment, _AbstractSegment);
    function StraightSegment(instance, params) {
      var _this;
      _classCallCheck(this, StraightSegment);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(StraightSegment).call(this, params));
      _this.instance = instance;
      _defineProperty(_assertThisInitialized(_this), "length", void 0);
      _defineProperty(_assertThisInitialized(_this), "m", void 0);
      _defineProperty(_assertThisInitialized(_this), "m2", void 0);
      _defineProperty(_assertThisInitialized(_this), "x1", void 0);
      _defineProperty(_assertThisInitialized(_this), "x2", void 0);
      _defineProperty(_assertThisInitialized(_this), "y1", void 0);
      _defineProperty(_assertThisInitialized(_this), "y2", void 0);
      _defineProperty(_assertThisInitialized(_this), "type", StraightSegment.segmentType);
      _this._setCoordinates({
        x1: params.x1,
        y1: params.y1,
        x2: params.x2,
        y2: params.y2
      });
      return _this;
    }
    _createClass(StraightSegment, [{
      key: "_recalc",
      value: function _recalc() {
        this.length = Math.sqrt(Math.pow(this.x2 - this.x1, 2) + Math.pow(this.y2 - this.y1, 2));
        this.m = this.instance.geometry.gradient({
          x: this.x1,
          y: this.y1
        }, {
          x: this.x2,
          y: this.y2
        });
        this.m2 = -1 / this.m;
      }
    }, {
      key: "getLength",
      value: function getLength() {
        return this.length;
      }
    }, {
      key: "getGradient",
      value: function getGradient() {
        return this.m;
      }
    }, {
      key: "_setCoordinates",
      value: function _setCoordinates(coords) {
        this.x1 = coords.x1;
        this.y1 = coords.y1;
        this.x2 = coords.x2;
        this.y2 = coords.y2;
        this._recalc();
      }
    }, {
      key: "getBounds",
      value: function getBounds() {
        return {
          minX: Math.min(this.x1, this.x2),
          minY: Math.min(this.y1, this.y2),
          maxX: Math.max(this.x1, this.x2),
          maxY: Math.max(this.y1, this.y2)
        };
      }
    }, {
      key: "pointOnPath",
      value: function pointOnPath(location, absolute) {
        if (location === 0 && !absolute) {
          return {
            x: this.x1,
            y: this.y1
          };
        } else if (location === 1 && !absolute) {
          return {
            x: this.x2,
            y: this.y2
          };
        } else {
          var l = absolute ? location > 0 ? location : this.length + location : location * this.length;
          return this.instance.geometry.pointOnLine({
            x: this.x1,
            y: this.y1
          }, {
            x: this.x2,
            y: this.y2
          }, l);
        }
      }
    }, {
      key: "gradientAtPoint",
      value: function gradientAtPoint(location, absolute) {
        return this.m;
      }
    }, {
      key: "pointAlongPathFrom",
      value: function pointAlongPathFrom(location, distance, absolute) {
        var p = this.pointOnPath(location, absolute),
            farAwayPoint = distance <= 0 ? {
          x: this.x1,
          y: this.y1
        } : {
          x: this.x2,
          y: this.y2
        };
        if (distance <= 0 && Math.abs(distance) > 1) {
          distance *= -1;
        }
        return this.instance.geometry.pointOnLine(p, farAwayPoint, distance);
      }
    }, {
      key: "within",
      value: function within(a, b, c) {
        return c >= Math.min(a, b) && c <= Math.max(a, b);
      }
    }, {
      key: "closest",
      value: function closest(a, b, c) {
        return Math.abs(c - a) < Math.abs(c - b) ? a : b;
      }
    }, {
      key: "findClosestPointOnPath",
      value: function findClosestPointOnPath(x, y) {
        var out = {
          d: Infinity,
          x: null,
          y: null,
          l: null,
          x1: this.x1,
          x2: this.x2,
          y1: this.y1,
          y2: this.y2
        };
        if (this.m === 0) {
          out.y = this.y1;
          out.x = this.within(this.x1, this.x2, x) ? x : this.closest(this.x1, this.x2, x);
        } else if (this.m === Infinity || this.m === -Infinity) {
          out.x = this.x1;
          out.y = this.within(this.y1, this.y2, y) ? y : this.closest(this.y1, this.y2, y);
        } else {
          var b = this.y1 - this.m * this.x1,
              b2 = y - this.m2 * x,
          _x1 = (b2 - b) / (this.m - this.m2),
              _y1 = this.m * _x1 + b;
          out.x = this.within(this.x1, this.x2, _x1) ? _x1 : this.closest(this.x1, this.x2, _x1);
          out.y = this.within(this.y1, this.y2, _y1) ? _y1 : this.closest(this.y1, this.y2, _y1);
        }
        var fractionInSegment = this.instance.geometry.lineLength({
          x: out.x,
          y: out.y
        }, {
          x: this.x1,
          y: this.y1
        });
        out.d = this.instance.geometry.lineLength({
          x: x,
          y: y
        }, out);
        out.l = fractionInSegment / length;
        return out;
      }
    }, {
      key: "_pointLiesBetween",
      value: function _pointLiesBetween(q, p1, p2) {
        return p2 > p1 ? p1 <= q && q <= p2 : p1 >= q && q >= p2;
      }
    }, {
      key: "lineIntersection",
      value: function lineIntersection(_x1, _y1, _x2, _y2) {
        var m2 = Math.abs(this.instance.geometry.gradient({
          x: _x1,
          y: _y1
        }, {
          x: _x2,
          y: _y2
        })),
            m1 = Math.abs(this.m),
            b = m1 === Infinity ? this.x1 : this.y1 - m1 * this.x1,
            out = [],
            b2 = m2 === Infinity ? _x1 : _y1 - m2 * _x1;
        if (m2 !== m1) {
          if (m2 === Infinity && m1 === 0) {
            if (this._pointLiesBetween(_x1, this.x1, this.x2) && this._pointLiesBetween(this.y1, _y1, _y2)) {
              out.push([_x1, this.y1]);
            }
          } else if (m2 === 0 && m1 === Infinity) {
            if (this._pointLiesBetween(_y1, this.y1, this.y2) && this._pointLiesBetween(this.x1, _x1, _x2)) {
              out.push([this.x1, _y1]);
            }
          } else {
            var X, Y;
            if (m2 === Infinity) {
              X = _x1;
              if (this._pointLiesBetween(X, this.x1, this.x2)) {
                Y = m1 * _x1 + b;
                if (this._pointLiesBetween(Y, _y1, _y2)) {
                  out.push([X, Y]);
                }
              }
            } else if (m2 === 0) {
              Y = _y1;
              if (this._pointLiesBetween(Y, this.y1, this.y2)) {
                X = (_y1 - b) / m1;
                if (this._pointLiesBetween(X, _x1, _x2)) {
                  out.push([X, Y]);
                }
              }
            } else {
              X = (b2 - b) / (m1 - m2);
              Y = m1 * X + b;
              if (this._pointLiesBetween(X, this.x1, this.x2) && this._pointLiesBetween(Y, this.y1, this.y2)) {
                out.push([X, Y]);
              }
            }
          }
        }
        return out;
      }
    }, {
      key: "boxIntersection",
      value: function boxIntersection(x, y, w, h) {
        var a = [];
        a.push.apply(a, this.lineIntersection(x, y, x + w, y));
        a.push.apply(a, this.lineIntersection(x + w, y, x + w, y + h));
        a.push.apply(a, this.lineIntersection(x + w, y + h, x, y + h));
        a.push.apply(a, this.lineIntersection(x, y + h, x, y));
        return a;
      }
    }]);
    return StraightSegment;
  }(AbstractSegment);
  _defineProperty(StraightSegment, "segmentType", "Straight");

  var StraightConnector =
  function (_AbstractConnector) {
    _inherits(StraightConnector, _AbstractConnector);
    function StraightConnector() {
      var _getPrototypeOf2;
      var _this;
      _classCallCheck(this, StraightConnector);
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(StraightConnector)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _defineProperty(_assertThisInitialized(_this), "type", "Straight");
      return _this;
    }
    _createClass(StraightConnector, [{
      key: "getDefaultStubs",
      value: function getDefaultStubs() {
        return [0, 0];
      }
    }, {
      key: "_compute",
      value: function _compute(paintInfo, p) {
        this._addSegment(StraightSegment, {
          x1: paintInfo.sx,
          y1: paintInfo.sy,
          x2: paintInfo.startStubX,
          y2: paintInfo.startStubY
        });
        this._addSegment(StraightSegment, {
          x1: paintInfo.startStubX,
          y1: paintInfo.startStubY,
          x2: paintInfo.endStubX,
          y2: paintInfo.endStubY
        });
        this._addSegment(StraightSegment, {
          x1: paintInfo.endStubX,
          y1: paintInfo.endStubY,
          x2: paintInfo.tx,
          y2: paintInfo.ty
        });
        this.geometry = {
          source: p.sourcePos,
          target: p.targetPos
        };
      }
    }]);
    return StraightConnector;
  }(AbstractConnector);
  function register$3() {
    Connectors.register("Straight", StraightConnector);
  }

  var segmentMultipliers = [null, [1, -1], [1, 1], [-1, 1], [-1, -1]];
  var inverseSegmentMultipliers = [null, [-1, -1], [-1, 1], [1, 1], [1, -1]];
  var TWO_PI = 2 * Math.PI;
  var jsPlumbGeometry =
  function () {
    function jsPlumbGeometry() {
      _classCallCheck(this, jsPlumbGeometry);
    }
    _createClass(jsPlumbGeometry, [{
      key: "pointXYFromArray",
      value: function pointXYFromArray(a) {
        return {
          x: a[0],
          y: a[1]
        };
      }
    }, {
      key: "gradient",
      value: function gradient(p1, p2) {
        if (p2.x === p1.x) return p2.y > p1.y ? Infinity : -Infinity;else if (p2.y === p1.y) return p2.x > p1.x ? 0 : -0;else return (p2.y - p1.y) / (p2.x - p1.x);
      }
    }, {
      key: "normal",
      value: function normal(p1, p2) {
        return -1 / this.gradient(p1, p2);
      }
    }, {
      key: "lineLength",
      value: function lineLength(p1, p2) {
        return Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2));
      }
    }, {
      key: "quadrant",
      value: function quadrant(p1, p2) {
        if (p2.x > p1.x) {
          return p2.y > p1.y ? 2 : 1;
        } else if (p2.x == p1.x) {
          return p2.y > p1.y ? 2 : 1;
        } else {
          return p2.y > p1.y ? 3 : 4;
        }
      }
    }, {
      key: "theta",
      value: function theta(p1, p2) {
        var m = this.gradient(p1, p2),
            t = Math.atan(m),
            s = this.quadrant(p1, p2);
        if (s == 4 || s == 3) t += Math.PI;
        if (t < 0) t += 2 * Math.PI;
        return t;
      }
    }, {
      key: "intersects",
      value: function intersects(r1, r2) {
        var x1 = r1.x,
            x2 = r1.x + r1.w,
            y1 = r1.y,
            y2 = r1.y + r1.h,
            a1 = r2.x,
            a2 = r2.x + r2.w,
            b1 = r2.y,
            b2 = r2.y + r2.h;
        return x1 <= a1 && a1 <= x2 && y1 <= b1 && b1 <= y2 || x1 <= a2 && a2 <= x2 && y1 <= b1 && b1 <= y2 || x1 <= a1 && a1 <= x2 && y1 <= b2 && b2 <= y2 || x1 <= a2 && a1 <= x2 && y1 <= b2 && b2 <= y2 || a1 <= x1 && x1 <= a2 && b1 <= y1 && y1 <= b2 || a1 <= x2 && x2 <= a2 && b1 <= y1 && y1 <= b2 || a1 <= x1 && x1 <= a2 && b1 <= y2 && y2 <= b2 || a1 <= x2 && x1 <= a2 && b1 <= y2 && y2 <= b2;
      }
    }, {
      key: "encloses",
      value: function encloses(r1, r2, allowSharedEdges) {
        var x1 = r1.x,
            x2 = r1.x + r1.w,
            y1 = r1.y,
            y2 = r1.y + r1.h,
            a1 = r2.x,
            a2 = r2.x + r2.w,
            b1 = r2.y,
            b2 = r2.y + r2.h,
            c = function c(v1, v2, v3, v4) {
          return allowSharedEdges ? v1 <= v2 && v3 >= v4 : v1 < v2 && v3 > v4;
        };
        return c(x1, a1, x2, a2) && c(y1, b1, y2, b2);
      }
    }, {
      key: "pointOnLine",
      value: function pointOnLine(fromPoint, toPoint, distance) {
        var m = this.gradient(fromPoint, toPoint),
            s = this.quadrant(fromPoint, toPoint),
            segmentMultiplier = distance > 0 ? segmentMultipliers[s] : inverseSegmentMultipliers[s],
            theta = Math.atan(m),
            y = Math.abs(distance * Math.sin(theta)) * segmentMultiplier[1],
            x = Math.abs(distance * Math.cos(theta)) * segmentMultiplier[0];
        return {
          x: fromPoint.x + x,
          y: fromPoint.y + y
        };
      }
    }, {
      key: "perpendicularLineTo",
      value: function perpendicularLineTo(fromPoint, toPoint, length) {
        var m = this.gradient(fromPoint, toPoint),
            theta2 = Math.atan(-1 / m),
            y = length / 2 * Math.sin(theta2),
            x = length / 2 * Math.cos(theta2);
        return [{
          x: toPoint.x + x,
          y: toPoint.y + y
        }, {
          x: toPoint.x - x,
          y: toPoint.y - y
        }];
      }
    }]);
    return jsPlumbGeometry;
  }();

  var VERY_SMALL_VALUE = 0.0000000001;
  function gentleRound(n) {
    var f = Math.floor(n),
        r = Math.ceil(n);
    if (n - f < VERY_SMALL_VALUE) {
      return f;
    } else if (r - n < VERY_SMALL_VALUE) {
      return r;
    }
    return n;
  }
  var ArcSegment =
  function (_AbstractSegment) {
    _inherits(ArcSegment, _AbstractSegment);
    function ArcSegment(instance, params) {
      var _this;
      _classCallCheck(this, ArcSegment);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(ArcSegment).call(this, params));
      _this.instance = instance;
      _defineProperty(_assertThisInitialized(_this), "type", ArcSegment.segmentType);
      _defineProperty(_assertThisInitialized(_this), "cx", void 0);
      _defineProperty(_assertThisInitialized(_this), "cy", void 0);
      _defineProperty(_assertThisInitialized(_this), "radius", void 0);
      _defineProperty(_assertThisInitialized(_this), "anticlockwise", void 0);
      _defineProperty(_assertThisInitialized(_this), "startAngle", void 0);
      _defineProperty(_assertThisInitialized(_this), "endAngle", void 0);
      _defineProperty(_assertThisInitialized(_this), "sweep", void 0);
      _defineProperty(_assertThisInitialized(_this), "length", void 0);
      _defineProperty(_assertThisInitialized(_this), "circumference", void 0);
      _defineProperty(_assertThisInitialized(_this), "frac", void 0);
      _this.cx = params.cx;
      _this.cy = params.cy;
      _this.radius = params.r;
      _this.anticlockwise = params.ac;
      if (params.startAngle && params.endAngle) {
        _this.startAngle = params.startAngle;
        _this.endAngle = params.endAngle;
        _this.x1 = _this.cx + _this.radius * Math.cos(_this.startAngle);
        _this.y1 = _this.cy + _this.radius * Math.sin(_this.startAngle);
        _this.x2 = _this.cx + _this.radius * Math.cos(_this.endAngle);
        _this.y2 = _this.cy + _this.radius * Math.sin(_this.endAngle);
      } else {
        _this.startAngle = _this._calcAngle(_this.x1, _this.y1);
        _this.endAngle = _this._calcAngle(_this.x2, _this.y2);
      }
      if (_this.endAngle < 0) {
        _this.endAngle += TWO_PI;
      }
      if (_this.startAngle < 0) {
        _this.startAngle += TWO_PI;
      }
      var ea = _this.endAngle < _this.startAngle ? _this.endAngle + TWO_PI : _this.endAngle;
      _this.sweep = Math.abs(ea - _this.startAngle);
      if (_this.anticlockwise) {
        _this.sweep = TWO_PI - _this.sweep;
      }
      _this.circumference = 2 * Math.PI * _this.radius;
      _this.frac = _this.sweep / TWO_PI;
      _this.length = _this.circumference * _this.frac;
      _this.bounds = {
        minX: _this.cx - _this.radius,
        maxX: _this.cx + _this.radius,
        minY: _this.cy - _this.radius,
        maxY: _this.cy + _this.radius
      };
      return _this;
    }
    _createClass(ArcSegment, [{
      key: "_calcAngle",
      value: function _calcAngle(_x, _y) {
        return this.instance.geometry.theta({
          x: this.cx,
          y: this.cy
        }, {
          x: _x,
          y: _y
        });
      }
    }, {
      key: "_calcAngleForLocation",
      value: function _calcAngleForLocation(segment, location) {
        if (segment.anticlockwise) {
          var sa = segment.startAngle < segment.endAngle ? segment.startAngle + TWO_PI : segment.startAngle,
              s = Math.abs(sa - segment.endAngle);
          return sa - s * location;
        } else {
          var ea = segment.endAngle < segment.startAngle ? segment.endAngle + TWO_PI : segment.endAngle,
              ss = Math.abs(ea - segment.startAngle);
          return segment.startAngle + ss * location;
        }
      }
    }, {
      key: "getLength",
      value: function getLength() {
        return this.length;
      }
    }, {
      key: "pointOnPath",
      value: function pointOnPath(location, absolute) {
        if (location === 0) {
          return {
            x: this.x1,
            y: this.y1,
            theta: this.startAngle
          };
        } else if (location === 1) {
          return {
            x: this.x2,
            y: this.y2,
            theta: this.endAngle
          };
        }
        if (absolute) {
          location = location / length;
        }
        var angle = this._calcAngleForLocation(this, location),
            _x = this.cx + this.radius * Math.cos(angle),
            _y = this.cy + this.radius * Math.sin(angle);
        return {
          x: gentleRound(_x),
          y: gentleRound(_y),
          theta: angle
        };
      }
    }, {
      key: "gradientAtPoint",
      value: function gradientAtPoint(location, absolute) {
        var p = this.pointOnPath(location, absolute);
        var m = this.instance.geometry.normal({
          x: this.cx,
          y: this.cy
        }, p);
        if (!this.anticlockwise && (m === Infinity || m === -Infinity)) {
          m *= -1;
        }
        return m;
      }
    }, {
      key: "pointAlongPathFrom",
      value: function pointAlongPathFrom(location, distance, absolute) {
        var p = this.pointOnPath(location, absolute),
            arcSpan = distance / this.circumference * 2 * Math.PI,
            dir = this.anticlockwise ? -1 : 1,
            startAngle = p.theta + dir * arcSpan,
            startX = this.cx + this.radius * Math.cos(startAngle),
            startY = this.cy + this.radius * Math.sin(startAngle);
        return {
          x: startX,
          y: startY
        };
      }
    }]);
    return ArcSegment;
  }(AbstractSegment);
  _defineProperty(ArcSegment, "segmentType", "Arc");

  function sgn(n) {
    return n < 0 ? -1 : n === 0 ? 0 : 1;
  }
  function segmentDirections(segment) {
    return [sgn(segment[2] - segment[0]), sgn(segment[3] - segment[1])];
  }
  function segLength(s) {
    return Math.sqrt(Math.pow(s[0] - s[2], 2) + Math.pow(s[1] - s[3], 2));
  }
  function _cloneArray(a) {
    var _a = [];
    _a.push.apply(_a, a);
    return _a;
  }
  var FlowchartConnector =
  function (_AbstractConnector) {
    _inherits(FlowchartConnector, _AbstractConnector);
    _createClass(FlowchartConnector, [{
      key: "getDefaultStubs",
      value: function getDefaultStubs() {
        return [30, 30];
      }
    }]);
    function FlowchartConnector(instance, connection, params) {
      var _this;
      _classCallCheck(this, FlowchartConnector);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(FlowchartConnector).call(this, instance, connection, params));
      _this.instance = instance;
      _this.connection = connection;
      _defineProperty(_assertThisInitialized(_this), "type", "Flowchart");
      _defineProperty(_assertThisInitialized(_this), "internalSegments", []);
      _defineProperty(_assertThisInitialized(_this), "midpoint", void 0);
      _defineProperty(_assertThisInitialized(_this), "alwaysRespectStubs", void 0);
      _defineProperty(_assertThisInitialized(_this), "cornerRadius", void 0);
      _defineProperty(_assertThisInitialized(_this), "lastx", void 0);
      _defineProperty(_assertThisInitialized(_this), "lasty", void 0);
      _defineProperty(_assertThisInitialized(_this), "lastOrientation", void 0);
      _defineProperty(_assertThisInitialized(_this), "loopbackRadius", void 0);
      _defineProperty(_assertThisInitialized(_this), "isLoopbackCurrently", void 0);
      _this.midpoint = params.midpoint == null ? 0.5 : params.midpoint;
      _this.cornerRadius = params.cornerRadius != null ? params.cornerRadius : 0;
      _this.alwaysRespectStubs = params.alwaysRespectStubs === true;
      _this.lastx = null;
      _this.lasty = null;
      _this.lastOrientation = null;
      _this.loopbackRadius = params.loopbackRadius || 25;
      _this.isLoopbackCurrently = false;
      return _this;
    }
    _createClass(FlowchartConnector, [{
      key: "addASegment",
      value: function addASegment(x, y, paintInfo) {
        if (this.lastx === x && this.lasty === y) {
          return;
        }
        var lx = this.lastx == null ? paintInfo.sx : this.lastx,
            ly = this.lasty == null ? paintInfo.sy : this.lasty,
            o = lx === x ? "v" : "h";
        this.lastx = x;
        this.lasty = y;
        this.internalSegments.push([lx, ly, x, y, o]);
      }
    }, {
      key: "writeSegments",
      value: function writeSegments(paintInfo) {
        var current = null,
            next,
            currentDirection,
            nextDirection;
        for (var i = 0; i < this.internalSegments.length - 1; i++) {
          current = current || _cloneArray(this.internalSegments[i]);
          next = _cloneArray(this.internalSegments[i + 1]);
          currentDirection = segmentDirections(current);
          nextDirection = segmentDirections(next);
          if (this.cornerRadius > 0 && current[4] !== next[4]) {
            var minSegLength = Math.min(segLength(current), segLength(next));
            var radiusToUse = Math.min(this.cornerRadius, minSegLength / 2);
            current[2] -= currentDirection[0] * radiusToUse;
            current[3] -= currentDirection[1] * radiusToUse;
            next[0] += nextDirection[0] * radiusToUse;
            next[1] += nextDirection[1] * radiusToUse;
            var ac = currentDirection[1] === nextDirection[0] && nextDirection[0] === 1 || currentDirection[1] === nextDirection[0] && nextDirection[0] === 0 && currentDirection[0] !== nextDirection[1] || currentDirection[1] === nextDirection[0] && nextDirection[0] === -1,
                sgny = next[1] > current[3] ? 1 : -1,
                sgnx = next[0] > current[2] ? 1 : -1,
                sgnEqual = sgny === sgnx,
                cx = sgnEqual && ac || !sgnEqual && !ac ? next[0] : current[2],
                cy = sgnEqual && ac || !sgnEqual && !ac ? current[3] : next[1];
            this._addSegment(StraightSegment, {
              x1: current[0],
              y1: current[1],
              x2: current[2],
              y2: current[3]
            });
            this._addSegment(ArcSegment, {
              r: radiusToUse,
              x1: current[2],
              y1: current[3],
              x2: next[0],
              y2: next[1],
              cx: cx,
              cy: cy,
              ac: ac
            });
          } else {
            this._addSegment(StraightSegment, {
              x1: current[0],
              y1: current[1],
              x2: current[2],
              y2: current[3]
            });
          }
          current = next;
        }
        if (next != null) {
          this._addSegment(StraightSegment, {
            x1: next[0],
            y1: next[1],
            x2: next[2],
            y2: next[3]
          });
        }
      }
    }, {
      key: "_compute",
      value: function _compute(paintInfo, params) {
        var _this2 = this;
        this.internalSegments.length = 0;
        this.lastx = null;
        this.lasty = null;
        this.lastOrientation = null;
        var commonStubCalculator = function commonStubCalculator(axis) {
          return [paintInfo.startStubX, paintInfo.startStubY, paintInfo.endStubX, paintInfo.endStubY];
        },
            stubCalculators = {
          perpendicular: commonStubCalculator,
          orthogonal: commonStubCalculator,
          opposite: function opposite(axis) {
            var pi = paintInfo,
                idx = axis === "x" ? 0 : 1,
                areInProximity = {
              "x": function x() {
                return pi.so[idx] === 1 && (pi.startStubX > pi.endStubX && pi.tx > pi.startStubX || pi.sx > pi.endStubX && pi.tx > pi.sx) || pi.so[idx] === -1 && (pi.startStubX < pi.endStubX && pi.tx < pi.startStubX || pi.sx < pi.endStubX && pi.tx < pi.sx);
              },
              "y": function y() {
                return pi.so[idx] === 1 && (pi.startStubY > pi.endStubY && pi.ty > pi.startStubY || pi.sy > pi.endStubY && pi.ty > pi.sy) || pi.so[idx] === -1 && (pi.startStubY < pi.endStubY && pi.ty < pi.startStubY || pi.sy < pi.endStubY && pi.ty < pi.sy);
              }
            };
            if (!_this2.alwaysRespectStubs && areInProximity[axis]()) {
              return {
                "x": [(paintInfo.sx + paintInfo.tx) / 2, paintInfo.startStubY, (paintInfo.sx + paintInfo.tx) / 2, paintInfo.endStubY],
                "y": [paintInfo.startStubX, (paintInfo.sy + paintInfo.ty) / 2, paintInfo.endStubX, (paintInfo.sy + paintInfo.ty) / 2]
              }[axis];
            } else {
              return [paintInfo.startStubX, paintInfo.startStubY, paintInfo.endStubX, paintInfo.endStubY];
            }
          }
        };
        var stubs = stubCalculators[paintInfo.anchorOrientation](paintInfo.sourceAxis),
            idx = paintInfo.sourceAxis === "x" ? 0 : 1,
            oidx = paintInfo.sourceAxis === "x" ? 1 : 0,
            ss = stubs[idx],
            oss = stubs[oidx],
            es = stubs[idx + 2],
            oes = stubs[oidx + 2];
        this.addASegment(stubs[0], stubs[1], paintInfo);
        var midx = paintInfo.startStubX + (paintInfo.endStubX - paintInfo.startStubX) * this.midpoint,
            midy = paintInfo.startStubY + (paintInfo.endStubY - paintInfo.startStubY) * this.midpoint;
        var orientations = {
          x: [0, 1],
          y: [1, 0]
        },
            lineCalculators = {
          perpendicular: function perpendicular(axis, ss, oss, es, oes) {
            var pi = paintInfo,
                sis = {
              x: [[[1, 2, 3, 4], null, [2, 1, 4, 3]], null, [[4, 3, 2, 1], null, [3, 4, 1, 2]]],
              y: [[[3, 2, 1, 4], null, [2, 3, 4, 1]], null, [[4, 1, 2, 3], null, [1, 4, 3, 2]]]
            },
                stubs = {
              x: [[pi.startStubX, pi.endStubX], null, [pi.endStubX, pi.startStubX]],
              y: [[pi.startStubY, pi.endStubY], null, [pi.endStubY, pi.startStubY]]
            },
                midLines = {
              x: [[midx, pi.startStubY], [midx, pi.endStubY]],
              y: [[pi.startStubX, midy], [pi.endStubX, midy]]
            },
                linesToEnd = {
              x: [[pi.endStubX, pi.startStubY]],
              y: [[pi.startStubX, pi.endStubY]]
            },
                startToEnd = {
              x: [[pi.startStubX, pi.endStubY], [pi.endStubX, pi.endStubY]],
              y: [[pi.endStubX, pi.startStubY], [pi.endStubX, pi.endStubY]]
            },
                startToMidToEnd = {
              x: [[pi.startStubX, midy], [pi.endStubX, midy], [pi.endStubX, pi.endStubY]],
              y: [[midx, pi.startStubY], [midx, pi.endStubY], [pi.endStubX, pi.endStubY]]
            },
                otherStubs = {
              x: [pi.startStubY, pi.endStubY],
              y: [pi.startStubX, pi.endStubX]
            },
                soIdx = orientations[axis][0],
                toIdx = orientations[axis][1],
                _so = pi.so[soIdx] + 1,
                _to = pi.to[toIdx] + 1,
                otherFlipped = pi.to[toIdx] === -1 && otherStubs[axis][1] < otherStubs[axis][0] || pi.to[toIdx] === 1 && otherStubs[axis][1] > otherStubs[axis][0],
                stub1 = stubs[axis][_so][0],
                stub2 = stubs[axis][_so][1],
                segmentIndexes = sis[axis][_so][_to];
            if (pi.segment === segmentIndexes[3] || pi.segment === segmentIndexes[2] && otherFlipped) {
              return midLines[axis];
            } else if (pi.segment === segmentIndexes[2] && stub2 < stub1) {
              return linesToEnd[axis];
            } else if (pi.segment === segmentIndexes[2] && stub2 >= stub1 || pi.segment === segmentIndexes[1] && !otherFlipped) {
              return startToMidToEnd[axis];
            } else if (pi.segment === segmentIndexes[0] || pi.segment === segmentIndexes[1] && otherFlipped) {
              return startToEnd[axis];
            }
          },
          orthogonal: function orthogonal(axis, startStub, otherStartStub, endStub, otherEndStub) {
            var pi = paintInfo,
                extent = {
              "x": pi.so[0] === -1 ? Math.min(startStub, endStub) : Math.max(startStub, endStub),
              "y": pi.so[1] === -1 ? Math.min(startStub, endStub) : Math.max(startStub, endStub)
            }[axis];
            return {
              "x": [[extent, otherStartStub], [extent, otherEndStub], [endStub, otherEndStub]],
              "y": [[otherStartStub, extent], [otherEndStub, extent], [otherEndStub, endStub]]
            }[axis];
          },
          opposite: function opposite(axis, ss, oss, es, oes) {
            var pi = paintInfo,
                otherAxis = {
              "x": "y",
              "y": "x"
            }[axis],
                dim = {
              "x": "height",
              "y": "width"
            }[axis],
                comparator = pi["is" + axis.toUpperCase() + "GreaterThanStubTimes2"];
            if (params.sourceEndpoint.elementId === params.targetEndpoint.elementId) {
              var _val = oss + (1 - params.sourceEndpoint.anchor[otherAxis]) * params.sourceInfo[dim] + this.maxStub;
              return {
                "x": [[ss, _val], [es, _val]],
                "y": [[_val, ss], [_val, es]]
              }[axis];
            } else if (!comparator || pi.so[idx] === 1 && ss > es || pi.so[idx] === -1 && ss < es) {
              return {
                "x": [[ss, midy], [es, midy]],
                "y": [[midx, ss], [midx, es]]
              }[axis];
            } else if (pi.so[idx] === 1 && ss < es || pi.so[idx] === -1 && ss > es) {
              return {
                "x": [[midx, pi.sy], [midx, pi.ty]],
                "y": [[pi.sx, midy], [pi.tx, midy]]
              }[axis];
            }
          }
        };
        var p = lineCalculators[paintInfo.anchorOrientation](paintInfo.sourceAxis, ss, oss, es, oes);
        if (p) {
          for (var i = 0; i < p.length; i++) {
            this.addASegment(p[i][0], p[i][1], paintInfo);
          }
        }
        this.addASegment(stubs[2], stubs[3], paintInfo);
        this.addASegment(paintInfo.tx, paintInfo.ty, paintInfo);
        this.writeSegments(paintInfo);
      }
    }]);
    return FlowchartConnector;
  }(AbstractConnector);
  function register$4() {
    Connectors.register("Flowchart", FlowchartConnector);
  }

  var AbstractBezierConnector =
  function (_AbstractConnector) {
    _inherits(AbstractBezierConnector, _AbstractConnector);
    _createClass(AbstractBezierConnector, [{
      key: "getDefaultStubs",
      value: function getDefaultStubs() {
        return [0, 0];
      }
    }]);
    function AbstractBezierConnector(instance, connection, params) {
      var _this;
      _classCallCheck(this, AbstractBezierConnector);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(AbstractBezierConnector).call(this, instance, connection, params));
      _this.connection = connection;
      _defineProperty(_assertThisInitialized(_this), "showLoopback", void 0);
      _defineProperty(_assertThisInitialized(_this), "curviness", void 0);
      _defineProperty(_assertThisInitialized(_this), "margin", void 0);
      _defineProperty(_assertThisInitialized(_this), "proximityLimit", void 0);
      _defineProperty(_assertThisInitialized(_this), "orientation", void 0);
      _defineProperty(_assertThisInitialized(_this), "loopbackRadius", void 0);
      _defineProperty(_assertThisInitialized(_this), "clockwise", void 0);
      _defineProperty(_assertThisInitialized(_this), "isLoopbackCurrently", void 0);
      _defineProperty(_assertThisInitialized(_this), "geometry", void 0);
      params = params || {};
      _this.showLoopback = params.showLoopback !== false;
      _this.curviness = params.curviness || 10;
      _this.margin = params.margin || 5;
      _this.proximityLimit = params.proximityLimit || 80;
      _this.clockwise = params.orientation && params.orientation === "clockwise";
      _this.loopbackRadius = params.loopbackRadius || 25;
      _this.isLoopbackCurrently = false;
      return _this;
    }
    _createClass(AbstractBezierConnector, [{
      key: "_compute",
      value: function _compute(paintInfo, p) {
        var sp = p.sourcePos,
            tp = p.targetPos,
            _w = Math.abs(sp[0] - tp[0]),
            _h = Math.abs(sp[1] - tp[1]);
        if (!this.showLoopback || p.sourceEndpoint.elementId !== p.targetEndpoint.elementId) {
          this.isLoopbackCurrently = false;
          this._computeBezier(paintInfo, p, sp, tp, _w, _h);
        } else {
          this.isLoopbackCurrently = true;
          var x1 = p.sourcePos[0],
              y1 = p.sourcePos[1] - this.margin,
              cx = x1,
              cy = y1 - this.loopbackRadius,
          _x = cx - this.loopbackRadius,
              _y = cy - this.loopbackRadius;
          _w = 2 * this.loopbackRadius;
          _h = 2 * this.loopbackRadius;
          paintInfo.points[0] = _x;
          paintInfo.points[1] = _y;
          paintInfo.points[2] = _w;
          paintInfo.points[3] = _h;
          this._addSegment(ArcSegment, {
            loopback: true,
            x1: x1 - _x + 4,
            y1: y1 - _y,
            startAngle: 0,
            endAngle: 2 * Math.PI,
            r: this.loopbackRadius,
            ac: !this.clockwise,
            x2: x1 - _x - 4,
            y2: y1 - _y,
            cx: cx - _x,
            cy: cy - _y
          });
        }
      }
    }, {
      key: "exportGeometry",
      value: function exportGeometry() {
        if (this.geometry == null) {
          return null;
        } else {
          var s = [],
              t = [],
              cp1 = [],
              cp2 = [];
          Array.prototype.push.apply(s, this.geometry.source);
          Array.prototype.push.apply(t, this.geometry.target);
          Array.prototype.push.apply(cp1, this.geometry.controlPoints[0]);
          Array.prototype.push.apply(cp2, this.geometry.controlPoints[1]);
          return {
            source: s,
            target: t,
            controlPoints: [cp1, cp2]
          };
        }
      }
    }, {
      key: "importGeometry",
      value: function importGeometry(geometry) {
        if (geometry != null) {
          if (geometry.controlPoints == null || geometry.controlPoints.length != 2) {
            console.log("Bezier: cannot import geometry; controlPoints missing or does not have length 2");
            this.setGeometry(null, true);
            return false;
          }
          if (geometry.controlPoints[0].length != 2 || geometry.controlPoints[1].length != 2) {
            console.log("Bezier: cannot import geometry; controlPoints malformed");
            this.setGeometry(null, true);
            return false;
          }
          if (geometry.source == null || geometry.source.length != 4) {
            console.log("Bezier: cannot import geometry; source missing or malformed");
            this.setGeometry(null, true);
            return false;
          }
          if (geometry.target == null || geometry.target.length != 4) {
            console.log("Bezier: cannot import geometry; target missing or malformed");
            this.setGeometry(null, true);
            return false;
          }
          this.setGeometry(geometry, false);
          return true;
        } else {
          return false;
        }
      }
    }]);
    return AbstractBezierConnector;
  }(AbstractConnector);

  var Vectors = {
    subtract: function subtract(v1, v2) {
      return {
        x: v1.x - v2.x,
        y: v1.y - v2.y
      };
    },
    dotProduct: function dotProduct(v1, v2) {
      return v1.x * v2.x + v1.y * v2.y;
    },
    square: function square(v) {
      return Math.sqrt(v.x * v.x + v.y * v.y);
    },
    scale: function scale(v, s) {
      return {
        x: v.x * s,
        y: v.y * s
      };
    }
  };
  var maxRecursion = 64;
  var flatnessTolerance = Math.pow(2.0, -maxRecursion - 1);
  function distanceFromCurve(point, curve) {
    var candidates = [],
        w = _convertToBezier(point, curve),
        degree = curve.length - 1,
        higherDegree = 2 * degree - 1,
        numSolutions = _findRoots(w, higherDegree, candidates, 0),
        v = Vectors.subtract(point, curve[0]),
        dist = Vectors.square(v),
        t = 0.0,
        newDist;
    for (var i = 0; i < numSolutions; i++) {
      v = Vectors.subtract(point, _bezier(curve, degree, candidates[i], null, null));
      newDist = Vectors.square(v);
      if (newDist < dist) {
        dist = newDist;
        t = candidates[i];
      }
    }
    v = Vectors.subtract(point, curve[degree]);
    newDist = Vectors.square(v);
    if (newDist < dist) {
      dist = newDist;
      t = 1.0;
    }
    return {
      location: t,
      distance: dist
    };
  }
  function nearestPointOnCurve(point, curve) {
    var td = distanceFromCurve(point, curve);
    return {
      point: _bezier(curve, curve.length - 1, td.location, null, null),
      location: td.location
    };
  }
  function _convertToBezier(point, curve) {
    var degree = curve.length - 1,
        higherDegree = 2 * degree - 1,
        c = [],
        d = [],
        cdTable = [],
        w = [],
        z = [[1.0, 0.6, 0.3, 0.1], [0.4, 0.6, 0.6, 0.4], [0.1, 0.3, 0.6, 1.0]];
    for (var i = 0; i <= degree; i++) {
      c[i] = Vectors.subtract(curve[i], point);
    }
    for (var _i = 0; _i <= degree - 1; _i++) {
      d[_i] = Vectors.subtract(curve[_i + 1], curve[_i]);
      d[_i] = Vectors.scale(d[_i], 3.0);
    }
    for (var row = 0; row <= degree - 1; row++) {
      for (var column = 0; column <= degree; column++) {
        if (!cdTable[row]) cdTable[row] = [];
        cdTable[row][column] = Vectors.dotProduct(d[row], c[column]);
      }
    }
    for (var _i2 = 0; _i2 <= higherDegree; _i2++) {
      if (!w[_i2]) {
        w[_i2] = [];
      }
      w[_i2].y = 0.0;
      w[_i2].x = parseFloat("" + _i2) / higherDegree;
    }
    var n = degree,
        m = degree - 1;
    for (var k = 0; k <= n + m; k++) {
      var lb = Math.max(0, k - m),
          ub = Math.min(k, n);
      for (var _i3 = lb; _i3 <= ub; _i3++) {
        var j = k - _i3;
        w[_i3 + j].y += cdTable[j][_i3] * z[j][_i3];
      }
    }
    return w;
  }
  function _findRoots(w, degree, t, depth) {
    var left = [],
        right = [],
        left_count,
        right_count,
        left_t = [],
        right_t = [];
    switch (_getCrossingCount(w, degree)) {
      case 0:
        {
          return 0;
        }
      case 1:
        {
          if (depth >= maxRecursion) {
            t[0] = (w[0].x + w[degree].x) / 2.0;
            return 1;
          }
          if (_isFlatEnough(w, degree)) {
            t[0] = _computeXIntercept(w, degree);
            return 1;
          }
          break;
        }
    }
    _bezier(w, degree, 0.5, left, right);
    left_count = _findRoots(left, degree, left_t, depth + 1);
    right_count = _findRoots(right, degree, right_t, depth + 1);
    for (var i = 0; i < left_count; i++) {
      t[i] = left_t[i];
    }
    for (var _i4 = 0; _i4 < right_count; _i4++) {
      t[_i4 + left_count] = right_t[_i4];
    }
    return left_count + right_count;
  }
  function _getCrossingCount(curve, degree) {
    var n_crossings = 0,
        sign,
        old_sign;
    sign = old_sign = sgn$1(curve[0].y);
    for (var i = 1; i <= degree; i++) {
      sign = sgn$1(curve[i].y);
      if (sign != old_sign) n_crossings++;
      old_sign = sign;
    }
    return n_crossings;
  }
  function _isFlatEnough(curve, degree) {
    var error, intercept_1, intercept_2, left_intercept, right_intercept, a, b, c, det, dInv, a1, b1, c1, a2, b2, c2;
    a = curve[0].y - curve[degree].y;
    b = curve[degree].x - curve[0].x;
    c = curve[0].x * curve[degree].y - curve[degree].x * curve[0].y;
    var max_distance_above, max_distance_below;
    max_distance_above = max_distance_below = 0.0;
    for (var i = 1; i < degree; i++) {
      var value = a * curve[i].x + b * curve[i].y + c;
      if (value > max_distance_above) {
        max_distance_above = value;
      } else if (value < max_distance_below) {
        max_distance_below = value;
      }
    }
    a1 = 0.0;
    b1 = 1.0;
    c1 = 0.0;
    a2 = a;
    b2 = b;
    c2 = c - max_distance_above;
    det = a1 * b2 - a2 * b1;
    dInv = 1.0 / det;
    intercept_1 = (b1 * c2 - b2 * c1) * dInv;
    a2 = a;
    b2 = b;
    c2 = c - max_distance_below;
    det = a1 * b2 - a2 * b1;
    dInv = 1.0 / det;
    intercept_2 = (b1 * c2 - b2 * c1) * dInv;
    left_intercept = Math.min(intercept_1, intercept_2);
    right_intercept = Math.max(intercept_1, intercept_2);
    error = right_intercept - left_intercept;
    return error < flatnessTolerance ? 1 : 0;
  }
  function _computeXIntercept(curve, degree) {
    var XLK = 1.0,
        YLK = 0.0,
        XNM = curve[degree].x - curve[0].x,
        YNM = curve[degree].y - curve[0].y,
        XMK = curve[0].x - 0.0,
        YMK = curve[0].y - 0.0,
        det = XNM * YLK - YNM * XLK,
        detInv = 1.0 / det,
        S = (XNM * YMK - YNM * XMK) * detInv;
    return 0.0 + XLK * S;
  }
  function _bezier(curve, degree, t, left, right) {
    var temp = [[]];
    for (var j = 0; j <= degree; j++) {
      temp[0][j] = curve[j];
    }
    for (var i = 1; i <= degree; i++) {
      for (var _j = 0; _j <= degree - i; _j++) {
        if (!temp[i]) temp[i] = [];
        if (!temp[i][_j]) temp[i][_j] = {};
        temp[i][_j].x = (1.0 - t) * temp[i - 1][_j].x + t * temp[i - 1][_j + 1].x;
        temp[i][_j].y = (1.0 - t) * temp[i - 1][_j].y + t * temp[i - 1][_j + 1].y;
      }
    }
    if (left != null) {
      for (var _j2 = 0; _j2 <= degree; _j2++) {
        left[_j2] = temp[_j2][0];
      }
    }
    if (right != null) {
      for (var _j3 = 0; _j3 <= degree; _j3++) {
        right[_j3] = temp[degree - _j3][_j3];
      }
    }
    return temp[degree][0];
  }
  function _getLUT(steps, curve) {
    var out = [];
    steps--;
    for (var n = 0; n <= steps; n++) {
      out.push(_computeLookup(n / steps, curve));
    }
    return out;
  }
  function _computeLookup(e, curve) {
    var EMPTY_POINT = {
      x: 0,
      y: 0
    };
    if (e === 0) {
      return curve[0];
    }
    var degree = curve.length - 1;
    if (e === 1) {
      return curve[degree];
    }
    var o = curve;
    var s = 1 - e;
    if (degree === 0) {
      return curve[0];
    }
    if (degree === 1) {
      return {
        x: s * o[0].x + e * o[1].x,
        y: s * o[0].y + e * o[1].y
      };
    }
    if (4 > degree) {
      var l = s * s,
          h = e * e,
          u = 0,
          m,
          g,
          f;
      if (degree === 2) {
        o = [o[0], o[1], o[2], EMPTY_POINT];
        m = l;
        g = 2 * (s * e);
        f = h;
      } else if (degree === 3) {
        m = l * s;
        g = 3 * (l * e);
        f = 3 * (s * h);
        u = e * h;
      }
      return {
        x: m * o[0].x + g * o[1].x + f * o[2].x + u * o[3].x,
        y: m * o[0].y + g * o[1].y + f * o[2].y + u * o[3].y
      };
    } else {
      return EMPTY_POINT;
    }
  }
  function computeBezierLength(curve) {
    var length = 0;
    if (!isPoint(curve)) {
      var steps = 16;
      var lut = _getLUT(steps, curve);
      for (var i = 0; i < steps - 1; i++) {
        var a = lut[i],
            b = lut[i + 1];
        length += dist(a, b);
      }
    }
    return length;
  }
  var _curveFunctionCache = new Map();
  function _getCurveFunctions(order) {
    var fns = _curveFunctionCache.get(order);
    if (!fns) {
      fns = [];
      var f_term = function f_term() {
        return function (t) {
          return Math.pow(t, order);
        };
      },
          l_term = function l_term() {
        return function (t) {
          return Math.pow(1 - t, order);
        };
      },
          c_term = function c_term(c) {
        return function (t) {
          return c;
        };
      },
          t_term = function t_term() {
        return function (t) {
          return t;
        };
      },
          one_minus_t_term = function one_minus_t_term() {
        return function (t) {
          return 1 - t;
        };
      },
          _termFunc = function _termFunc(terms) {
        return function (t) {
          var p = 1;
          for (var i = 0; i < terms.length; i++) {
            p = p * terms[i](t);
          }
          return p;
        };
      };
      fns.push(f_term());
      for (var i = 1; i < order; i++) {
        var terms = [c_term(order)];
        for (var j = 0; j < order - i; j++) {
          terms.push(t_term());
        }
        for (var _j4 = 0; _j4 < i; _j4++) {
          terms.push(one_minus_t_term());
        }
        fns.push(_termFunc(terms));
      }
      fns.push(l_term());
      _curveFunctionCache.set(order, fns);
    }
    return fns;
  }
  function pointOnCurve(curve, location) {
    var cc = _getCurveFunctions(curve.length - 1),
        _x = 0,
        _y = 0;
    for (var i = 0; i < curve.length; i++) {
      _x = _x + curve[i].x * cc[i](location);
      _y = _y + curve[i].y * cc[i](location);
    }
    return {
      x: _x,
      y: _y
    };
  }
  function dist(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }
  function isPoint(curve) {
    return curve[0].x === curve[1].x && curve[0].y === curve[1].y;
  }
  function pointAlongPath(curve, location, distance) {
    if (isPoint(curve)) {
      return {
        point: curve[0],
        location: location
      };
    }
    var prev = pointOnCurve(curve, location),
        tally = 0,
        curLoc = location,
        direction = distance > 0 ? 1 : -1,
        cur = null;
    while (tally < Math.abs(distance)) {
      curLoc += 0.005 * direction;
      cur = pointOnCurve(curve, curLoc);
      tally += dist(cur, prev);
      prev = cur;
    }
    return {
      point: cur,
      location: curLoc
    };
  }
  function pointAlongCurveFrom(curve, location, distance) {
    return pointAlongPath(curve, location, distance).point;
  }
  function locationAlongCurveFrom(curve, location, distance) {
    return pointAlongPath(curve, location, distance).location;
  }
  function gradientAtPoint(curve, location) {
    var p1 = pointOnCurve(curve, location),
        p2 = pointOnCurve(curve.slice(0, curve.length - 1), location),
        dy = p2.y - p1.y,
        dx = p2.x - p1.x;
    return dy === 0 ? Infinity : Math.atan(dy / dx);
  }
  function lineIntersection(x1, y1, x2, y2, curve) {
    var a = y2 - y1,
        b = x1 - x2,
        c = x1 * (y1 - y2) + y1 * (x2 - x1),
        coeffs = _computeCoefficients(curve),
        p = [a * coeffs[0][0] + b * coeffs[1][0], a * coeffs[0][1] + b * coeffs[1][1], a * coeffs[0][2] + b * coeffs[1][2], a * coeffs[0][3] + b * coeffs[1][3] + c],
        r = _cubicRoots.apply(null, p),
        intersections = [];
    if (r != null) {
      for (var i = 0; i < 3; i++) {
        var _t = r[i],
            t2 = Math.pow(_t, 2),
            t3 = Math.pow(_t, 3),
            x = [coeffs[0][0] * t3 + coeffs[0][1] * t2 + coeffs[0][2] * _t + coeffs[0][3], coeffs[1][0] * t3 + coeffs[1][1] * t2 + coeffs[1][2] * _t + coeffs[1][3]];
        var s = void 0;
        if (x2 - x1 !== 0) {
          s = (x[0] - x1) / (x2 - x1);
        } else {
          s = (x[1] - y1) / (y2 - y1);
        }
        if (_t >= 0 && _t <= 1.0 && s >= 0 && s <= 1.0) {
          intersections.push(x);
        }
      }
    }
    return intersections;
  }
  function _computeCoefficientsForAxis(curve, axis) {
    return [-curve[0][axis] + 3 * curve[1][axis] + -3 * curve[2][axis] + curve[3][axis], 3 * curve[0][axis] - 6 * curve[1][axis] + 3 * curve[2][axis], -3 * curve[0][axis] + 3 * curve[1][axis], curve[0][axis]];
  }
  function _computeCoefficients(curve) {
    return [_computeCoefficientsForAxis(curve, "x"), _computeCoefficientsForAxis(curve, "y")];
  }
  function sgn$1(x) {
    return x < 0 ? -1 : x > 0 ? 1 : 0;
  }
  function _cubicRoots(a, b, c, d) {
    var A = b / a,
        B = c / a,
        C = d / a,
        Q = (3 * B - Math.pow(A, 2)) / 9,
        R = (9 * A * B - 27 * C - 2 * Math.pow(A, 3)) / 54,
        D = Math.pow(Q, 3) + Math.pow(R, 2),
        S,
        T,
        t = [0, 0, 0];
    if (D >= 0)
      {
        S = sgn$1(R + Math.sqrt(D)) * Math.pow(Math.abs(R + Math.sqrt(D)), 1 / 3);
        T = sgn$1(R - Math.sqrt(D)) * Math.pow(Math.abs(R - Math.sqrt(D)), 1 / 3);
        t[0] = -A / 3 + (S + T);
        t[1] = -A / 3 - (S + T) / 2;
        t[2] = -A / 3 - (S + T) / 2;
        if (Math.abs(Math.sqrt(3) * (S - T) / 2) !== 0) {
          t[1] = -1;
          t[2] = -1;
        }
      } else
      {
        var th = Math.acos(R / Math.sqrt(-Math.pow(Q, 3)));
        t[0] = 2 * Math.sqrt(-Q) * Math.cos(th / 3) - A / 3;
        t[1] = 2 * Math.sqrt(-Q) * Math.cos((th + 2 * Math.PI) / 3) - A / 3;
        t[2] = 2 * Math.sqrt(-Q) * Math.cos((th + 4 * Math.PI) / 3) - A / 3;
      }
    for (var i = 0; i < 3; i++) {
      if (t[i] < 0 || t[i] > 1.0) {
        t[i] = -1;
      }
    }
    return t;
  }

  var BezierSegment =
  function (_AbstractSegment) {
    _inherits(BezierSegment, _AbstractSegment);
    function BezierSegment(instance, params) {
      var _this;
      _classCallCheck(this, BezierSegment);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(BezierSegment).call(this, params));
      _defineProperty(_assertThisInitialized(_this), "curve", void 0);
      _defineProperty(_assertThisInitialized(_this), "cp1x", void 0);
      _defineProperty(_assertThisInitialized(_this), "cp1y", void 0);
      _defineProperty(_assertThisInitialized(_this), "cp2x", void 0);
      _defineProperty(_assertThisInitialized(_this), "cp2y", void 0);
      _defineProperty(_assertThisInitialized(_this), "bounds", void 0);
      _defineProperty(_assertThisInitialized(_this), "x1", void 0);
      _defineProperty(_assertThisInitialized(_this), "x2", void 0);
      _defineProperty(_assertThisInitialized(_this), "y1", void 0);
      _defineProperty(_assertThisInitialized(_this), "y2", void 0);
      _defineProperty(_assertThisInitialized(_this), "length", 0);
      _defineProperty(_assertThisInitialized(_this), "type", BezierSegment.segmentType);
      _this.cp1x = params.cp1x;
      _this.cp1y = params.cp1y;
      _this.cp2x = params.cp2x;
      _this.cp2y = params.cp2y;
      _this.x1 = params.x1;
      _this.x2 = params.x2;
      _this.y1 = params.y1;
      _this.y2 = params.y2;
      _this.curve = [{
        x: _this.x1,
        y: _this.y1
      }, {
        x: _this.cp1x,
        y: _this.cp1y
      }, {
        x: _this.cp2x,
        y: _this.cp2y
      }, {
        x: _this.x2,
        y: _this.y2
      }];
      _this.bounds = {
        minX: Math.min(_this.x1, _this.x2, _this.cp1x, _this.cp2x),
        minY: Math.min(_this.y1, _this.y2, _this.cp1y, _this.cp2y),
        maxX: Math.max(_this.x1, _this.x2, _this.cp1x, _this.cp2x),
        maxY: Math.max(_this.y1, _this.y2, _this.cp1y, _this.cp2y)
      };
      return _this;
    }
    _createClass(BezierSegment, [{
      key: "pointOnPath",
      value: function pointOnPath(location, absolute) {
        location = BezierSegment._translateLocation(this.curve, location, absolute);
        return pointOnCurve(this.curve, location);
      }
    }, {
      key: "gradientAtPoint",
      value: function gradientAtPoint$1(location, absolute) {
        location = BezierSegment._translateLocation(this.curve, location, absolute);
        return gradientAtPoint(this.curve, location);
      }
    }, {
      key: "pointAlongPathFrom",
      value: function pointAlongPathFrom(location, distance, absolute) {
        location = BezierSegment._translateLocation(this.curve, location, absolute);
        return pointAlongCurveFrom(this.curve, location, distance);
      }
    }, {
      key: "getLength",
      value: function getLength() {
        if (this.length == null || this.length === 0) {
          this.length = computeBezierLength(this.curve);
        }
        return this.length;
      }
    }, {
      key: "getBounds",
      value: function getBounds() {
        return this.bounds;
      }
    }, {
      key: "findClosestPointOnPath",
      value: function findClosestPointOnPath(x, y) {
        var p = nearestPointOnCurve({
          x: x,
          y: y
        }, this.curve);
        return {
          d: Math.sqrt(Math.pow(p.point.x - x, 2) + Math.pow(p.point.y - y, 2)),
          x: p.point.x,
          y: p.point.y,
          l: 1 - p.location,
          s: this,
          x1: null,
          y1: null,
          x2: null,
          y2: null
        };
      }
    }, {
      key: "lineIntersection",
      value: function lineIntersection$1(x1, y1, x2, y2) {
        return lineIntersection(x1, y1, x2, y2, this.curve);
      }
    }], [{
      key: "_translateLocation",
      value: function _translateLocation(_curve, location, absolute) {
        if (absolute) {
          location = locationAlongCurveFrom(_curve, location > 0 ? 0 : 1, location);
        }
        return location;
      }
    }]);
    return BezierSegment;
  }(AbstractSegment);
  _defineProperty(BezierSegment, "segmentType", "Bezier");

  var Bezier =
  function (_AbstractBezierConnec) {
    _inherits(Bezier, _AbstractBezierConnec);
    function Bezier(instance, connection, params) {
      var _this;
      _classCallCheck(this, Bezier);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(Bezier).call(this, instance, connection, params));
      _this.connection = connection;
      _defineProperty(_assertThisInitialized(_this), "type", "Bezier");
      _defineProperty(_assertThisInitialized(_this), "majorAnchor", void 0);
      _defineProperty(_assertThisInitialized(_this), "minorAnchor", void 0);
      params = params || {};
      _this.majorAnchor = params.curviness || 150;
      _this.minorAnchor = 10;
      return _this;
    }
    _createClass(Bezier, [{
      key: "getCurviness",
      value: function getCurviness() {
        return this.majorAnchor;
      }
    }, {
      key: "_findControlPoint",
      value: function _findControlPoint(point, sourceAnchorPosition, targetAnchorPosition, soo, too) {
        var perpendicular = soo[0] !== too[0] || soo[1] === too[1],
            p = [];
        if (!perpendicular) {
          if (soo[0] === 0) {
            p.push(sourceAnchorPosition[0] < targetAnchorPosition[0] ? point[0] + this.minorAnchor : point[0] - this.minorAnchor);
          } else {
            p.push(point[0] - this.majorAnchor * soo[0]);
          }
          if (soo[1] === 0) {
            p.push(sourceAnchorPosition[1] < targetAnchorPosition[1] ? point[1] + this.minorAnchor : point[1] - this.minorAnchor);
          } else {
            p.push(point[1] + this.majorAnchor * too[1]);
          }
        } else {
          if (too[0] === 0) {
            p.push(targetAnchorPosition[0] < sourceAnchorPosition[0] ? point[0] + this.minorAnchor : point[0] - this.minorAnchor);
          } else {
            p.push(point[0] + this.majorAnchor * too[0]);
          }
          if (too[1] === 0) {
            p.push(targetAnchorPosition[1] < sourceAnchorPosition[1] ? point[1] + this.minorAnchor : point[1] - this.minorAnchor);
          } else {
            p.push(point[1] + this.majorAnchor * soo[1]);
          }
        }
        return p;
      }
    }, {
      key: "_computeBezier",
      value: function _computeBezier(paintInfo, p, sp, tp, _w, _h) {
        var _CP,
            _CP2,
            _sx = sp[0] < tp[0] ? _w : 0,
            _sy = sp[1] < tp[1] ? _h : 0,
            _tx = sp[0] < tp[0] ? 0 : _w,
            _ty = sp[1] < tp[1] ? 0 : _h;
        if (this.edited !== true) {
          _CP = this._findControlPoint([_sx, _sy], sp, tp, paintInfo.so, paintInfo.to);
          _CP2 = this._findControlPoint([_tx, _ty], tp, sp, paintInfo.to, paintInfo.so);
        } else {
          _CP = this.geometry.controlPoints[0];
          _CP2 = this.geometry.controlPoints[1];
        }
        this.geometry = {
          controlPoints: [_CP, _CP2],
          source: p.sourcePos,
          target: p.targetPos
        };
        this._addSegment(BezierSegment, {
          x1: _sx,
          y1: _sy,
          x2: _tx,
          y2: _ty,
          cp1x: _CP[0],
          cp1y: _CP[1],
          cp2x: _CP2[0],
          cp2y: _CP2[1]
        });
      }
    }]);
    return Bezier;
  }(AbstractBezierConnector);
  function register$5() {
    Connectors.register("Bezier", Bezier);
  }

  function _segment(x1, y1, x2, y2) {
    if (x1 <= x2 && y2 <= y1) {
      return 1;
    } else if (x1 <= x2 && y1 <= y2) {
      return 2;
    } else if (x2 <= x1 && y2 >= y1) {
      return 3;
    }
    return 4;
  }
  function _findControlPoint(midx, midy, segment, sourceEdge, targetEdge, dx, dy, distance, proximityLimit) {
    if (distance <= proximityLimit) {
      return [midx, midy];
    }
    if (segment === 1) {
      if (sourceEdge[3] <= 0 && targetEdge[3] >= 1) {
        return [midx + (sourceEdge[2] < 0.5 ? -1 * dx : dx), midy];
      } else if (sourceEdge[2] >= 1 && targetEdge[2] <= 0) {
        return [midx, midy + (sourceEdge[3] < 0.5 ? -1 * dy : dy)];
      } else {
        return [midx + -1 * dx, midy + -1 * dy];
      }
    } else if (segment === 2) {
      if (sourceEdge[3] >= 1 && targetEdge[3] <= 0) {
        return [midx + (sourceEdge[2] < 0.5 ? -1 * dx : dx), midy];
      } else if (sourceEdge[2] >= 1 && targetEdge[2] <= 0) {
        return [midx, midy + (sourceEdge[3] < 0.5 ? -1 * dy : dy)];
      } else {
        return [midx + dx, midy + -1 * dy];
      }
    } else if (segment === 3) {
      if (sourceEdge[3] >= 1 && targetEdge[3] <= 0) {
        return [midx + (sourceEdge[2] < 0.5 ? -1 * dx : dx), midy];
      } else if (sourceEdge[2] <= 0 && targetEdge[2] >= 1) {
        return [midx, midy + (sourceEdge[3] < 0.5 ? -1 * dy : dy)];
      } else {
        return [midx + -1 * dx, midy + -1 * dy];
      }
    } else if (segment === 4) {
      if (sourceEdge[3] <= 0 && targetEdge[3] >= 1) {
        return [midx + (sourceEdge[2] < 0.5 ? -1 * dx : dx), midy];
      } else if (sourceEdge[2] <= 0 && targetEdge[2] >= 1) {
        return [midx, midy + (sourceEdge[3] < 0.5 ? -1 * dy : dy)];
      } else {
        return [midx + dx, midy + -1 * dy];
      }
    }
  }
  var StateMachine =
  function (_AbstractBezierConnec) {
    _inherits(StateMachine, _AbstractBezierConnec);
    function StateMachine(instance, connection, params) {
      var _this;
      _classCallCheck(this, StateMachine);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(StateMachine).call(this, instance, connection, params));
      _this.connection = connection;
      _defineProperty(_assertThisInitialized(_this), "type", "StateMachine");
      _defineProperty(_assertThisInitialized(_this), "_controlPoint", void 0);
      _defineProperty(_assertThisInitialized(_this), "proximityLimit", void 0);
      _this.curviness = params.curviness || 10;
      _this.margin = params.margin || 5;
      _this.proximityLimit = params.proximityLimit || 80;
      _this.clockwise = params.orientation && params.orientation === "clockwise";
      return _this;
    }
    _createClass(StateMachine, [{
      key: "_computeBezier",
      value: function _computeBezier(paintInfo, params, sp, tp, w, h) {
        var _sx = params.sourcePos[0] < params.targetPos[0] ? 0 : w,
            _sy = params.sourcePos[1] < params.targetPos[1] ? 0 : h,
            _tx = params.sourcePos[0] < params.targetPos[0] ? w : 0,
            _ty = params.sourcePos[1] < params.targetPos[1] ? h : 0;
        if (params.sourcePos[2] === 0) {
          _sx -= this.margin;
        }
        if (params.sourcePos[2] === 1) {
          _sx += this.margin;
        }
        if (params.sourcePos[3] === 0) {
          _sy -= this.margin;
        }
        if (params.sourcePos[3] === 1) {
          _sy += this.margin;
        }
        if (params.targetPos[2] === 0) {
          _tx -= this.margin;
        }
        if (params.targetPos[2] === 1) {
          _tx += this.margin;
        }
        if (params.targetPos[3] === 0) {
          _ty -= this.margin;
        }
        if (params.targetPos[3] === 1) {
          _ty += this.margin;
        }
        if (this.edited !== true) {
          var _midx = (_sx + _tx) / 2,
              _midy = (_sy + _ty) / 2,
              segment = _segment(_sx, _sy, _tx, _ty),
              distance = Math.sqrt(Math.pow(_tx - _sx, 2) + Math.pow(_ty - _sy, 2));
          this._controlPoint = _findControlPoint(_midx, _midy, segment, params.sourcePos, params.targetPos, this.curviness, this.curviness, distance, this.proximityLimit);
        } else {
          this._controlPoint = this.geometry.controlPoints[0];
        }
        var cp1x, cp2x, cp1y, cp2y;
        cp1x = this._controlPoint[0];
        cp2x = this._controlPoint[0];
        cp1y = this._controlPoint[1];
        cp2y = this._controlPoint[1];
        this.geometry = {
          controlPoints: [this._controlPoint, this._controlPoint],
          source: params.sourcePos,
          target: params.targetPos
        };
        this._addSegment(BezierSegment, {
          x1: _tx,
          y1: _ty,
          x2: _sx,
          y2: _sy,
          cp1x: cp1x,
          cp1y: cp1y,
          cp2x: cp2x,
          cp2y: cp2y
        });
      }
    }]);
    return StateMachine;
  }(AbstractBezierConnector);
  function register$6() {
    Connectors.register("StateMachine", StateMachine);
  }

  function cls() {
    for (var _len = arguments.length, className = new Array(_len), _key = 0; _key < _len; _key++) {
      className[_key] = arguments[_key];
    }
    return className.map(function (cn) {
      return "." + cn;
    }).join(",");
  }
  function classList() {
    for (var _len2 = arguments.length, className = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      className[_key2] = arguments[_key2];
    }
    return className.join(" ");
  }
  var SOURCE_DEFINITION_LIST = "_jsPlumbSourceDefinitions";
  var TARGET_DEFINITION_LIST = "_jsPlumbTargetDefinitions";
  var DEFAULT = "default";
  var WILDCARD = "*";
  var SOURCE = "source";
  var TARGET = "target";
  var BLOCK = "block";
  var NONE = "none";
  var TRUE = "true";
  var FALSE = "false";
  var UNDEFINED = "undefined";
  var ABSOLUTE = "absolute";
  var FIXED = "fixed";
  var STATIC = "static";
  var GROUP_KEY = "_jsPlumbGroup";
  var PARENT_GROUP_KEY = "_jsPlumbParentGroup";
  var ATTRIBUTE_CONTAINER = "jtk-container";
  var ATTRIBUTE_GROUP = "jtk-group";
  var ATTRIBUTE_MANAGED = "jtk-managed";
  var ATTRIBUTE_NOT_DRAGGABLE = "jtk-not-draggable";
  var ATTRIBUTE_SOURCE = "jtk-source";
  var ATTRIBUTE_TABINDEX = "tabindex";
  var ATTRIBUTE_TARGET = "jtk-target";
  var CHECK_CONDITION = "checkCondition";
  var CHECK_DROP_ALLOWED = "checkDropAllowed";
  var CLASS_CONNECTOR = "jtk-connector";
  var CLASS_ENDPOINT = "jtk-endpoint";
  var CLASS_GROUP_COLLAPSED = "jtk-group-collapsed";
  var CLASS_GROUP_EXPANDED = "jtk-group-expanded";
  var CLASS_OVERLAY = "jtk-overlay";
  var CMD_HIDE = "hide";
  var CMD_SHOW = "show";
  var EVENT_CLICK = "click";
  var EVENT_COLLAPSE = "group:collapse";
  var EVENT_CONNECTION = "connection";
  var EVENT_CONNECTION_DETACHED = "connection:detach";
  var EVENT_CONNECTION_MOVED = "connection:move";
  var EVENT_CONNECTION_MOUSEOUT = "connectionMouseOut";
  var EVENT_CONNECTION_MOUSEOVER = "connectionMouseOver";
  var EVENT_CONTAINER_CHANGE = "container:change";
  var EVENT_CONTEXTMENU = "contextmenu";
  var EVENT_DBL_CLICK = "dblclick";
  var EVENT_DBL_TAP = "dbltap";
  var EVENT_ELEMENT_CLICK = "elementClick";
  var EVENT_ELEMENT_DBL_CLICK = "elementDblClick";
  var EVENT_ELEMENT_MOUSE_MOVE = "elementMousemove";
  var EVENT_ELEMENT_MOUSE_OUT = "elementMouseout";
  var EVENT_ELEMENT_MOUSE_OVER = "elementMouseover";
  var EVENT_ENDPOINT_CLICK = "endpointClick";
  var EVENT_ENDPOINT_DBL_CLICK = "endpointDblClick";
  var EVENT_ENDPOINT_MOUSEOUT = "endpointMouseOut";
  var EVENT_ENDPOINT_MOUSEOVER = "endpointMouseOver";
  var EVENT_ENDPOINT_REPLACED = "endpointReplaced";
  var EVENT_INTERNAL_ENDPOINT_UNREGISTERED = "internal.endpointUnregistered";
  var EVENT_FOCUS = "focus";
  var EVENT_INTERNAL_CONNECTION_DETACHED = "internal.connection:detach";
  var EVENT_MANAGE_ELEMENT = "manageElement";
  var EVENT_MOUSEDOWN = "mousedown";
  var EVENT_MOUSEENTER = "mouseenter";
  var EVENT_MOUSEEXIT = "mouseexit";
  var EVENT_MOUSEMOVE = "mousemove";
  var EVENT_MOUSEOUT = "mouseout";
  var EVENT_MOUSEOVER = "mouseover";
  var EVENT_MOUSEUP = "mouseup";
  var EVENT_EXPAND = "group:expand";
  var EVENT_GROUP_ADDED = "group:add";
  var EVENT_GROUP_MEMBER_ADDED = "group:addMember";
  var EVENT_GROUP_MEMBER_REMOVED = "group:removeMember";
  var EVENT_GROUP_REMOVED = "group:remove";
  var EVENT_MAX_CONNECTIONS = "maxConnections";
  var EVENT_NESTED_GROUP_ADDED = "nestedGroupAdded";
  var EVENT_NESTED_GROUP_REMOVED = "nestedGroupRemoved";
  var EVENT_TAP = "tap";
  var EVENT_UNMANAGE_ELEMENT = "unmanageElement";
  var EVENT_ZOOM = "zoom";
  var IS_DETACH_ALLOWED = "isDetachAllowed";
  var IS_GROUP_KEY = "_isJsPlumbGroup";
  var INTERCEPT_BEFORE_DROP = "beforeDrop";
  var INTERCEPT_BEFORE_DETACH = "beforeDetach";
  var JTK_ID = "jtk-id";
  var PROPERTY_POSITION = "position";
  var SELECTOR_CONNECTOR = cls(CLASS_CONNECTOR);
  var SELECTOR_ENDPOINT = cls(CLASS_ENDPOINT);
  var SELECTOR_GROUP_CONTAINER = "[jtk-group-content]";
  var SELECTOR_MANAGED_ELEMENT = "[jtk-managed]";
  var SELECTOR_OVERLAY = cls(CLASS_OVERLAY);
  var SCOPE_PREFIX = "jtk-scope-";

  var EventGenerator =
  function () {
    function EventGenerator() {
      _classCallCheck(this, EventGenerator);
      _defineProperty(this, "_listeners", {});
      _defineProperty(this, "eventsSuspended", false);
      _defineProperty(this, "tick", false);
      _defineProperty(this, "eventsToDieOn", {
        "ready": true
      });
      _defineProperty(this, "queue", []);
    }
    _createClass(EventGenerator, [{
      key: "fire",
      value: function fire(event, value, originalEvent) {
        var ret = null;
        if (!this.tick) {
          this.tick = true;
          if (!this.eventsSuspended && this._listeners[event]) {
            var l = this._listeners[event].length,
                i = 0,
                _gone = false;
            if (!this.shouldFireEvent || this.shouldFireEvent(event, value, originalEvent)) {
              while (!_gone && i < l && ret !== false) {
                if (this.eventsToDieOn[event]) {
                  this._listeners[event][i].apply(this, [value, originalEvent]);
                } else {
                  try {
                    ret = this._listeners[event][i].apply(this, [value, originalEvent]);
                  } catch (e) {
                    log("jsPlumb: fire failed for event " + event + " : " + (e.message || e));
                  }
                }
                i++;
                if (this._listeners == null || this._listeners[event] == null) {
                  _gone = true;
                }
              }
            }
          }
          this.tick = false;
          this._drain();
        } else {
          this.queue.unshift(arguments);
        }
        return ret;
      }
    }, {
      key: "_drain",
      value: function _drain() {
        var n = this.queue.pop();
        if (n) {
          this.fire.apply(this, n);
        }
      }
    }, {
      key: "unbind",
      value: function unbind(eventOrListener, listener) {
        if (arguments.length === 0) {
          this._listeners = {};
        } else if (arguments.length === 1) {
          if (typeof eventOrListener === "string") {
            delete this._listeners[eventOrListener];
          } else if (eventOrListener.__jsPlumb) {
            var evt;
            for (var i in eventOrListener.__jsPlumb) {
              evt = eventOrListener.__jsPlumb[i];
              remove(this._listeners[evt] || [], eventOrListener);
            }
          }
        } else if (arguments.length === 2) {
          remove(this._listeners[eventOrListener] || [], listener);
        }
        return this;
      }
    }, {
      key: "getListener",
      value: function getListener(forEvent) {
        return this._listeners[forEvent] || [];
      }
    }, {
      key: "isSuspendEvents",
      value: function isSuspendEvents() {
        return this.eventsSuspended;
      }
    }, {
      key: "setSuspendEvents",
      value: function setSuspendEvents(val) {
        this.eventsSuspended = val;
      }
    }, {
      key: "bind",
      value: function bind(event, listener, insertAtStart) {
        var _this = this;
        var _one = function _one(evt) {
          addToDictionary(_this._listeners, evt, listener, insertAtStart);
          listener.__jsPlumb = listener.__jsPlumb || {};
          listener.__jsPlumb[uuid()] = evt;
        };
        if (typeof event === "string") {
          _one(event);
        } else if (event.length != null) {
          for (var i = 0; i < event.length; i++) {
            _one(event[i]);
          }
        }
        return this;
      }
    }, {
      key: "cleanupListeners",
      value: function cleanupListeners() {
        for (var i in this._listeners) {
          this._listeners[i] = null;
        }
      }
    }, {
      key: "silently",
      value: function silently(fn) {
        this.setSuspendEvents(true);
        try {
          fn();
        } catch (e) {
          log("Cannot execute silent function " + e);
        }
        this.setSuspendEvents(false);
      }
    }]);
    return EventGenerator;
  }();
  var OptimisticEventGenerator =
  function (_EventGenerator) {
    _inherits(OptimisticEventGenerator, _EventGenerator);
    function OptimisticEventGenerator() {
      _classCallCheck(this, OptimisticEventGenerator);
      return _possibleConstructorReturn(this, _getPrototypeOf(OptimisticEventGenerator).apply(this, arguments));
    }
    _createClass(OptimisticEventGenerator, [{
      key: "shouldFireEvent",
      value: function shouldFireEvent(event, value, originalEvent) {
        return true;
      }
    }]);
    return OptimisticEventGenerator;
  }(EventGenerator);

  function _splitType(t) {
    return t == null ? null : t.split(" ");
  }
  function _mapType(map, obj, typeId) {
    for (var i in obj) {
      map[i] = typeId;
    }
  }
  var CONNECTOR = "connector";
  var MERGE_STRATEGY_OVERRIDE = "override";
  var CSS_CLASS = "cssClass";
  var DEFAULT_TYPE_KEY = "__default";
  var ANCHOR = "anchor";
  var ANCHORS = "anchors";
  function _applyTypes(component, params) {
    if (component.getDefaultType) {
      var td = component.getTypeDescriptor(),
          map = {};
      var defType = component.getDefaultType();
      var o = extend({}, defType);
      _mapType(map, defType, DEFAULT_TYPE_KEY);
      for (var i = 0, j = component._types.length; i < j; i++) {
        var tid = component._types[i];
        if (tid !== DEFAULT_TYPE_KEY) {
          var _t = component.instance.getType(tid, td);
          if (_t != null) {
            var overrides = new Set([CONNECTOR, ANCHOR, ANCHORS]);
            if (_t.mergeStrategy === MERGE_STRATEGY_OVERRIDE) {
              for (var k in _t) {
                overrides.add(k);
              }
            }
            o = merge(o, _t, [CSS_CLASS], Array.from(overrides));
            _mapType(map, _t, tid);
          }
        }
      }
      if (params) {
        o = populate(o, params, "_");
      }
      component.applyType(o, map);
    }
  }
  function _removeTypeCssHelper(component, typeIndex) {
    var typeId = component._types[typeIndex],
        type = component.instance.getType(typeId, component.getTypeDescriptor());
    if (type != null && type.cssClass) {
      component.removeClass(type.cssClass);
    }
  }
  function _updateHoverStyle(component) {
    if (component.paintStyle && component.hoverPaintStyle) {
      var mergedHoverStyle = {};
      extend(mergedHoverStyle, component.paintStyle);
      extend(mergedHoverStyle, component.hoverPaintStyle);
      component.hoverPaintStyle = mergedHoverStyle;
    }
  }
  var Component =
  function (_EventGenerator) {
    _inherits(Component, _EventGenerator);
    function Component(instance, params) {
      var _this;
      _classCallCheck(this, Component);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(Component).call(this));
      _this.instance = instance;
      _defineProperty(_assertThisInitialized(_this), "clone", void 0);
      _defineProperty(_assertThisInitialized(_this), "segment", void 0);
      _defineProperty(_assertThisInitialized(_this), "x", void 0);
      _defineProperty(_assertThisInitialized(_this), "y", void 0);
      _defineProperty(_assertThisInitialized(_this), "w", void 0);
      _defineProperty(_assertThisInitialized(_this), "h", void 0);
      _defineProperty(_assertThisInitialized(_this), "id", void 0);
      _defineProperty(_assertThisInitialized(_this), "visible", true);
      _defineProperty(_assertThisInitialized(_this), "typeId", void 0);
      _defineProperty(_assertThisInitialized(_this), "params", {});
      _defineProperty(_assertThisInitialized(_this), "paintStyle", void 0);
      _defineProperty(_assertThisInitialized(_this), "hoverPaintStyle", void 0);
      _defineProperty(_assertThisInitialized(_this), "paintStyleInUse", void 0);
      _defineProperty(_assertThisInitialized(_this), "_hover", false);
      _defineProperty(_assertThisInitialized(_this), "lastPaintedAt", void 0);
      _defineProperty(_assertThisInitialized(_this), "data", void 0);
      _defineProperty(_assertThisInitialized(_this), "_defaultType", void 0);
      _defineProperty(_assertThisInitialized(_this), "events", void 0);
      _defineProperty(_assertThisInitialized(_this), "parameters", void 0);
      _defineProperty(_assertThisInitialized(_this), "_types", void 0);
      _defineProperty(_assertThisInitialized(_this), "_typeCache", void 0);
      _defineProperty(_assertThisInitialized(_this), "cssClass", void 0);
      _defineProperty(_assertThisInitialized(_this), "hoverClass", void 0);
      _defineProperty(_assertThisInitialized(_this), "beforeDetach", void 0);
      _defineProperty(_assertThisInitialized(_this), "beforeDrop", void 0);
      params = params || {};
      _this.cssClass = params.cssClass || "";
      _this.hoverClass = params.hoverClass || instance.Defaults.hoverClass;
      _this.beforeDetach = params.beforeDetach;
      _this.beforeDrop = params.beforeDrop;
      _this._types = [];
      _this._typeCache = {};
      _this.parameters = params.parameters || {};
      _this.id = _this.getIdPrefix() + new Date().getTime();
      var o = params.overlays || [],
          oo = {};
      var defaultOverlayKey = _this.getDefaultOverlayKey();
      if (defaultOverlayKey) {
        var defaultOverlays = _this.instance.Defaults[defaultOverlayKey];
        if (defaultOverlays) {
          o.push.apply(o, _toConsumableArray(defaultOverlays));
        }
        for (var i = 0; i < o.length; i++) {
          var fo = _this.instance.convertToFullOverlaySpec(o[i]);
          oo[fo[1].id] = fo;
        }
      }
      _this._defaultType = {
        overlays: oo,
        parameters: params.parameters || {},
        scope: params.scope || _this.instance.defaultScope
      };
      if (params.events) {
        for (var evtName in params.events) {
          _this.bind(evtName, params.events[evtName]);
        }
      }
      _this.clone = function () {
        var o = Object.create(_this.constructor.prototype);
        _this.constructor.apply(o, [instance, params]);
        return o;
      };
      return _this;
    }
    _createClass(Component, [{
      key: "isDetachAllowed",
      value: function isDetachAllowed(connection) {
        var r = true;
        if (this.beforeDetach) {
          try {
            r = this.beforeDetach(connection);
          } catch (e) {
            log("jsPlumb: beforeDetach callback failed", e);
          }
        }
        return r;
      }
    }, {
      key: "isDropAllowed",
      value: function isDropAllowed(sourceId, targetId, scope, connection, dropEndpoint, source, target) {
        var r = this.instance.checkCondition(INTERCEPT_BEFORE_DROP, {
          sourceId: sourceId,
          targetId: targetId,
          scope: scope,
          connection: connection,
          dropEndpoint: dropEndpoint,
          source: source,
          target: target
        });
        if (this.beforeDrop) {
          try {
            r = this.beforeDrop({
              sourceId: sourceId,
              targetId: targetId,
              scope: scope,
              connection: connection,
              dropEndpoint: dropEndpoint,
              source: source,
              target: target
            });
          } catch (e) {
            log("jsPlumb: beforeDrop callback failed", e);
          }
        }
        return r;
      }
    }, {
      key: "getDefaultType",
      value: function getDefaultType() {
        return this._defaultType;
      }
    }, {
      key: "appendToDefaultType",
      value: function appendToDefaultType(obj) {
        for (var i in obj) {
          this._defaultType[i] = obj[i];
        }
      }
    }, {
      key: "getId",
      value: function getId() {
        return this.id;
      }
    }, {
      key: "cacheTypeItem",
      value: function cacheTypeItem(key, item, typeId) {
        this._typeCache[typeId] = this._typeCache[typeId] || {};
        this._typeCache[typeId][key] = item;
      }
    }, {
      key: "getCachedTypeItem",
      value: function getCachedTypeItem(key, typeId) {
        return this._typeCache[typeId] ? this._typeCache[typeId][key] : null;
      }
    }, {
      key: "setType",
      value: function setType(typeId, params) {
        this.clearTypes();
        this._types = _splitType(typeId) || [];
        _applyTypes(this, params);
      }
    }, {
      key: "getType",
      value: function getType() {
        return this._types;
      }
    }, {
      key: "reapplyTypes",
      value: function reapplyTypes(params) {
        _applyTypes(this, params);
      }
    }, {
      key: "hasType",
      value: function hasType(typeId) {
        return this._types.indexOf(typeId) !== -1;
      }
    }, {
      key: "addType",
      value: function addType(typeId, params) {
        var t = _splitType(typeId),
            _somethingAdded = false;
        if (t != null) {
          for (var i = 0, j = t.length; i < j; i++) {
            if (!this.hasType(t[i])) {
              this._types.push(t[i]);
              _somethingAdded = true;
            }
          }
          if (_somethingAdded) {
            _applyTypes(this, params);
          }
        }
      }
    }, {
      key: "removeType",
      value: function removeType(typeId, params) {
        var _this2 = this;
        var t = _splitType(typeId),
            _cont = false,
            _one = function _one(tt) {
          var idx = _this2._types.indexOf(tt);
          if (idx !== -1) {
            _removeTypeCssHelper(_this2, idx);
            _this2._types.splice(idx, 1);
            return true;
          }
          return false;
        };
        if (t != null) {
          for (var i = 0, j = t.length; i < j; i++) {
            _cont = _one(t[i]) || _cont;
          }
          if (_cont) {
            _applyTypes(this, params);
          }
        }
      }
    }, {
      key: "clearTypes",
      value: function clearTypes(params, doNotRepaint) {
        var i = this._types.length;
        for (var j = 0; j < i; j++) {
          _removeTypeCssHelper(this, 0);
          this._types.splice(0, 1);
        }
        _applyTypes(this, params);
      }
    }, {
      key: "toggleType",
      value: function toggleType(typeId, params) {
        var t = _splitType(typeId);
        if (t != null) {
          for (var i = 0, j = t.length; i < j; i++) {
            var idx = this._types.indexOf(t[i]);
            if (idx !== -1) {
              _removeTypeCssHelper(this, idx);
              this._types.splice(idx, 1);
            } else {
              this._types.push(t[i]);
            }
          }
          _applyTypes(this, params);
        }
      }
    }, {
      key: "applyType",
      value: function applyType(t, params) {
        this.setPaintStyle(t.paintStyle);
        this.setHoverPaintStyle(t.hoverPaintStyle);
        if (t.parameters) {
          for (var i in t.parameters) {
            this.setParameter(i, t.parameters[i]);
          }
        }
        this.paintStyleInUse = this.getPaintStyle();
      }
    }, {
      key: "setPaintStyle",
      value: function setPaintStyle(style) {
        this.paintStyle = style;
        this.paintStyleInUse = this.paintStyle;
        _updateHoverStyle(this);
      }
    }, {
      key: "getPaintStyle",
      value: function getPaintStyle() {
        return this.paintStyle;
      }
    }, {
      key: "setHoverPaintStyle",
      value: function setHoverPaintStyle(style) {
        this.hoverPaintStyle = style;
        _updateHoverStyle(this);
      }
    }, {
      key: "getHoverPaintStyle",
      value: function getHoverPaintStyle() {
        return this.hoverPaintStyle;
      }
    }, {
      key: "destroy",
      value: function destroy(force) {
        if (force || this.typeId == null) {
          this.cleanupListeners();
          this.clone = null;
        }
      }
    }, {
      key: "isHover",
      value: function isHover() {
        return this._hover;
      }
    }, {
      key: "getParameter",
      value: function getParameter(name) {
        return this.parameters[name];
      }
    }, {
      key: "setParameter",
      value: function setParameter(name, value) {
        this.parameters[name] = value;
      }
    }, {
      key: "getParameters",
      value: function getParameters() {
        return this.parameters;
      }
    }, {
      key: "setParameters",
      value: function setParameters(p) {
        this.parameters = p;
      }
    }, {
      key: "setVisible",
      value: function setVisible(v) {
        this.visible = v;
      }
    }, {
      key: "isVisible",
      value: function isVisible() {
        return this.visible;
      }
    }, {
      key: "addClass",
      value: function addClass(clazz, dontUpdateOverlays) {
        var parts = (this.cssClass || "").split(" ");
        parts.push(clazz);
        this.cssClass = parts.join(" ");
      }
    }, {
      key: "removeClass",
      value: function removeClass(clazz, dontUpdateOverlays) {
        var parts = (this.cssClass || "").split(" ");
        this.cssClass = parts.filter(function (p) {
          return p !== clazz;
        }).join(" ");
      }
    }, {
      key: "getClass",
      value: function getClass() {
        return this.cssClass;
      }
    }, {
      key: "shouldFireEvent",
      value: function shouldFireEvent(event, value, originalEvent) {
        return true;
      }
    }, {
      key: "getData",
      value: function getData() {
        return this.data;
      }
    }, {
      key: "setData",
      value: function setData(d) {
        this.data = d || {};
      }
    }, {
      key: "mergeData",
      value: function mergeData(d) {
        this.data = extend(this.data, d);
      }
    }]);
    return Component;
  }(EventGenerator);

  var Overlay =
  function (_EventGenerator) {
    _inherits(Overlay, _EventGenerator);
    function Overlay(instance, component, p) {
      var _this;
      _classCallCheck(this, Overlay);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(Overlay).call(this));
      _this.instance = instance;
      _this.component = component;
      _defineProperty(_assertThisInitialized(_this), "id", void 0);
      _defineProperty(_assertThisInitialized(_this), "type", void 0);
      _defineProperty(_assertThisInitialized(_this), "cssClass", void 0);
      _defineProperty(_assertThisInitialized(_this), "visible", true);
      _defineProperty(_assertThisInitialized(_this), "location", void 0);
      _defineProperty(_assertThisInitialized(_this), "endpointLocation", void 0);
      _defineProperty(_assertThisInitialized(_this), "events", void 0);
      p = p || {};
      _this.id = p.id || uuid();
      _this.cssClass = p.cssClass || "";
      _this.location = p.location || 0.5;
      _this.events = p.events || {};
      for (var _event in _this.events) {
        _this.bind(_event, _this.events[_event]);
      }
      return _this;
    }
    _createClass(Overlay, [{
      key: "shouldFireEvent",
      value: function shouldFireEvent(event, value, originalEvent) {
        return true;
      }
    }, {
      key: "setVisible",
      value: function setVisible(v) {
        this.visible = v;
        this.instance.setOverlayVisible(this, v);
      }
    }, {
      key: "isVisible",
      value: function isVisible() {
        return this.visible;
      }
    }, {
      key: "destroy",
      value: function destroy(force) {
        this.instance.destroyOverlay(this, force);
      }
    }, {
      key: "_postComponentEvent",
      value: function _postComponentEvent(eventName, originalEvent) {
        this.instance.fire(eventName, this.component, originalEvent);
      }
    }, {
      key: "click",
      value: function click(e) {
        this.fire(EVENT_CLICK, e);
        var eventName = this.component instanceof Connection ? EVENT_CLICK : EVENT_ENDPOINT_CLICK;
        this._postComponentEvent(eventName, e);
      }
    }, {
      key: "dblclick",
      value: function dblclick(e) {
        this.fire(EVENT_DBL_CLICK, e);
        var eventName = this.component instanceof Connection ? EVENT_DBL_CLICK : EVENT_ENDPOINT_DBL_CLICK;
        this._postComponentEvent(eventName, e);
      }
    }]);
    return Overlay;
  }(EventGenerator);

  var overlayMap = {};
  var OverlayFactory = {
    get: function get(instance, name, component, params) {
      var c = overlayMap[name];
      if (!c) {
        throw {
          message: "jsPlumb: unknown overlay type '" + name + "'"
        };
      } else {
        return new c(instance, component, params);
      }
    },
    register: function register(name, overlay) {
      overlayMap[name] = overlay;
    }
  };

  var LabelOverlay =
  function (_Overlay) {
    _inherits(LabelOverlay, _Overlay);
    function LabelOverlay(instance, component, p) {
      var _this;
      _classCallCheck(this, LabelOverlay);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(LabelOverlay).call(this, instance, component, p));
      _this.instance = instance;
      _this.component = component;
      _defineProperty(_assertThisInitialized(_this), "label", void 0);
      _defineProperty(_assertThisInitialized(_this), "labelText", void 0);
      _defineProperty(_assertThisInitialized(_this), "type", LabelOverlay.labelType);
      _defineProperty(_assertThisInitialized(_this), "cachedDimensions", void 0);
      p = p || {
        label: ""
      };
      _this.setLabel(p.label);
      return _this;
    }
    _createClass(LabelOverlay, [{
      key: "getLabel",
      value: function getLabel() {
        if (isFunction(this.label)) {
          return this.label(this);
        } else {
          return this.labelText;
        }
      }
    }, {
      key: "setLabel",
      value: function setLabel(l) {
        this.label = l;
        this.labelText = null;
        this.instance.updateLabel(this);
      }
    }, {
      key: "getDimensions",
      value: function getDimensions() {
        return [1, 1];
      }
    }, {
      key: "updateFrom",
      value: function updateFrom(d) {
        if (d.label != null) {
          this.setLabel(d.label);
        }
      }
    }]);
    return LabelOverlay;
  }(Overlay);
  _defineProperty(LabelOverlay, "labelType", "Label");
  function isLabelOverlay(o) {
    return o.type === LabelOverlay.labelType;
  }
  OverlayFactory.register("Label", LabelOverlay);

  var _internalLabelOverlayId = "__label";
  function _makeLabelOverlay(component, params) {
    var _params = {
      cssClass: params.cssClass,
      id: _internalLabelOverlayId,
      component: component,
      _jsPlumb: component.instance
    },
        mergedParams = extend(_params, params);
    return new LabelOverlay(component.instance, component, mergedParams);
  }
  function _processOverlay(component, o) {
    var _newOverlay = null;
    if (isArray(o)) {
      var oa = o;
      var type = oa[0],
      p = extend({}, oa[1]);
      if (oa.length === 3) {
        extend(p, oa[2]);
      }
      _newOverlay = OverlayFactory.get(component.instance, type, component, p);
    } else if (isString(o)) {
      _newOverlay = OverlayFactory.get(component.instance, o, component, {});
    } else {
      _newOverlay = o;
    }
    _newOverlay.id = _newOverlay.id || uuid();
    component.cacheTypeItem("overlay", _newOverlay, _newOverlay.id);
    component.overlays[_newOverlay.id] = _newOverlay;
    return _newOverlay;
  }
  var OverlayCapableComponent =
  function (_Component) {
    _inherits(OverlayCapableComponent, _Component);
    function OverlayCapableComponent(instance, params) {
      var _this;
      _classCallCheck(this, OverlayCapableComponent);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(OverlayCapableComponent).call(this, instance, params));
      _this.instance = instance;
      _defineProperty(_assertThisInitialized(_this), "defaultLabelLocation", 0.5);
      _defineProperty(_assertThisInitialized(_this), "overlays", {});
      _defineProperty(_assertThisInitialized(_this), "overlayPositions", {});
      _defineProperty(_assertThisInitialized(_this), "overlayPlacements", {});
      params = params || {};
      _this.overlays = {};
      _this.overlayPositions = {};
      if (params.label) {
        _this.getDefaultType().overlays[_internalLabelOverlayId] = ["Label", {
          label: params.label,
          location: params.labelLocation || _this.defaultLabelLocation,
          id: _internalLabelOverlayId
        }];
      }
      return _this;
    }
    _createClass(OverlayCapableComponent, [{
      key: "addOverlay",
      value: function addOverlay(overlay) {
        var o = _processOverlay(this, overlay);
        if (this.getData && o.type === "Label" && isArray(overlay)) {
          var d = this.getData(),
              p = overlay[1];
          if (d) {
            var locationAttribute = p.labelLocationAttribute || "labelLocation";
            var loc = d[locationAttribute];
            if (loc) {
              o.location = loc;
            }
          }
        }
        return o;
      }
    }, {
      key: "getOverlay",
      value: function getOverlay(id) {
        return this.overlays[id];
      }
    }, {
      key: "getOverlays",
      value: function getOverlays() {
        return this.overlays;
      }
    }, {
      key: "hideOverlay",
      value: function hideOverlay(id) {
        var o = this.getOverlay(id);
        if (o) {
          o.setVisible(false);
        }
      }
    }, {
      key: "hideOverlays",
      value: function hideOverlays() {
        for (var i in this.overlays) {
          this.overlays[i].setVisible(false);
        }
      }
    }, {
      key: "showOverlay",
      value: function showOverlay(id) {
        var o = this.getOverlay(id);
        if (o) {
          o.setVisible(true);
        }
      }
    }, {
      key: "showOverlays",
      value: function showOverlays() {
        for (var i in this.overlays) {
          this.overlays[i].setVisible(true);
        }
      }
    }, {
      key: "removeAllOverlays",
      value: function removeAllOverlays() {
        for (var i in this.overlays) {
          this.overlays[i].destroy(true);
        }
        this.overlays = {};
        this.overlayPositions = null;
        this.overlayPlacements = {};
      }
    }, {
      key: "removeOverlay",
      value: function removeOverlay(overlayId, dontCleanup) {
        var o = this.overlays[overlayId];
        if (o) {
          o.setVisible(false);
          if (!dontCleanup) {
            o.destroy(true);
          }
          delete this.overlays[overlayId];
          if (this.overlayPositions) {
            delete this.overlayPositions[overlayId];
          }
          if (this.overlayPlacements) {
            delete this.overlayPlacements[overlayId];
          }
        }
      }
    }, {
      key: "removeOverlays",
      value: function removeOverlays() {
        for (var _len = arguments.length, overlays = new Array(_len), _key = 0; _key < _len; _key++) {
          overlays[_key] = arguments[_key];
        }
        for (var i = 0, j = overlays.length; i < j; i++) {
          this.removeOverlay(arguments[i]);
        }
      }
    }, {
      key: "getLabel",
      value: function getLabel() {
        var lo = this.getLabelOverlay();
        return lo != null ? lo.getLabel() : null;
      }
    }, {
      key: "getLabelOverlay",
      value: function getLabelOverlay() {
        return this.getOverlay(_internalLabelOverlayId);
      }
    }, {
      key: "setLabel",
      value: function setLabel(l) {
        var lo = this.getLabelOverlay();
        if (!lo) {
          var params = l.constructor === String || l.constructor === Function ? {
            label: l
          } : l;
          lo = _makeLabelOverlay(this, params);
          this.overlays[_internalLabelOverlayId] = lo;
        } else {
          if (isString(l) || isFunction(l)) {
            lo.setLabel(l);
          } else {
            var ll = l;
            if (ll.label) {
              lo.setLabel(ll.label);
            }
            if (ll.location) {
              lo.location = ll.location;
            }
          }
        }
      }
    }, {
      key: "destroy",
      value: function destroy(force) {
        for (var i in this.overlays) {
          this.overlays[i].destroy(force);
        }
        if (force) {
          this.overlays = {};
          this.overlayPositions = {};
        }
        _get(_getPrototypeOf(OverlayCapableComponent.prototype), "destroy", this).call(this, force);
      }
    }, {
      key: "setVisible",
      value: function setVisible(v) {
        _get(_getPrototypeOf(OverlayCapableComponent.prototype), "setVisible", this).call(this, v);
        this[v ? "showOverlays" : "hideOverlays"]();
      }
    }, {
      key: "setAbsoluteOverlayPosition",
      value: function setAbsoluteOverlayPosition(overlay, xy) {
        this.overlayPositions[overlay.id] = xy;
      }
    }, {
      key: "getAbsoluteOverlayPosition",
      value: function getAbsoluteOverlayPosition(overlay) {
        return this.overlayPositions ? this.overlayPositions[overlay.id] : null;
      }
    }, {
      key: "_clazzManip",
      value: function _clazzManip(action, clazz, dontUpdateOverlays) {
        if (!dontUpdateOverlays) {
          for (var i in this.overlays) {
            if (action === "add") {
              this.instance.addOverlayClass(this.overlays[i], clazz);
            } else if (action === "remove") {
              this.instance.removeOverlayClass(this.overlays[i], clazz);
            }
          }
        }
      }
    }, {
      key: "addClass",
      value: function addClass(clazz, dontUpdateOverlays) {
        _get(_getPrototypeOf(OverlayCapableComponent.prototype), "addClass", this).call(this, clazz);
        this._clazzManip("add", clazz, dontUpdateOverlays);
      }
    }, {
      key: "removeClass",
      value: function removeClass(clazz, dontUpdateOverlays) {
        _get(_getPrototypeOf(OverlayCapableComponent.prototype), "removeClass", this).call(this, clazz);
        this._clazzManip("remove", clazz, dontUpdateOverlays);
      }
    }, {
      key: "applyType",
      value: function applyType(t, typeMap) {
        _get(_getPrototypeOf(OverlayCapableComponent.prototype), "applyType", this).call(this, t, typeMap);
        if (t.overlays) {
          var keep = {},
              i;
          for (i in t.overlays) {
            var existing = this.overlays[t.overlays[i][1].id];
            if (existing) {
              existing.updateFrom(t.overlays[i][1]);
              keep[t.overlays[i][1].id] = true;
              this.instance.reattachOverlay(existing, this);
            } else {
              var c = this.getCachedTypeItem("overlay", t.overlays[i][1].id);
              if (c != null) {
                this.instance.reattachOverlay(c, this);
                c.setVisible(true);
                c.updateFrom(t.overlays[i][1]);
                this.overlays[c.id] = c;
              } else {
                c = this.addOverlay(t.overlays[i]);
              }
              keep[c.id] = true;
            }
          }
          for (i in this.overlays) {
            if (keep[this.overlays[i].id] == null) {
              this.removeOverlay(this.overlays[i].id, true);
            }
          }
        }
      }
    }]);
    return OverlayCapableComponent;
  }(Component);

  var Anchor =
  function (_EventGenerator) {
    _inherits(Anchor, _EventGenerator);
    function Anchor(instance, params) {
      var _this;
      _classCallCheck(this, Anchor);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(Anchor).call(this));
      _this.instance = instance;
      _defineProperty(_assertThisInitialized(_this), "type", void 0);
      _defineProperty(_assertThisInitialized(_this), "isDynamic", false);
      _defineProperty(_assertThisInitialized(_this), "isContinuous", false);
      _defineProperty(_assertThisInitialized(_this), "isFloating", false);
      _defineProperty(_assertThisInitialized(_this), "cssClass", "");
      _defineProperty(_assertThisInitialized(_this), "elementId", void 0);
      _defineProperty(_assertThisInitialized(_this), "id", void 0);
      _defineProperty(_assertThisInitialized(_this), "locked", void 0);
      _defineProperty(_assertThisInitialized(_this), "offsets", void 0);
      _defineProperty(_assertThisInitialized(_this), "orientation", void 0);
      _defineProperty(_assertThisInitialized(_this), "x", void 0);
      _defineProperty(_assertThisInitialized(_this), "y", void 0);
      _defineProperty(_assertThisInitialized(_this), "timestamp", void 0);
      _defineProperty(_assertThisInitialized(_this), "lastReturnValue", void 0);
      _defineProperty(_assertThisInitialized(_this), "_unrotatedOrientation", void 0);
      _defineProperty(_assertThisInitialized(_this), "positionFinder", void 0);
      _defineProperty(_assertThisInitialized(_this), "clone", void 0);
      params = params || {};
      _this.cssClass = params.cssClass || "";
      return _this;
    }
    _createClass(Anchor, [{
      key: "shouldFireEvent",
      value: function shouldFireEvent(event, value, originalEvent) {
        return true;
      }
    }, {
      key: "getOrientation",
      value: function getOrientation(endpoint) {
        return this.orientation;
      }
    }, {
      key: "getCurrentLocation",
      value: function getCurrentLocation(params) {
        params = params || {};
        return this.lastReturnValue == null || params.timestamp != null && this.timestamp !== params.timestamp ? this.compute(params) : this.lastReturnValue;
      }
    }, {
      key: "setPosition",
      value: function setPosition(x, y, ox, oy, overrideLock) {
        if (!this.locked || overrideLock) {
          this.x = x;
          this.y = y;
          this.orientation = [ox, oy];
          this._unrotatedOrientation = [ox, oy];
          this.lastReturnValue = null;
        }
      }
    }, {
      key: "setInitialOrientation",
      value: function setInitialOrientation(ox, oy) {
        this.orientation = [ox, oy];
        this._unrotatedOrientation = [ox, oy];
      }
    }, {
      key: "compute",
      value: function compute(params) {
        var xy = params.xy,
            wh = params.wh,
            timestamp = params.timestamp;
        if (timestamp && timestamp === this.timestamp) {
          return this.lastReturnValue;
        }
        var candidate = [xy[0] + this.x * wh[0] + this.offsets[0], xy[1] + this.y * wh[1] + this.offsets[1], this.x, this.y];
        var rotation = params.rotation;
        if (rotation != null && rotation !== 0) {
          var c2 = rotatePoint(candidate, [xy[0] + wh[0] / 2, xy[1] + wh[1] / 2], rotation);
          this.orientation[0] = Math.round(this._unrotatedOrientation[0] * c2[2] - this._unrotatedOrientation[1] * c2[3]);
          this.orientation[1] = Math.round(this._unrotatedOrientation[1] * c2[2] + this._unrotatedOrientation[0] * c2[3]);
          this.lastReturnValue = [c2[0], c2[1], this.x, this.y];
        } else {
          this.orientation[0] = this._unrotatedOrientation[0];
          this.orientation[1] = this._unrotatedOrientation[1];
          this.lastReturnValue = candidate;
        }
        this.timestamp = timestamp;
        return this.lastReturnValue;
      }
    }, {
      key: "equals",
      value: function equals(anchor) {
        if (!anchor) {
          return false;
        }
        var ao = anchor.getOrientation(),
            o = this.getOrientation();
        return this.x === anchor.x && this.y === anchor.y && this.offsets[0] === anchor.offsets[0] && this.offsets[1] === anchor.offsets[1] && o[0] === ao[0] && o[1] === ao[1];
      }
    }, {
      key: "getCssClass",
      value: function getCssClass() {
        return this.cssClass;
      }
    }, {
      key: "lock",
      value: function lock() {
        this.locked = true;
      }
    }, {
      key: "unlock",
      value: function unlock() {
        this.locked = false;
      }
    }, {
      key: "isLocked",
      value: function isLocked() {
        return this.locked;
      }
    }, {
      key: "over",
      value: function over(anchor, endpoint) {}
    }, {
      key: "out",
      value: function out() {}
    }]);
    return Anchor;
  }(EventGenerator);

  function _distance(anchor, cx, cy, xy, wh, rotation, targetRotation) {
    var ax = xy[0] + anchor.x * wh[0],
        ay = xy[1] + anchor.y * wh[1],
        acx = xy[0] + wh[0] / 2,
        acy = xy[1] + wh[1] / 2;
    if (rotation != null && rotation !== 0) {
      var rotated = rotatePoint([ax, ay], [acx, acy], rotation);
      ax = rotated[0];
      ay = rotated[1];
    }
    return Math.sqrt(Math.pow(cx - ax, 2) + Math.pow(cy - ay, 2)) + Math.sqrt(Math.pow(acx - ax, 2) + Math.pow(acy - ay, 2));
  }
  var DEFAULT_ANCHOR_SELECTOR = function DEFAULT_ANCHOR_SELECTOR(xy, wh, txy, twh, rotation, targetRotation, anchors) {
    var cx = txy[0] + twh[0] / 2,
        cy = txy[1] + twh[1] / 2;
    var minIdx = -1,
        minDist = Infinity;
    for (var i = 0; i < anchors.length; i++) {
      var d = _distance(anchors[i], cx, cy, xy, wh, rotation);
      if (d < minDist) {
        minIdx = i + 0;
        minDist = d;
      }
    }
    return anchors[minIdx];
  };
  function _convertAnchor(anchor, instance, elementId) {
    return anchor instanceof Anchor ? anchor : makeAnchorFromSpec(instance, anchor, elementId);
  }
  var DynamicAnchor =
  function (_Anchor) {
    _inherits(DynamicAnchor, _Anchor);
    function DynamicAnchor(instance, options) {
      var _this;
      _classCallCheck(this, DynamicAnchor);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(DynamicAnchor).call(this, instance, options));
      _this.instance = instance;
      _defineProperty(_assertThisInitialized(_this), "anchors", void 0);
      _defineProperty(_assertThisInitialized(_this), "_curAnchor", void 0);
      _defineProperty(_assertThisInitialized(_this), "_lastAnchor", void 0);
      _defineProperty(_assertThisInitialized(_this), "_anchorSelector", null);
      _this.isDynamic = true;
      _this.anchors = [];
      _this.elementId = options.elementId;
      for (var i = 0; i < options.anchors.length; i++) {
        _this.anchors[i] = _convertAnchor(options.anchors[i], instance, _this.elementId);
      }
      _this._curAnchor = _this.anchors.length > 0 ? _this.anchors[0] : null;
      _this._lastAnchor = _this._curAnchor;
      _this._anchorSelector = options.selector || DEFAULT_ANCHOR_SELECTOR;
      return _this;
    }
    _createClass(DynamicAnchor, [{
      key: "getAnchors",
      value: function getAnchors() {
        return this.anchors;
      }
    }, {
      key: "compute",
      value: function compute(params) {
        var xy = params.xy,
            wh = params.wh,
            txy = params.txy,
            twh = params.twh;
        this.timestamp = params.timestamp;
        if (this.isLocked() || txy == null || twh == null) {
          this.lastReturnValue = this._curAnchor.compute(params);
          return this.lastReturnValue;
        } else {
          params.timestamp = null;
        }
        this._curAnchor = this._anchorSelector(xy, wh, txy, twh, params.rotation, params.tRotation, this.anchors);
        this.x = this._curAnchor.x;
        this.y = this._curAnchor.y;
        if (this._curAnchor !== this._lastAnchor) {
          this.fire("anchorChanged", this._curAnchor);
        }
        this._lastAnchor = this._curAnchor;
        this.lastReturnValue = this._curAnchor.compute(params);
        return this.lastReturnValue;
      }
    }, {
      key: "getCurrentLocation",
      value: function getCurrentLocation(params) {
        return this._curAnchor != null ? this._curAnchor.getCurrentLocation(params) : null;
      }
    }, {
      key: "getOrientation",
      value: function getOrientation(_endpoint) {
        return this._curAnchor != null ? this._curAnchor.getOrientation(_endpoint) : [0, 0];
      }
    }, {
      key: "over",
      value: function over(anchor, endpoint) {
        if (this._curAnchor != null) {
          this._curAnchor.over(anchor, endpoint);
        }
      }
    }, {
      key: "out",
      value: function out() {
        if (this._curAnchor != null) {
          this._curAnchor.out();
        }
      }
    }, {
      key: "setAnchor",
      value: function setAnchor(a) {
        this._curAnchor = a;
      }
    }, {
      key: "getCssClass",
      value: function getCssClass() {
        return this._curAnchor && this._curAnchor.getCssClass() || "";
      }
    }, {
      key: "setAnchorCoordinates",
      value: function setAnchorCoordinates(coords) {
        var idx = this.anchors.findIndex(function (a) {
          return a.x === coords[0] && a.y === coords[1];
        });
        if (idx !== -1) {
          this.setAnchor(this.anchors[idx]);
          return true;
        } else {
          return false;
        }
      }
    }]);
    return DynamicAnchor;
  }(Anchor);

  var opposites = {
    "top": "bottom",
    "right": "left",
    "left": "right",
    "bottom": "top"
  };
  var clockwiseOptions = {
    "top": "right",
    "right": "bottom",
    "left": "top",
    "bottom": "left"
  };
  var antiClockwiseOptions = {
    "top": "left",
    "right": "top",
    "left": "bottom",
    "bottom": "right"
  };
  var ContinuousAnchor =
  function (_Anchor) {
    _inherits(ContinuousAnchor, _Anchor);
    function ContinuousAnchor(instance, anchorParams) {
      var _this;
      _classCallCheck(this, ContinuousAnchor);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(ContinuousAnchor).call(this, instance, anchorParams));
      _this.instance = instance;
      _defineProperty(_assertThisInitialized(_this), "type", ContinuousAnchor.continuousAnchorType);
      _defineProperty(_assertThisInitialized(_this), "isDynamic", true);
      _defineProperty(_assertThisInitialized(_this), "isContinuous", true);
      _defineProperty(_assertThisInitialized(_this), "clockwise", void 0);
      _defineProperty(_assertThisInitialized(_this), "faces", void 0);
      _defineProperty(_assertThisInitialized(_this), "secondBest", void 0);
      _defineProperty(_assertThisInitialized(_this), "lastChoice", void 0);
      _defineProperty(_assertThisInitialized(_this), "_currentFace", void 0);
      _defineProperty(_assertThisInitialized(_this), "_lockedFace", void 0);
      _defineProperty(_assertThisInitialized(_this), "_lockedAxis", void 0);
      _defineProperty(_assertThisInitialized(_this), "availableFaces", {});
      _this.faces = anchorParams.faces || ["top", "right", "bottom", "left"];
      _this.clockwise = !(anchorParams.clockwise === false);
      _this.secondBest = _this.clockwise ? clockwiseOptions : antiClockwiseOptions;
      _this.lastChoice = _this.clockwise ? antiClockwiseOptions : clockwiseOptions;
      _this._currentFace = null;
      _this._lockedFace = null;
      _this._lockedAxis = null;
      for (var i = 0; i < _this.faces.length; i++) {
        _this.availableFaces[_this.faces[i]] = true;
      }
      return _this;
    }
    _createClass(ContinuousAnchor, [{
      key: "getDefaultFace",
      value: function getDefaultFace() {
        return this.faces.length === 0 ? "top" : this.faces[0];
      }
    }, {
      key: "verifyEdge",
      value: function verifyEdge(edge) {
        if (this.availableFaces[edge]) {
          return edge;
        } else if (this.availableFaces[opposites[edge]]) {
          return opposites[edge];
        } else if (this.availableFaces[this.secondBest[edge]]) {
          return this.secondBest[edge];
        } else if (this.availableFaces[this.lastChoice[edge]]) {
          return this.lastChoice[edge];
        }
        return edge;
      }
    }, {
      key: "isEdgeSupported",
      value: function isEdgeSupported(edge) {
        return this._lockedAxis == null ? this._lockedFace == null ? this.availableFaces[edge] === true : this._lockedFace === edge : this._lockedAxis.indexOf(edge) !== -1;
      }
    }, {
      key: "setCurrentFace",
      value: function setCurrentFace(face, overrideLock) {
        this._currentFace = face;
        if (overrideLock && this._lockedFace != null) {
          this._lockedFace = this._currentFace;
        }
      }
    }, {
      key: "getCurrentFace",
      value: function getCurrentFace() {
        return this._currentFace;
      }
    }, {
      key: "getSupportedFaces",
      value: function getSupportedFaces() {
        var af = [];
        for (var k in this.availableFaces) {
          if (this.availableFaces[k]) {
            af.push(k);
          }
        }
        return af;
      }
    }, {
      key: "lock",
      value: function lock() {
        this._lockedFace = this._currentFace;
        _get(_getPrototypeOf(ContinuousAnchor.prototype), "lock", this).call(this);
      }
    }, {
      key: "unlock",
      value: function unlock() {
        this._lockedFace = null;
        _get(_getPrototypeOf(ContinuousAnchor.prototype), "unlock", this).call(this);
      }
    }, {
      key: "lockCurrentAxis",
      value: function lockCurrentAxis() {
        if (this._currentFace != null) {
          this._lockedAxis = this._currentFace === "left" || this._currentFace === "right" ? X_AXIS_FACES : Y_AXIS_FACES;
        }
      }
    }, {
      key: "unlockCurrentAxis",
      value: function unlockCurrentAxis() {
        this._lockedAxis = null;
      }
    }, {
      key: "compute",
      value: function compute(params) {
        return this.instance.router.getContinuousAnchorLocation(params.element.id);
      }
    }, {
      key: "getCurrentLocation",
      value: function getCurrentLocation(params) {
        return this.instance.router.getContinuousAnchorLocation(params.element.id);
      }
    }, {
      key: "getOrientation",
      value: function getOrientation(endpoint) {
        return this.instance.router.getContinuousAnchorOrientation(endpoint.id);
      }
    }, {
      key: "getCssClass",
      value: function getCssClass() {
        return this.cssClass;
      }
    }]);
    return ContinuousAnchor;
  }(Anchor);
  _defineProperty(ContinuousAnchor, "continuousAnchorType", "Continuous");

  var X_AXIS_FACES = ["left", "right"];
  var Y_AXIS_FACES = ["top", "bottom"];
  var AnchorLocations;
  (function (AnchorLocations) {
    AnchorLocations[AnchorLocations["Assign"] = 0] = "Assign";
    AnchorLocations[AnchorLocations["AutoDefault"] = 1] = "AutoDefault";
    AnchorLocations[AnchorLocations["Bottom"] = 2] = "Bottom";
    AnchorLocations[AnchorLocations["BottomCenter"] = 3] = "BottomCenter";
    AnchorLocations[AnchorLocations["BottomLeft"] = 4] = "BottomLeft";
    AnchorLocations[AnchorLocations["BottomRight"] = 5] = "BottomRight";
    AnchorLocations[AnchorLocations["Center"] = 6] = "Center";
    AnchorLocations[AnchorLocations["Continuous"] = 7] = "Continuous";
    AnchorLocations[AnchorLocations["ContinuousBottom"] = 8] = "ContinuousBottom";
    AnchorLocations[AnchorLocations["ContinuousLeft"] = 9] = "ContinuousLeft";
    AnchorLocations[AnchorLocations["ContinuousRight"] = 10] = "ContinuousRight";
    AnchorLocations[AnchorLocations["ContinuousTop"] = 11] = "ContinuousTop";
    AnchorLocations[AnchorLocations["ContinuousLeftRight"] = 12] = "ContinuousLeftRight";
    AnchorLocations[AnchorLocations["ContinuousTopBottom"] = 13] = "ContinuousTopBottom";
    AnchorLocations[AnchorLocations["Left"] = 14] = "Left";
    AnchorLocations[AnchorLocations["LeftMiddle"] = 15] = "LeftMiddle";
    AnchorLocations[AnchorLocations["Perimeter"] = 16] = "Perimeter";
    AnchorLocations[AnchorLocations["Right"] = 17] = "Right";
    AnchorLocations[AnchorLocations["RightMiddle"] = 18] = "RightMiddle";
    AnchorLocations[AnchorLocations["Top"] = 19] = "Top";
    AnchorLocations[AnchorLocations["TopCenter"] = 20] = "TopCenter";
    AnchorLocations[AnchorLocations["TopLeft"] = 21] = "TopLeft";
    AnchorLocations[AnchorLocations["TopRight"] = 22] = "TopRight";
  })(AnchorLocations || (AnchorLocations = {}));
  var anchorMap = {};
  var Anchors = {
    get: function get(instance, name, args) {
      var con = anchorMap[name];
      if (!con) {
        throw {
          message: "jsPlumb: unknown anchor type '" + name + "'"
        };
      } else {
        return con(instance, args || {});
      }
    }
  };
  function _makeAnchor(instance, x, y, ox, oy, offsetX, offsetY, elementId) {
    var a = new Anchor(instance);
    a.x = x;
    a.y = y;
    a.setInitialOrientation(ox, oy);
    a.offsets = [offsetX, offsetY];
    if (elementId != null) {
      a.elementId = elementId;
    }
    return a;
  }
  function getNamedAnchor(instance, name, args, elementId) {
    var a = Anchors.get(instance, name, args);
    a.elementId = elementId;
    return a;
  }
  function getAnchorWithValues(instance, x, y, orientation, offsets, elementId, cssClass) {
    var a = new Anchor(instance);
    a.x = x;
    a.y = y;
    a.setInitialOrientation(orientation[0], orientation[1]);
    a.offsets = offsets;
    a.elementId = elementId;
    a.cssClass = cssClass || "";
    return a;
  }
  function isPrimitiveAnchorSpec(sa) {
    return sa.length < 7 && sa.every(isNumber) || sa.length === 7 && sa.slice(0, 5).every(isNumber) && isString(sa[6]);
  }
  function makeAnchorFromSpec(instance, spec, elementId) {
    if (spec.compute && spec.getOrientation) {
      return spec;
    }
    if (isString(spec)) {
      return getNamedAnchor(instance, spec, null, elementId);
    } else if (isArray(spec)) {
      var sa = spec;
      if (IS.anObject(sa[1]) && sa[1].compute == null) {
        return getNamedAnchor(instance, sa[0], sa[1], elementId);
      } else {
        if (isPrimitiveAnchorSpec(sa)) {
          return getAnchorWithValues(instance, sa[0], sa[1], [sa[2], sa[3]], [sa[4] || 0, sa[5] || 0], elementId, sa[6]);
        } else {
          return new DynamicAnchor(instance, {
            anchors: sa,
            elementId: elementId
          });
        }
      }
    } else {
      throw {
        message: "jsPlumb cannot create anchor from " + spec
      };
    }
  }
  function _curryAnchor(x, y, ox, oy, type, fnInit) {
    anchorMap[type] = function (instance, params) {
      var a = _makeAnchor(instance, x, y, ox, oy, 0, 0);
      a.type = type;
      if (fnInit) {
        fnInit(a, params);
      }
      return a;
    };
  }
  _curryAnchor(0.5, 0, 0, -1, "TopCenter");
  _curryAnchor(0.5, 1, 0, 1, "BottomCenter");
  _curryAnchor(0, 0.5, -1, 0, "LeftMiddle");
  _curryAnchor(1, 0.5, 1, 0, "RightMiddle");
  _curryAnchor(0.5, 0, 0, -1, "Top");
  _curryAnchor(0.5, 1, 0, 1, "Bottom");
  _curryAnchor(0, 0.5, -1, 0, "Left");
  _curryAnchor(1, 0.5, 1, 0, "Right");
  _curryAnchor(0.5, 0.5, 0, 0, "Center");
  _curryAnchor(1, 0, 0, -1, "TopRight");
  _curryAnchor(1, 1, 0, 1, "BottomRight");
  _curryAnchor(0, 0, 0, -1, "TopLeft");
  _curryAnchor(0, 1, 0, 1, "BottomLeft");
  var DEFAULT_DYNAMIC_ANCHORS = ["TopCenter", "RightMiddle", "BottomCenter", "LeftMiddle"];
  anchorMap["AutoDefault"] = function (instance, params) {
    var a = new DynamicAnchor(instance, {
      anchors: DEFAULT_DYNAMIC_ANCHORS.map(function (da) {
        return getNamedAnchor(instance, da, params);
      })
    });
    a.type = "AutoDefault";
    return a;
  };
  function _circle(anchorCount) {
    var r = 0.5,
        step = Math.PI * 2 / anchorCount,
        current = 0,
        a = [];
    for (var i = 0; i < anchorCount; i++) {
      var x = r + r * Math.sin(current),
          y = r + r * Math.cos(current);
      a.push([x, y, 0, 0]);
      current += step;
    }
    return a;
  }
  function _path(anchorCount, segments) {
    var anchorsPerFace = anchorCount / segments.length,
        a = [],
        _computeFace = function _computeFace(x1, y1, x2, y2, fractionalLength, ox, oy) {
      anchorsPerFace = anchorCount * fractionalLength;
      var dx = (x2 - x1) / anchorsPerFace,
          dy = (y2 - y1) / anchorsPerFace;
      for (var i = 0; i < anchorsPerFace; i++) {
        a.push([x1 + dx * i, y1 + dy * i, ox == null ? 0 : ox, oy == null ? 0 : oy]);
      }
    };
    for (var i = 0; i < segments.length; i++) {
      _computeFace.apply(null, segments[i]);
    }
    return a;
  }
  function _shape(anchorCount, faces) {
    var s = [];
    for (var i = 0; i < faces.length; i++) {
      s.push([faces[i][0], faces[i][1], faces[i][2], faces[i][3], 1 / faces.length, faces[i][4], faces[i][5]]);
    }
    return _path(anchorCount, s);
  }
  function _rectangle(anchorCount) {
    return _shape(anchorCount, [[0, 0, 1, 0, 0, -1], [1, 0, 1, 1, 1, 0], [1, 1, 0, 1, 0, 1], [0, 1, 0, 0, -1, 0]]);
  }
  function _rotate(points, amountInDegrees) {
    var o = [],
        theta = amountInDegrees / 180 * Math.PI;
    for (var i = 0; i < points.length; i++) {
      var _x = points[i][0] - 0.5,
          _y = points[i][1] - 0.5;
      o.push([0.5 + (_x * Math.cos(theta) - _y * Math.sin(theta)), 0.5 + (_x * Math.sin(theta) + _y * Math.cos(theta)), points[i][2], points[i][3]]);
    }
    return o;
  }
  var _shapes = {
    "Circle": _circle,
    "Ellipse": _circle,
    "Diamond": function Diamond(anchorCount) {
      return _shape(anchorCount, [[0.5, 0, 1, 0.5], [1, 0.5, 0.5, 1], [0.5, 1, 0, 0.5], [0, 0.5, 0.5, 0]]);
    },
    "Rectangle": _rectangle,
    "Square": _rectangle,
    "Triangle": function Triangle(anchorCount) {
      return _shape(anchorCount, [[0.5, 0, 1, 1], [1, 1, 0, 1], [0, 1, 0.5, 0]]);
    },
    "Path": function Path(anchorCount, params) {
      var points = params.points,
          p = [],
          tl = 0;
      for (var i = 0; i < points.length - 1; i++) {
        var l = Math.sqrt(Math.pow(points[i][2] - points[i][0], 2) + Math.pow(points[i][3] - points[i][1], 2));
        tl += l;
        p.push([points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], l]);
      }
      for (var j = 0; j < p.length; j++) {
        p[j][4] = p[j][4] / tl;
      }
      return _path(anchorCount, p);
    }
  };
  anchorMap["Perimeter"] = function (instance, params) {
    var anchorCount = params.anchorCount || 60;
    if (!params.shape) {
      throw new Error("no shape supplied to Perimeter Anchor type");
    }
    if (!_shapes[params.shape]) {
      throw new Error("Shape [" + params.shape + "] is unknown by Perimeter Anchor type");
    }
    var da = _shapes[params.shape](anchorCount, params);
    if (params.rotation) {
      da = _rotate(da, params.rotation);
    }
    return new DynamicAnchor(instance, {
      anchors: da
    });
  };
  function _curryContinuousAnchor(type, faces) {
    anchorMap[type] = function (instance, params) {
      var o = {};
      extend(o, params || {});
      if (faces) {
        o.faces = faces;
      }
      var a = new ContinuousAnchor(instance, o);
      a.type = type;
      return a;
    };
  }
  _curryContinuousAnchor("Continuous");
  _curryContinuousAnchor("ContinuousLeft", ["left"]);
  _curryContinuousAnchor("ContinuousTop", ["top"]);
  _curryContinuousAnchor("ContinuousBottom", ["bottom"]);
  _curryContinuousAnchor("ContinuousRight", ["right"]);
  _curryContinuousAnchor("ContinuousLeft", ["left"]);
  _curryContinuousAnchor("ContinuousTop", ["top"]);
  _curryContinuousAnchor("ContinuousBottom", ["bottom"]);
  _curryContinuousAnchor("ContinuousLeftRight", ["left", "right"]);
  _curryContinuousAnchor("ContinuousTopBottom", ["top", "bottom"]);

  var TYPE_ITEM_ANCHORS = "anchors";
  var Connection =
  function (_OverlayCapableCompon) {
    _inherits(Connection, _OverlayCapableCompon);
    _createClass(Connection, [{
      key: "getIdPrefix",
      value: function getIdPrefix() {
        return "_jsPlumb_c";
      }
    }, {
      key: "getDefaultOverlayKey",
      value: function getDefaultOverlayKey() {
        return "connectionOverlays";
      }
    }, {
      key: "getXY",
      value: function getXY() {
        return {
          x: this.connector.x,
          y: this.connector.y
        };
      }
    }], [{
      key: "updateConnectedClass",
      value: function updateConnectedClass(instance, conn, element, isRemoval) {
        if (element != null) {
          element._jsPlumbConnections = element._jsPlumbConnections || {};
          if (isRemoval) {
            delete element._jsPlumbConnections[conn.id];
          } else {
            element._jsPlumbConnections[conn.id] = true;
          }
          if (isEmpty(element._jsPlumbConnections)) {
            instance.removeClass(element, conn.instance.connectedClass);
          } else {
            instance.addClass(element, conn.instance.connectedClass);
          }
        }
      }
    }]);
    function Connection(instance, params) {
      var _this;
      _classCallCheck(this, Connection);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(Connection).call(this, instance, params));
      _this.instance = instance;
      _defineProperty(_assertThisInitialized(_this), "id", void 0);
      _defineProperty(_assertThisInitialized(_this), "connector", void 0);
      _defineProperty(_assertThisInitialized(_this), "defaultLabelLocation", 0.5);
      _defineProperty(_assertThisInitialized(_this), "scope", void 0);
      _defineProperty(_assertThisInitialized(_this), "typeId", "_jsplumb_connection");
      _defineProperty(_assertThisInitialized(_this), "previousConnection", void 0);
      _defineProperty(_assertThisInitialized(_this), "sourceId", void 0);
      _defineProperty(_assertThisInitialized(_this), "targetId", void 0);
      _defineProperty(_assertThisInitialized(_this), "source", void 0);
      _defineProperty(_assertThisInitialized(_this), "target", void 0);
      _defineProperty(_assertThisInitialized(_this), "detachable", true);
      _defineProperty(_assertThisInitialized(_this), "reattach", false);
      _defineProperty(_assertThisInitialized(_this), "uuids", void 0);
      _defineProperty(_assertThisInitialized(_this), "cost", void 0);
      _defineProperty(_assertThisInitialized(_this), "directed", void 0);
      _defineProperty(_assertThisInitialized(_this), "endpoints", [null, null]);
      _defineProperty(_assertThisInitialized(_this), "endpointStyles", void 0);
      _defineProperty(_assertThisInitialized(_this), "endpointSpec", void 0);
      _defineProperty(_assertThisInitialized(_this), "endpointsSpec", void 0);
      _defineProperty(_assertThisInitialized(_this), "endpointStyle", {});
      _defineProperty(_assertThisInitialized(_this), "endpointHoverStyle", {});
      _defineProperty(_assertThisInitialized(_this), "endpointHoverStyles", void 0);
      _defineProperty(_assertThisInitialized(_this), "suspendedEndpoint", void 0);
      _defineProperty(_assertThisInitialized(_this), "suspendedIndex", void 0);
      _defineProperty(_assertThisInitialized(_this), "suspendedElement", void 0);
      _defineProperty(_assertThisInitialized(_this), "suspendedElementId", void 0);
      _defineProperty(_assertThisInitialized(_this), "suspendedElementType", void 0);
      _defineProperty(_assertThisInitialized(_this), "_forceReattach", void 0);
      _defineProperty(_assertThisInitialized(_this), "_forceDetach", void 0);
      _defineProperty(_assertThisInitialized(_this), "proxies", []);
      _defineProperty(_assertThisInitialized(_this), "pending", false);
      _defineProperty(_assertThisInitialized(_this), "anchors", [null, null]);
      _defineProperty(_assertThisInitialized(_this), "anchor", null);
      _this.id = params.id;
      _this.previousConnection = params.previousConnection;
      _this.source = params.source;
      _this.target = params.target;
      if (params.sourceEndpoint) {
        _this.source = params.sourceEndpoint.element;
        _this.sourceId = params.sourceEndpoint.elementId;
      } else {
        _this.sourceId = instance.getId(_this.source);
      }
      if (params.targetEndpoint) {
        _this.target = params.targetEndpoint.element;
        _this.targetId = params.targetEndpoint.elementId;
      } else {
        _this.targetId = instance.getId(_this.target);
      }
      _this.scope = params.scope;
      _this.anchors = params.anchors;
      _this.anchor = params.anchor;
      instance.manage(_this.source);
      instance.manage(_this.target);
      _this.visible = true;
      _this.params = {
        cssClass: params.cssClass,
        "pointer-events": params["pointer-events"],
        overlays: params.overlays
      };
      _this.lastPaintedAt = null;
      if (params.type) {
        params.endpoints = params.endpoints || _this.instance.deriveEndpointAndAnchorSpec(params.type).endpoints;
      }
      _this.endpointSpec = params.endpoint;
      _this.endpointsSpec = params.endpoints || [null, null];
      _this.endpointStyle = params.endpointStyle;
      _this.endpointHoverStyle = params.endpointHoverStyle;
      _this.endpointStyles = params.endpointStyles || [null, null];
      _this.endpointHoverStyles = params.endpointHoverStyles || [null, null];
      _this.paintStyle = params.paintStyle;
      _this.hoverPaintStyle = params.hoverPaintStyle;
      _this.uuids = params.uuids;
      var eS = _this.makeEndpoint(true, _this.source, _this.sourceId, params.sourceEndpoint),
          eT = _this.makeEndpoint(false, _this.target, _this.targetId, params.targetEndpoint);
      if (eS) {
        addToDictionary(instance.endpointsByElement, _this.sourceId, eS);
      }
      if (eT) {
        addToDictionary(instance.endpointsByElement, _this.targetId, eT);
      }
      if (!_this.scope) {
        _this.scope = _this.endpoints[0].scope;
      }
      if (params.deleteEndpointsOnEmpty != null) {
        _this.endpoints[0].deleteOnEmpty = params.deleteEndpointsOnEmpty;
        _this.endpoints[1].deleteOnEmpty = params.deleteEndpointsOnEmpty;
      }
      var _detachable = _this.instance.Defaults.connectionsDetachable;
      if (params.detachable === false) {
        _detachable = false;
      }
      if (_this.endpoints[0].connectionsDetachable === false) {
        _detachable = false;
      }
      if (_this.endpoints[1].connectionsDetachable === false) {
        _detachable = false;
      }
      _this.endpointsSpec = params.endpoints || [null, null];
      _this.endpointSpec = params.endpoint || null;
      var _reattach = params.reattach || _this.endpoints[0].reattachConnections || _this.endpoints[1].reattachConnections || _this.instance.Defaults.reattachConnections;
      _this.appendToDefaultType({
        detachable: _detachable,
        reattach: _reattach,
        paintStyle: _this.endpoints[0].connectorStyle || _this.endpoints[1].connectorStyle || params.paintStyle || _this.instance.Defaults.paintStyle,
        hoverPaintStyle: _this.endpoints[0].connectorHoverStyle || _this.endpoints[1].connectorHoverStyle || params.hoverPaintStyle || _this.instance.Defaults.hoverPaintStyle
      });
      if (!_this.instance._suspendDrawing) {
        var initialTimestamp = _this.instance._suspendedAt || uuid();
        var sourceAnchorLoc = _this.instance.computeAnchorLoc(_this.endpoints[0], initialTimestamp);
        _this.instance.paintEndpoint(_this.endpoints[0], {
          anchorLoc: sourceAnchorLoc,
          timestamp: initialTimestamp
        });
        var targetAnchorLoc = _this.instance.computeAnchorLoc(_this.endpoints[1], initialTimestamp);
        _this.instance.paintEndpoint(_this.endpoints[1], {
          anchorLoc: targetAnchorLoc,
          timestamp: initialTimestamp
        });
      }
      _this.cost = params.cost || _this.endpoints[0].connectionCost;
      _this.directed = params.directed;
      if (params.directed == null) {
        _this.directed = _this.endpoints[0].connectionsDirected;
      }
      var _p = extend({}, _this.endpoints[1].getParameters());
      extend(_p, _this.endpoints[0].getParameters());
      extend(_p, _this.getParameters());
      _this.setParameters(_p);
      _this.paintStyleInUse = _this.getPaintStyle() || {};
      _this.setConnector(_this.endpoints[0].connector || _this.endpoints[1].connector || params.connector || _this.instance.Defaults.connector, true);
      var data = params.data == null || !IS.anObject(params.data) ? {} : params.data;
      _this.setData(data);
      var _types = ["default", _this.endpoints[0].connectionType, _this.endpoints[1].connectionType, params.type].join(" ");
      if (/[^\s]/.test(_types)) {
        _this.addType(_types, params.data);
      }
      _this.updateConnectedClass(false);
      return _this;
    }
    _createClass(Connection, [{
      key: "makeEndpoint",
      value: function makeEndpoint(isSource, el, elId, ep) {
        elId = elId || this.instance.getId(el);
        return Connection.prepareEndpoint(this, ep, isSource ? 0 : 1, el, elId);
      }
    }, {
      key: "getTypeDescriptor",
      value: function getTypeDescriptor() {
        return "connection";
      }
    }, {
      key: "isDetachable",
      value: function isDetachable(ep) {
        return this.detachable === false ? false : ep != null ? ep.connectionsDetachable === true : this.detachable === true;
      }
    }, {
      key: "setDetachable",
      value: function setDetachable(detachable) {
        this.detachable = detachable === true;
      }
    }, {
      key: "isReattach",
      value: function isReattach() {
        return this.reattach === true || this.endpoints[0].reattachConnections === true || this.endpoints[1].reattachConnections === true;
      }
    }, {
      key: "setReattach",
      value: function setReattach(reattach) {
        this.reattach = reattach === true;
      }
    }, {
      key: "applyType",
      value: function applyType(t, typeMap) {
        var _connector = null;
        if (t.connector != null) {
          _connector = this.getCachedTypeItem("connector", typeMap.connector);
          if (_connector == null) {
            _connector = this.prepareConnector(t.connector, typeMap.connector);
            this.cacheTypeItem("connector", _connector, typeMap.connector);
          }
          this.setPreparedConnector(_connector);
        }
        _get(_getPrototypeOf(Connection.prototype), "applyType", this).call(this, t, typeMap);
        if (t.detachable != null) {
          this.setDetachable(t.detachable);
        }
        if (t.reattach != null) {
          this.setReattach(t.reattach);
        }
        if (t.scope) {
          this.scope = t.scope;
        }
        var _anchors = null;
        if (t.anchor) {
          _anchors = this.getCachedTypeItem(TYPE_ITEM_ANCHORS, typeMap.anchor);
          if (_anchors == null) {
            _anchors = [makeAnchorFromSpec(this.instance, t.anchor, this.sourceId), makeAnchorFromSpec(this.instance, t.anchor, this.targetId)];
            this.cacheTypeItem(TYPE_ITEM_ANCHORS, _anchors, typeMap.anchor);
          }
        } else if (t.anchors) {
          _anchors = this.getCachedTypeItem(TYPE_ITEM_ANCHORS, typeMap.anchors);
          if (_anchors == null) {
            _anchors = [makeAnchorFromSpec(this.instance, t.anchors[0], this.sourceId), makeAnchorFromSpec(this.instance, t.anchors[1], this.targetId)];
            this.cacheTypeItem(TYPE_ITEM_ANCHORS, _anchors, typeMap.anchors);
          }
        }
        if (_anchors != null) {
          this.endpoints[0].anchor = _anchors[0];
          this.endpoints[1].anchor = _anchors[1];
          if (this.endpoints[1].anchor.isDynamic) {
            this.instance.repaint(this.endpoints[1].element);
          }
        }
        this.instance.applyConnectorType(this.connector, t);
      }
    }, {
      key: "addClass",
      value: function addClass(c, informEndpoints) {
        _get(_getPrototypeOf(Connection.prototype), "addClass", this).call(this, c);
        if (informEndpoints) {
          this.endpoints[0].addClass(c);
          this.endpoints[1].addClass(c);
          if (this.suspendedEndpoint) {
            this.suspendedEndpoint.addClass(c);
          }
        }
        if (this.connector) {
          this.instance.addConnectorClass(this.connector, c);
        }
      }
    }, {
      key: "removeClass",
      value: function removeClass(c, informEndpoints) {
        _get(_getPrototypeOf(Connection.prototype), "removeClass", this).call(this, c);
        if (informEndpoints) {
          this.endpoints[0].removeClass(c);
          this.endpoints[1].removeClass(c);
          if (this.suspendedEndpoint) {
            this.suspendedEndpoint.removeClass(c);
          }
        }
        if (this.connector) {
          this.instance.removeConnectorClass(this.connector, c);
        }
      }
    }, {
      key: "setVisible",
      value: function setVisible(v) {
        _get(_getPrototypeOf(Connection.prototype), "setVisible", this).call(this, v);
        if (this.connector) {
          this.instance.setConnectorVisible(this.connector, v);
        }
        this.instance.paintConnection(this);
      }
    }, {
      key: "destroy",
      value: function destroy(force) {
        this.updateConnectedClass(true);
        this.endpoints = null;
        this.source = null;
        this.target = null;
        this.instance.destroyConnection(this);
        this.connector = null;
        _get(_getPrototypeOf(Connection.prototype), "destroy", this).call(this, force);
      }
    }, {
      key: "updateConnectedClass",
      value: function updateConnectedClass(isRemoval) {
        Connection.updateConnectedClass(this.instance, this, this.source, isRemoval);
        Connection.updateConnectedClass(this.instance, this, this.target, isRemoval);
      }
    }, {
      key: "getUuids",
      value: function getUuids() {
        return [this.endpoints[0].getUuid(), this.endpoints[1].getUuid()];
      }
    }, {
      key: "getCost",
      value: function getCost() {
        return this.cost == null ? 1 : this.cost;
      }
    }, {
      key: "setCost",
      value: function setCost(c) {
        this.cost = c;
      }
    }, {
      key: "isDirected",
      value: function isDirected() {
        return this.directed;
      }
    }, {
      key: "getConnector",
      value: function getConnector() {
        return this.connector;
      }
    }, {
      key: "makeConnector",
      value: function makeConnector(name, args) {
        return Connectors.get(this.instance, this, name, args);
      }
    }, {
      key: "prepareConnector",
      value: function prepareConnector(connectorSpec, typeId) {
        var connectorArgs = {
          cssClass: this.params.cssClass,
          container: this.params.container,
          "pointer-events": this.params["pointer-events"]
        },
            connector;
        if (isString(connectorSpec)) {
          connector = this.makeConnector(connectorSpec, connectorArgs);
        }
        else if (isArray(connectorSpec)) {
            if (connectorSpec.length === 1) {
              connector = this.makeConnector(connectorSpec[0], connectorArgs);
            } else {
              connector = this.makeConnector(connectorSpec[0], merge(connectorSpec[1], connectorArgs));
            }
          }
        if (typeId != null) {
          connector.typeId = typeId;
        }
        return connector;
      }
    }, {
      key: "setPreparedConnector",
      value: function setPreparedConnector(connector, doNotRepaint, doNotChangeListenerComponent, typeId) {
        if (this.connector !== connector) {
          var previous,
              previousClasses = "";
          if (this.connector != null) {
            previous = this.connector;
            previousClasses = this.instance.getConnectorClass(this.connector);
            this.instance.destroyConnection(this);
          }
          this.connector = connector;
          if (typeId) {
            this.cacheTypeItem("connector", connector, typeId);
          }
          this.addClass(previousClasses);
          if (previous != null) {
            var o = this.getOverlays();
            for (var i in o) {
              this.instance.reattachOverlay(o[i], this);
            }
          }
          if (!doNotRepaint) {
            this.instance.paintConnection(this);
          }
        }
      }
    }, {
      key: "setConnector",
      value: function setConnector(connectorSpec, doNotRepaint, doNotChangeListenerComponent, typeId) {
        var connector = this.prepareConnector(connectorSpec, typeId);
        this.setPreparedConnector(connector, doNotRepaint, doNotChangeListenerComponent, typeId);
      }
    }, {
      key: "replaceEndpoint",
      value: function replaceEndpoint(idx, endpointDef) {
        var current = this.endpoints[idx],
            elId = current.elementId,
            ebe = this.instance.getEndpoints(current.element),
            _idx = ebe.indexOf(current),
            _new = Connection.prepareEndpoint(this, null, idx, current.element, elId, endpointDef);
        this.endpoints[idx] = _new;
        ebe.splice(_idx, 1, _new);
        current.detachFromConnection(this);
        this.instance.deleteEndpoint(current);
        this.instance.fire(EVENT_ENDPOINT_REPLACED, {
          previous: current,
          current: _new
        });
        this.updateConnectedClass(false);
      }
    }], [{
      key: "prepareEndpoint",
      value: function prepareEndpoint(conn, existing, index, element, elementId, endpoint) {
        var e;
        if (existing) {
          conn.endpoints[index] = existing;
          existing.addConnection(conn);
        } else {
          var ep = endpoint || conn.endpointSpec || conn.endpointsSpec[index] || conn.instance.Defaults.endpoints[index] || conn.instance.Defaults.endpoint;
          var es = conn.endpointStyles[index] || conn.endpointStyle || conn.instance.Defaults.endpointStyles[index] || conn.instance.Defaults.endpointStyle;
          if (es.fill == null && conn.paintStyle != null) {
            es.fill = conn.paintStyle.stroke;
          }
          if (es.outlineStroke == null && conn.paintStyle != null) {
            es.outlineStroke = conn.paintStyle.outlineStroke;
          }
          if (es.outlineWidth == null && conn.paintStyle != null) {
            es.outlineWidth = conn.paintStyle.outlineWidth;
          }
          var ehs = conn.endpointHoverStyles[index] || conn.endpointHoverStyle || conn.endpointHoverStyle || conn.instance.Defaults.endpointHoverStyles[index] || conn.instance.Defaults.endpointHoverStyle;
          if (conn.hoverPaintStyle != null) {
            if (ehs == null) {
              ehs = {};
            }
            if (ehs.fill == null) {
              ehs.fill = conn.hoverPaintStyle.stroke;
            }
          }
          var a = conn.anchors ? conn.anchors[index] : conn.anchor ? conn.anchor : Connection._makeAnchor(conn.instance, conn.instance.Defaults.anchors[index], elementId) || Connection._makeAnchor(conn.instance, conn.instance.Defaults.anchor, elementId),
              u = conn.uuids ? conn.uuids[index] : null;
          e = conn.instance.newEndpoint({
            paintStyle: es,
            hoverPaintStyle: ehs,
            endpoint: ep,
            connections: [conn],
            uuid: u,
            anchor: a,
            source: element,
            scope: conn.scope,
            reattach: conn.reattach || conn.instance.Defaults.reattachConnections,
            detachable: conn.detachable || conn.instance.Defaults.connectionsDetachable
          });
          if (existing == null) {
            e.deleteOnEmpty = true;
          }
          conn.endpoints[index] = e;
        }
        return e;
      }
    }, {
      key: "_makeAnchor",
      value: function _makeAnchor(instance, spec, elementId) {
        return spec != null ? makeAnchorFromSpec(instance, spec, elementId) : null;
      }
    }]);
    return Connection;
  }(OverlayCapableComponent);

  var typeParameters = ["connectorStyle", "connectorHoverStyle", "connectorOverlays", "connector", "connectionType", "connectorClass", "connectorHoverClass"];
  var Endpoint =
  function (_OverlayCapableCompon) {
    _inherits(Endpoint, _OverlayCapableCompon);
    _createClass(Endpoint, [{
      key: "getIdPrefix",
      value: function getIdPrefix() {
        return "_jsplumb_e";
      }
    }, {
      key: "getTypeDescriptor",
      value: function getTypeDescriptor() {
        return "endpoint";
      }
    }, {
      key: "getXY",
      value: function getXY() {
        return {
          x: this.endpoint.x,
          y: this.endpoint.y
        };
      }
    }, {
      key: "getDefaultOverlayKey",
      value: function getDefaultOverlayKey() {
        return "endpointOverlays";
      }
    }]);
    function Endpoint(instance, params) {
      var _this;
      _classCallCheck(this, Endpoint);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(Endpoint).call(this, instance, params));
      _this.instance = instance;
      _defineProperty(_assertThisInitialized(_this), "connections", []);
      _defineProperty(_assertThisInitialized(_this), "anchor", void 0);
      _defineProperty(_assertThisInitialized(_this), "endpoint", void 0);
      _defineProperty(_assertThisInitialized(_this), "element", void 0);
      _defineProperty(_assertThisInitialized(_this), "elementId", void 0);
      _defineProperty(_assertThisInitialized(_this), "dragAllowedWhenFull", true);
      _defineProperty(_assertThisInitialized(_this), "timestamp", void 0);
      _defineProperty(_assertThisInitialized(_this), "portId", void 0);
      _defineProperty(_assertThisInitialized(_this), "maxConnections", void 0);
      _defineProperty(_assertThisInitialized(_this), "connectorClass", void 0);
      _defineProperty(_assertThisInitialized(_this), "connectorHoverClass", void 0);
      _defineProperty(_assertThisInitialized(_this), "finalEndpoint", void 0);
      _defineProperty(_assertThisInitialized(_this), "enabled", true);
      _defineProperty(_assertThisInitialized(_this), "isSource", void 0);
      _defineProperty(_assertThisInitialized(_this), "isTarget", void 0);
      _defineProperty(_assertThisInitialized(_this), "isTemporarySource", void 0);
      _defineProperty(_assertThisInitialized(_this), "connectionCost", 1);
      _defineProperty(_assertThisInitialized(_this), "connectionsDirected", void 0);
      _defineProperty(_assertThisInitialized(_this), "connectionsDetachable", void 0);
      _defineProperty(_assertThisInitialized(_this), "reattachConnections", void 0);
      _defineProperty(_assertThisInitialized(_this), "currentAnchorClass", void 0);
      _defineProperty(_assertThisInitialized(_this), "referenceEndpoint", void 0);
      _defineProperty(_assertThisInitialized(_this), "connectionType", void 0);
      _defineProperty(_assertThisInitialized(_this), "connector", void 0);
      _defineProperty(_assertThisInitialized(_this), "connectorOverlays", void 0);
      _defineProperty(_assertThisInitialized(_this), "connectorStyle", void 0);
      _defineProperty(_assertThisInitialized(_this), "connectorHoverStyle", void 0);
      _defineProperty(_assertThisInitialized(_this), "dragProxy", void 0);
      _defineProperty(_assertThisInitialized(_this), "deleteOnEmpty", void 0);
      _defineProperty(_assertThisInitialized(_this), "uuid", void 0);
      _defineProperty(_assertThisInitialized(_this), "scope", void 0);
      _defineProperty(_assertThisInitialized(_this), "defaultLabelLocation", [0.5, 0.5]);
      _this.appendToDefaultType({
        connectionType: params.connectionType,
        maxConnections: params.maxConnections == null ? _this.instance.Defaults.maxConnections : params.maxConnections,
        paintStyle: params.paintStyle || _this.instance.Defaults.endpointStyle,
        hoverPaintStyle: params.hoverPaintStyle || _this.instance.Defaults.endpointHoverStyle,
        connectorStyle: params.connectorStyle,
        connectorHoverStyle: params.connectorHoverStyle,
        connectorClass: params.connectorClass,
        connectorHoverClass: params.connectorHoverClass,
        connectorOverlays: params.connectorOverlays,
        connector: params.connector,
        connectorTooltip: params.connectorTooltip
      });
      _this.enabled = !(params.enabled === false);
      _this.visible = true;
      _this.element = params.source;
      _this.uuid = params.uuid;
      _this.portId = params.portId;
      _this.elementId = params.elementId;
      _this.dragProxy = params.dragProxy;
      _this.connectionCost = params.connectionCost == null ? 1 : params.connectionCost;
      _this.connectionsDirected = params.connectionsDirected;
      _this.currentAnchorClass = "";
      _this.events = {};
      _this.connectorOverlays = params.connectorOverlays;
      _this.connectionsDetachable = params.connectionsDetachable;
      _this.reattachConnections = params.reattachConnections;
      _this.connectorStyle = params.connectorStyle;
      _this.connectorHoverStyle = params.connectorHoverStyle;
      _this.connector = params.connector;
      _this.connectionType = params.connectionType;
      _this.connectorClass = params.connectorClass;
      _this.connectorHoverClass = params.connectorHoverClass;
      _this.deleteOnEmpty = params.deleteOnEmpty === true;
      if (!params._transient) {
        _this.instance.router.addEndpoint(_assertThisInitialized(_this), _this.elementId);
      }
      extend(_assertThisInitialized(_this), params, typeParameters);
      _this.isSource = params.isSource || false;
      _this.isTemporarySource = params.isTemporarySource || false;
      _this.isTarget = params.isTarget || false;
      _this.connections = params.connections || [];
      _this.scope = params.scope || instance.defaultScope;
      _this.timestamp = null;
      _this.reattachConnections = params.reattach || instance.Defaults.reattachConnections;
      _this.connectionsDetachable = instance.Defaults.connectionsDetachable;
      if (params.connectionsDetachable === false || params.detachable === false) {
        _this.connectionsDetachable = false;
      }
      _this.dragAllowedWhenFull = params.dragAllowedWhenFull !== false;
      if (params.onMaxConnections) {
        _this.bind("maxConnections", params.onMaxConnections);
      }
      var ep = params.endpoint || instance.Defaults.endpoint;
      _this.setEndpoint(ep);
      var anchorParamsToUse = params.anchor ? params.anchor : params.anchors ? params.anchors : instance.Defaults.anchor || "Top";
      _this.setAnchor(anchorParamsToUse);
      var type = ["default", params.type || ""].join(" ");
      _this.addType(type, params.data);
      return _this;
    }
    _createClass(Endpoint, [{
      key: "_updateAnchorClass",
      value: function _updateAnchorClass() {
        var ac = this.anchor.getCssClass();
        if (ac != null && ac.length > 0) {
          var oldAnchorClass = this.instance.endpointAnchorClassPrefix + "-" + this.currentAnchorClass;
          this.currentAnchorClass = ac;
          var anchorClass = this.instance.endpointAnchorClassPrefix + (this.currentAnchorClass ? "-" + this.currentAnchorClass : "");
          if (oldAnchorClass !== anchorClass) {
            this.removeClass(oldAnchorClass);
            this.addClass(anchorClass);
            this.instance.removeClass(this.element, oldAnchorClass);
            this.instance.addClass(this.element, anchorClass);
          }
        }
      }
    }, {
      key: "prepareAnchor",
      value: function prepareAnchor(anchorParams) {
        var _this2 = this;
        var a = makeAnchorFromSpec(this.instance, anchorParams, this.elementId);
        a.bind("anchorChanged", function (currentAnchor) {
          _this2.fire("anchorChanged", {
            endpoint: _this2,
            anchor: currentAnchor
          });
          _this2._updateAnchorClass();
        });
        return a;
      }
    }, {
      key: "setPreparedAnchor",
      value: function setPreparedAnchor(anchor) {
        this.instance.router.clearContinuousAnchorPlacement(this.elementId);
        this.anchor = anchor;
        this._updateAnchorClass();
        return this;
      }
    }, {
      key: "setAnchor",
      value: function setAnchor(anchorParams) {
        var a = this.prepareAnchor(anchorParams);
        this.setPreparedAnchor(a);
        return this;
      }
    }, {
      key: "addConnection",
      value: function addConnection(conn) {
        var wasFull = this.isFull();
        this.connections.push(conn);
        this[(this.connections.length > 0 ? "add" : "remove") + "Class"](this.instance.endpointConnectedClass);
        if (this.isFull()) {
          if (!wasFull) {
            this.addClass(this.instance.endpointFullClass);
          }
        } else if (wasFull) {
          this.removeClass(this.instance.endpointFullClass);
        }
      }
    }, {
      key: "detachFromConnection",
      value: function detachFromConnection(connection, idx, transientDetach) {
        idx = idx == null ? this.connections.indexOf(connection) : idx;
        if (idx >= 0) {
          this.connections.splice(idx, 1);
          this.instance.refreshEndpoint(this);
        }
        if (!transientDetach && this.deleteOnEmpty && this.connections.length === 0) {
          this.instance.deleteEndpoint(this);
        }
      }
    }, {
      key: "deleteEveryConnection",
      value: function deleteEveryConnection(params) {
        var c = this.connections.length;
        for (var i = 0; i < c; i++) {
          this.instance.deleteConnection(this.connections[0], params);
        }
      }
    }, {
      key: "detachFrom",
      value: function detachFrom(targetEndpoint) {
        var c = [];
        for (var i = 0; i < this.connections.length; i++) {
          if (this.connections[i].endpoints[1] === targetEndpoint || this.connections[i].endpoints[0] === targetEndpoint) {
            c.push(this.connections[i]);
          }
        }
        for (var j = 0, count = c.length; j < count; j++) {
          this.instance.deleteConnection(c[0]);
        }
        return this;
      }
    }, {
      key: "setVisible",
      value: function setVisible(v, doNotChangeConnections, doNotNotifyOtherEndpoint) {
        _get(_getPrototypeOf(Endpoint.prototype), "setVisible", this).call(this, v);
        this.endpoint.setVisible(v);
        this[v ? "showOverlays" : "hideOverlays"]();
        if (!doNotChangeConnections) {
          for (var i = 0; i < this.connections.length; i++) {
            this.connections[i].setVisible(v);
            if (!doNotNotifyOtherEndpoint) {
              var oIdx = this === this.connections[i].endpoints[0] ? 1 : 0;
              if (this.connections[i].endpoints[oIdx].connections.length === 1) {
                this.connections[i].endpoints[oIdx].setVisible(v, true, true);
              }
            }
          }
        }
      }
    }, {
      key: "applyType",
      value: function applyType(t, typeMap) {
        _get(_getPrototypeOf(Endpoint.prototype), "applyType", this).call(this, t, typeMap);
        this.setPaintStyle(t.endpointStyle || t.paintStyle);
        this.setHoverPaintStyle(t.endpointHoverStyle || t.hoverPaintStyle);
        this.connectorStyle = t.connectorStyle;
        this.connectorHoverStyle = t.connectorHoverStyle;
        this.connector = t.connector;
        this.connectorOverlays = t.connectorOverlays;
        this.connectionType = t.connectionType;
        if (t.maxConnections != null) {
          this.maxConnections = t.maxConnections;
        }
        if (t.scope) {
          this.scope = t.scope;
        }
        extend(t, typeParameters);
        this.instance.applyEndpointType(this, t);
      }
    }, {
      key: "destroy",
      value: function destroy(force) {
        var anchorClass = this.instance.endpointAnchorClassPrefix + (this.currentAnchorClass ? "-" + this.currentAnchorClass : "");
        this.instance.removeClass(this.element, anchorClass);
        this.anchor = null;
        if (this.endpoint != null) {
          this.instance.destroyEndpoint(this);
        }
        _get(_getPrototypeOf(Endpoint.prototype), "destroy", this).call(this, force);
      }
    }, {
      key: "isFull",
      value: function isFull() {
        return this.maxConnections === 0 ? true : !(this.isFloating() || this.maxConnections < 0 || this.connections.length < this.maxConnections);
      }
    }, {
      key: "isFloating",
      value: function isFloating() {
        return this.anchor != null && this.anchor.isFloating;
      }
    }, {
      key: "isConnectedTo",
      value: function isConnectedTo(endpoint) {
        var found = false;
        if (endpoint) {
          for (var i = 0; i < this.connections.length; i++) {
            if (this.connections[i].endpoints[1] === endpoint || this.connections[i].endpoints[0] === endpoint) {
              found = true;
              break;
            }
          }
        }
        return found;
      }
    }, {
      key: "setElementId",
      value: function setElementId(_elId) {
        this.elementId = _elId;
        this.anchor.elementId = _elId;
      }
    }, {
      key: "setDragAllowedWhenFull",
      value: function setDragAllowedWhenFull(allowed) {
        this.dragAllowedWhenFull = allowed;
      }
    }, {
      key: "equals",
      value: function equals(endpoint) {
        return this.anchor.equals(endpoint.anchor);
      }
    }, {
      key: "getUuid",
      value: function getUuid() {
        return this.uuid;
      }
    }, {
      key: "connectorSelector",
      value: function connectorSelector() {
        return this.connections[0];
      }
    }, {
      key: "prepareEndpoint",
      value: function prepareEndpoint(ep, typeId) {
        var _this3 = this;
        var endpointArgs = {
          _jsPlumb: this.instance,
          cssClass: this.cssClass,
          endpoint: this
        };
        var endpoint;
        if (isString(ep)) {
          endpoint = EndpointFactory.get(this, ep, endpointArgs);
        } else if (isArray(ep)) {
          endpointArgs = merge(ep[1], endpointArgs);
          endpoint = EndpointFactory.get(this, ep[0], endpointArgs);
        } else if (ep instanceof EndpointRepresentation) {
          endpoint = ep.clone();
        }
        endpoint.clone = function () {
          if (isString(ep)) {
            return EndpointFactory.get(_this3, ep, endpointArgs);
          } else if (isArray(ep)) {
            endpointArgs = merge(ep[1], endpointArgs);
            return EndpointFactory.get(_this3, ep[0], endpointArgs);
          } else if (ep instanceof EndpointRepresentation) {
            return ep.clone();
          }
        };
        endpoint.typeId = typeId;
        return endpoint;
      }
    }, {
      key: "setEndpoint",
      value: function setEndpoint(ep) {
        var _ep = this.prepareEndpoint(ep);
        this.setPreparedEndpoint(_ep);
      }
    }, {
      key: "setPreparedEndpoint",
      value: function setPreparedEndpoint(ep) {
        if (this.endpoint != null) {
          this.instance.destroyEndpoint(this);
        }
        this.endpoint = ep;
      }
    }, {
      key: "addClass",
      value: function addClass(clazz, dontUpdateOverlays) {
        _get(_getPrototypeOf(Endpoint.prototype), "addClass", this).call(this, clazz, dontUpdateOverlays);
        if (this.endpoint != null) {
          this.endpoint.addClass(clazz);
        }
      }
    }, {
      key: "removeClass",
      value: function removeClass(clazz, dontUpdateOverlays) {
        _get(_getPrototypeOf(Endpoint.prototype), "removeClass", this).call(this, clazz, dontUpdateOverlays);
        if (this.endpoint != null) {
          this.endpoint.removeClass(clazz);
        }
      }
    }]);
    return Endpoint;
  }(OverlayCapableComponent);

  var UINode = function UINode(instance, el) {
    _classCallCheck(this, UINode);
    this.instance = instance;
    this.el = el;
    _defineProperty(this, "group", void 0);
  };
  var UIGroup =
  function (_UINode) {
    _inherits(UIGroup, _UINode);
    function UIGroup(instance, el, options) {
      var _this;
      _classCallCheck(this, UIGroup);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(UIGroup).call(this, instance, el));
      _this.instance = instance;
      _defineProperty(_assertThisInitialized(_this), "children", []);
      _defineProperty(_assertThisInitialized(_this), "childGroups", []);
      _defineProperty(_assertThisInitialized(_this), "collapsed", false);
      _defineProperty(_assertThisInitialized(_this), "droppable", void 0);
      _defineProperty(_assertThisInitialized(_this), "enabled", void 0);
      _defineProperty(_assertThisInitialized(_this), "orphan", void 0);
      _defineProperty(_assertThisInitialized(_this), "constrain", void 0);
      _defineProperty(_assertThisInitialized(_this), "proxied", void 0);
      _defineProperty(_assertThisInitialized(_this), "ghost", void 0);
      _defineProperty(_assertThisInitialized(_this), "revert", void 0);
      _defineProperty(_assertThisInitialized(_this), "prune", void 0);
      _defineProperty(_assertThisInitialized(_this), "dropOverride", void 0);
      _defineProperty(_assertThisInitialized(_this), "anchor", void 0);
      _defineProperty(_assertThisInitialized(_this), "endpoint", void 0);
      _defineProperty(_assertThisInitialized(_this), "connections", {
        source: [],
        target: [],
        internal: []
      });
      _defineProperty(_assertThisInitialized(_this), "groups", []);
      _defineProperty(_assertThisInitialized(_this), "manager", void 0);
      _defineProperty(_assertThisInitialized(_this), "id", void 0);
      _this.el[IS_GROUP_KEY] = true;
      _this.el[GROUP_KEY] = _assertThisInitialized(_this);
      _this.revert = options.revert !== false;
      _this.droppable = options.droppable !== false;
      _this.ghost = options.ghost === true;
      _this.enabled = options.enabled !== false;
      _this.orphan = options.orphan === true;
      _this.prune = options.prune === true;
      _this.constrain = _this.ghost || options.constrain === true;
      _this.proxied = options.proxied !== false;
      _this.id = options.id || uuid();
      _this.dropOverride = options.dropOverride === true;
      _this.anchor = options.anchor;
      _this.endpoint = options.endpoint;
      _this.anchor = options.anchor;
      instance.setAttribute(el, ATTRIBUTE_GROUP, "");
      return _this;
    }
    _createClass(UIGroup, [{
      key: "overrideDrop",
      value: function overrideDrop(el, targetGroup) {
        return this.dropOverride && (this.revert || this.prune || this.orphan);
      }
    }, {
      key: "getContentArea",
      value: function getContentArea() {
        var da = this.instance.getSelector(this.el, SELECTOR_GROUP_CONTAINER);
        return da && da.length > 0 ? da[0] : this.el;
      }
    }, {
      key: "getAnchor",
      value: function getAnchor(conn, endpointIndex) {
        return this.anchor || ContinuousAnchor.continuousAnchorType;
      }
    }, {
      key: "getEndpoint",
      value: function getEndpoint(conn, endpointIndex) {
        return this.endpoint || [DotEndpoint.dotEndpointType, {
          radius: 10
        }];
      }
    }, {
      key: "add",
      value: function add(_el, doNotFireEvent) {
        var _this2 = this;
        var dragArea = this.getContentArea();
        this.instance.each(_el, function (__el) {
          if (__el[PARENT_GROUP_KEY] != null) {
            if (__el[PARENT_GROUP_KEY] === _this2) {
              return;
            } else {
              __el[PARENT_GROUP_KEY].remove(__el, true, doNotFireEvent, false);
            }
          }
          __el[PARENT_GROUP_KEY] = _this2;
          _this2.children.push(__el);
          _this2.manager.instance.appendElement(__el, dragArea);
        });
        this.manager._updateConnectionsForGroup(this);
      }
    }, {
      key: "remove",
      value: function remove(el, manipulateDOM, doNotFireEvent, doNotUpdateConnections, targetGroup) {
        var _this3 = this;
        this.instance.each(el, function (__el) {
          delete __el[PARENT_GROUP_KEY];
          removeWithFunction(_this3.children, function (e) {
            return e === __el;
          });
          if (manipulateDOM) {
            try {
              _this3.getContentArea().removeChild(__el);
            } catch (e) {
              log("Could not remove element from Group " + e);
            }
          }
          if (!doNotFireEvent) {
            var p = {
              group: _this3,
              el: __el
            };
            if (targetGroup) {
              p.targetGroup = targetGroup;
            }
            _this3.manager.instance.fire(EVENT_GROUP_MEMBER_REMOVED, p);
          }
        });
        if (!doNotUpdateConnections) {
          this.manager._updateConnectionsForGroup(this);
        }
      }
    }, {
      key: "removeAll",
      value: function removeAll(manipulateDOM, doNotFireEvent) {
        for (var i = 0, l = this.children.length; i < l; i++) {
          var _el2 = this.children[0];
          this.remove(_el2, manipulateDOM, doNotFireEvent, true);
          this.manager.instance.removeElement(_el2);
        }
        this.children.length = 0;
        this.manager._updateConnectionsForGroup(this);
      }
    }, {
      key: "orphanAll",
      value: function orphanAll() {
        var orphanedPositions = {};
        for (var i = 0; i < this.children.length; i++) {
          var newPosition = this.manager.orphan(this.children[i]);
          orphanedPositions[newPosition[0]] = newPosition[1];
        }
        this.children.length = 0;
        for (var _i = 0; _i < this.childGroups.length; _i++) {
          var _newPosition = this.manager.orphan(this.childGroups[_i].el);
          orphanedPositions[_newPosition[0]] = _newPosition[1];
        }
        this.childGroups.length = 0;
        return orphanedPositions;
      }
    }, {
      key: "addGroup",
      value: function addGroup(group) {
        if (this.instance.allowNestedGroups && group !== this) {
          if (this.instance.groupManager.isAncestor(this, group)) {
            return false;
          }
          if (group.group != null) {
            group.group.removeGroup(group);
          }
          var elpos = this.instance.getOffset(group.el, true);
          var cpos = this.collapsed ? this.instance.getOffset(this.el, true) : this.instance.getOffset(this.getContentArea(), true);
          group.el[PARENT_GROUP_KEY] = this;
          this.childGroups.push(group);
          this.instance.appendElement(group.el, this.getContentArea());
          group.group = this;
          var newPosition = {
            left: elpos.left - cpos.left,
            top: elpos.top - cpos.top
          };
          this.instance.setPosition(group.el, newPosition);
          this.instance.fire(EVENT_NESTED_GROUP_ADDED, {
            parent: this,
            child: group
          });
          return true;
        } else {
          return false;
        }
      }
    }, {
      key: "removeGroup",
      value: function removeGroup(group) {
        if (group.group === this) {
          var d = this.getContentArea();
          if (d === group.el.parentNode) {
            d.removeChild(group.el);
          }
          this.childGroups = this.childGroups.filter(function (cg) {
            return cg.id !== group.id;
          });
          delete group.group;
          delete group.el._jsPlumbParentGroup;
          this.instance.fire(EVENT_NESTED_GROUP_REMOVED, {
            parent: this,
            child: group
          });
        }
      }
    }, {
      key: "getGroups",
      value: function getGroups() {
        return this.childGroups;
      }
    }, {
      key: "collapseParent",
      get: function get() {
        var cg = null;
        if (this.group == null) {
          return null;
        } else {
          var g = this.group;
          while (g != null) {
            if (g.collapsed) {
              cg = g;
            }
            g = g.group;
          }
          return cg;
        }
      }
    }]);
    return UIGroup;
  }(UINode);

  var GroupManager =
  function () {
    function GroupManager(instance) {
      var _this = this;
      _classCallCheck(this, GroupManager);
      this.instance = instance;
      _defineProperty(this, "groupMap", {});
      _defineProperty(this, "_connectionSourceMap", {});
      _defineProperty(this, "_connectionTargetMap", {});
      instance.bind(EVENT_CONNECTION, function (p) {
        var sourceGroup = _this.getGroupFor(p.source);
        var targetGroup = _this.getGroupFor(p.target);
        if (sourceGroup != null && targetGroup != null && sourceGroup === targetGroup) {
          _this._connectionSourceMap[p.connection.id] = sourceGroup;
          _this._connectionTargetMap[p.connection.id] = sourceGroup;
          suggest(sourceGroup.connections.internal, p.connection);
        } else {
          if (sourceGroup != null) {
            if (p.target._jsPlumbGroup === sourceGroup) {
              suggest(sourceGroup.connections.internal, p.connection);
            } else {
              suggest(sourceGroup.connections.source, p.connection);
            }
            _this._connectionSourceMap[p.connection.id] = sourceGroup;
          }
          if (targetGroup != null) {
            if (p.source._jsPlumbGroup === targetGroup) {
              suggest(targetGroup.connections.internal, p.connection);
            } else {
              suggest(targetGroup.connections.target, p.connection);
            }
            _this._connectionTargetMap[p.connection.id] = targetGroup;
          }
        }
      });
      instance.bind(EVENT_INTERNAL_CONNECTION_DETACHED, function (p) {
        _this._cleanupDetachedConnection(p.connection);
      });
      instance.bind(EVENT_CONNECTION_MOVED, function (p) {
        var originalEndpoint = p.index === 0 ? p.originalSourceEndpoint : p.originalTargetEndpoint,
            originalElement = originalEndpoint.element,
            originalGroup = _this.getGroupFor(originalElement),
            newEndpoint = p.index === 0 ? p.newSourceEndpoint : p.newTargetEndpoint,
            newElement = newEndpoint.element,
            newGroup = _this.getGroupFor(newElement),
            connMap = p.index === 0 ? _this._connectionSourceMap : _this._connectionTargetMap,
            otherConnMap = p.index === 0 ? _this._connectionTargetMap : _this._connectionSourceMap;
        if (newGroup != null) {
          connMap[p.connection.id] = newGroup;
          if (p.connection.source === p.connection.target) {
            otherConnMap[p.connection.id] = newGroup;
          }
        } else {
          delete connMap[p.connection.id];
          if (p.connection.source === p.connection.target) {
            delete otherConnMap[p.connection.id];
          }
        }
        if (originalGroup != null) {
          _this._updateConnectionsForGroup(originalGroup);
        }
        if (newGroup != null) {
          _this._updateConnectionsForGroup(newGroup);
        }
      });
    }
    _createClass(GroupManager, [{
      key: "_cleanupDetachedConnection",
      value: function _cleanupDetachedConnection(conn) {
        conn.proxies.length = 0;
        var group = this._connectionSourceMap[conn.id],
            f;
        if (group != null) {
          f = function f(c) {
            return c.id === conn.id;
          };
          removeWithFunction(group.connections.source, f);
          removeWithFunction(group.connections.target, f);
          removeWithFunction(group.connections.internal, f);
          delete this._connectionSourceMap[conn.id];
        }
        group = this._connectionTargetMap[conn.id];
        if (group != null) {
          f = function f(c) {
            return c.id === conn.id;
          };
          removeWithFunction(group.connections.source, f);
          removeWithFunction(group.connections.target, f);
          removeWithFunction(group.connections.internal, f);
          delete this._connectionTargetMap[conn.id];
        }
      }
    }, {
      key: "addGroup",
      value: function addGroup(params) {
        if (this.groupMap[params.id] != null) {
          throw new Error("cannot create Group [" + params.id + "]; a Group with that ID exists");
        }
        if (params.el[IS_GROUP_KEY] != null) {
          throw new Error("cannot create Group [" + params.id + "]; the given element is already a Group");
        }
        var group = new UIGroup(this.instance, params.el, params);
        this.groupMap[group.id] = group;
        if (params.collapsed) {
          this.collapseGroup(group);
        }
        this.instance.manage(group.el);
        this.instance.addClass(group.el, CLASS_GROUP_EXPANDED);
        group.manager = this;
        this._updateConnectionsForGroup(group);
        this.instance.fire(EVENT_GROUP_ADDED, {
          group: group
        });
        return group;
      }
    }, {
      key: "getGroup",
      value: function getGroup(groupId) {
        var group = groupId;
        if (IS.aString(groupId)) {
          group = this.groupMap[groupId];
          if (group == null) {
            throw new Error("No such group [" + groupId + "]");
          }
        }
        return group;
      }
    }, {
      key: "getGroupFor",
      value: function getGroupFor(el) {
        var jel = el;
        var c = this.instance.getContainer();
        var abort = false,
            g = null;
        while (!abort) {
          if (jel == null || jel === c) {
            abort = true;
          } else {
            if (jel._jsPlumbParentGroup) {
              g = jel._jsPlumbParentGroup;
              abort = true;
            } else {
              jel = jel.parentNode;
            }
          }
        }
        return g;
      }
    }, {
      key: "getGroups",
      value: function getGroups() {
        var g = [];
        for (var key in this.groupMap) {
          g.push(this.groupMap[key]);
        }
        return g;
      }
    }, {
      key: "removeGroup",
      value: function removeGroup(group, deleteMembers, manipulateView, doNotFireEvent) {
        var _this2 = this;
        var actualGroup = this.getGroup(group);
        this.expandGroup(actualGroup, true);
        var newPositions = {};
        if (deleteMembers) {
          actualGroup.childGroups.forEach(function (cg) {
            return _this2.removeGroup(cg, deleteMembers, manipulateView);
          });
          actualGroup.removeAll(manipulateView, doNotFireEvent);
        } else {
          if (actualGroup.group) {
            actualGroup.children.forEach(function (c) {
              return actualGroup.group.add(c);
            });
          }
          newPositions = actualGroup.orphanAll();
        }
        if (actualGroup.group) {
          actualGroup.group.removeGroup(actualGroup);
        } else {
          this.instance.unmanage(actualGroup.el, true);
        }
        delete this.groupMap[actualGroup.id];
        this.instance.fire(EVENT_GROUP_REMOVED, {
          group: actualGroup
        });
        return newPositions;
      }
    }, {
      key: "removeAllGroups",
      value: function removeAllGroups(deleteMembers, manipulateView, doNotFireEvent) {
        for (var _g in this.groupMap) {
          this.removeGroup(this.groupMap[_g], deleteMembers, manipulateView, doNotFireEvent);
        }
      }
    }, {
      key: "forEach",
      value: function forEach(f) {
        for (var key in this.groupMap) {
          f(this.groupMap[key]);
        }
      }
    }, {
      key: "orphan",
      value: function orphan(el) {
        var jel = el;
        if (jel._jsPlumbParentGroup) {
          var group = jel._jsPlumbParentGroup;
          var groupPos = this.instance.getOffset(jel);
          var id = this.instance.getId(jel);
          var pos = this.instance.getOffset(el);
          jel.parentNode.removeChild(jel);
          if (group.group) {
            pos.left += groupPos.left;
            pos.top += groupPos.top;
            group.group.getContentArea().appendChild(el);
          } else {
            this.instance.appendElement(el, this.instance.getContainer());
          }
          this.instance.setPosition(el, pos);
          delete jel._jsPlumbParentGroup;
          return [id, pos];
        }
      }
    }, {
      key: "_setGroupVisible",
      value: function _setGroupVisible(group, state) {
        var m = group.el.querySelectorAll(SELECTOR_MANAGED_ELEMENT);
        for (var i = 0; i < m.length; i++) {
          this.instance[state ? CMD_SHOW : CMD_HIDE](m[i], true);
        }
      }
    }, {
      key: "_updateConnectionsForGroup",
      value: function _updateConnectionsForGroup(group) {
        var _this3 = this;
        group.connections.source.length = 0;
        group.connections.target.length = 0;
        group.connections.internal.length = 0;
        var members = group.children.slice();
        var childMembers = [];
        members.forEach(function (member) {
          return childMembers.push.apply(childMembers, _toConsumableArray(member.querySelectorAll("[jtk-managed]")));
        });
        members.push.apply(members, childMembers);
        if (members.length > 0) {
          var c1 = this.instance.getConnections({
            source: members,
            scope: WILDCARD
          }, true);
          var c2 = this.instance.getConnections({
            target: members,
            scope: WILDCARD
          }, true);
          var processed = {};
          var gs, gt;
          var oneSet = function oneSet(c) {
            for (var i = 0; i < c.length; i++) {
              if (processed[c[i].id]) {
                continue;
              }
              processed[c[i].id] = true;
              gs = _this3.getGroupFor(c[i].source);
              gt = _this3.getGroupFor(c[i].target);
              if (c[i].source === group.el && gt === group || c[i].target === group.el && gs === group) {
                group.connections.internal.push(c[i]);
              } else if (gs === group) {
                if (gt !== group) {
                  group.connections.source.push(c[i]);
                } else {
                  group.connections.internal.push(c[i]);
                }
                _this3._connectionSourceMap[c[i].id] = group;
              } else if (gt === group) {
                group.connections.target.push(c[i]);
                _this3._connectionTargetMap[c[i].id] = group;
              }
            }
          };
          oneSet(c1);
          oneSet(c2);
        }
      }
    }, {
      key: "_collapseConnection",
      value: function _collapseConnection(conn, index, group) {
        var otherEl = conn.endpoints[index === 0 ? 1 : 0].element;
        if (otherEl[PARENT_GROUP_KEY] && !otherEl[PARENT_GROUP_KEY].proxied && otherEl[PARENT_GROUP_KEY].collapsed) {
          return false;
        }
        var es = conn.endpoints[0].element,
            esg = es[PARENT_GROUP_KEY],
            esgcp = esg != null ? esg.collapseParent || esg : null,
            et = conn.endpoints[1].element,
            etg = et[PARENT_GROUP_KEY],
            etgcp = etg != null ? etg.collapseParent || etg : null;
        if (esgcp == null || etgcp == null || esgcp.id !== etgcp.id) {
          var groupEl = group.el,
              groupElId = this.instance.getId(groupEl);
          this.instance.proxyConnection(conn, index, groupEl, groupElId, function (conn, index) {
            return group.getEndpoint(conn, index);
          }, function (conn, index) {
            return group.getAnchor(conn, index);
          });
          return true;
        } else {
          return false;
        }
      }
    }, {
      key: "_expandConnection",
      value: function _expandConnection(c, index, group) {
        this.instance.unproxyConnection(c, index, this.instance.getId(group.el));
      }
    }, {
      key: "isElementDescendant",
      value: function isElementDescendant(el, parentEl) {
        var c = this.instance.getContainer();
        var abort = false;
        while (!abort) {
          if (el == null || el === c) {
            return false;
          } else {
            if (el === parentEl) {
              return true;
            } else {
              el = el.parentNode;
            }
          }
        }
      }
    }, {
      key: "collapseGroup",
      value: function collapseGroup(group) {
        var _this4 = this;
        var actualGroup = this.getGroup(group);
        if (actualGroup == null || actualGroup.collapsed) {
          return;
        }
        var groupEl = actualGroup.el;
        if (actualGroup.collapseParent == null) {
          this._setGroupVisible(actualGroup, false);
          actualGroup.collapsed = true;
          if (actualGroup.proxied) {
            this.instance.removeClass(groupEl, CLASS_GROUP_EXPANDED);
            this.instance.addClass(groupEl, CLASS_GROUP_COLLAPSED);
            var collapsedConnectionIds = new Set();
            var _collapseSet = function _collapseSet(conns, index) {
              for (var i = 0; i < conns.length; i++) {
                var c = conns[i];
                if (_this4._collapseConnection(c, index, actualGroup) === true) {
                  collapsedConnectionIds.add(c.id);
                }
              }
            };
            _collapseSet(actualGroup.connections.source, 0);
            _collapseSet(actualGroup.connections.target, 1);
            actualGroup.childGroups.forEach(function (cg) {
              _this4.cascadeCollapse(actualGroup, cg, collapsedConnectionIds);
            });
          }
          this.instance.revalidate(groupEl);
          this.repaintGroup(actualGroup);
          this.instance.fire(EVENT_COLLAPSE, {
            group: actualGroup
          });
        } else {
          actualGroup.collapsed = true;
          this.instance.removeClass(groupEl, CLASS_GROUP_EXPANDED);
          this.instance.addClass(groupEl, CLASS_GROUP_COLLAPSED);
        }
      }
    }, {
      key: "cascadeCollapse",
      value: function cascadeCollapse(collapsedGroup, targetGroup, collapsedIds) {
        var _this5 = this;
        if (collapsedGroup.proxied) {
          var _collapseSet = function _collapseSet(conns, index) {
            for (var i = 0; i < conns.length; i++) {
              var c = conns[i];
              if (!collapsedIds.has(c.id)) {
                if (_this5._collapseConnection(c, index, collapsedGroup) === true) {
                  collapsedIds.add(c.id);
                }
              }
            }
          };
          _collapseSet(targetGroup.connections.source, 0);
          _collapseSet(targetGroup.connections.target, 1);
        }
        targetGroup.childGroups.forEach(function (cg) {
          _this5.cascadeCollapse(collapsedGroup, cg, collapsedIds);
        });
      }
    }, {
      key: "expandGroup",
      value: function expandGroup(group, doNotFireEvent) {
        var _this6 = this;
        var actualGroup = this.getGroup(group);
        if (actualGroup == null
        ) {
            return;
          }
        var groupEl = actualGroup.el;
        if (actualGroup.collapseParent == null) {
          this._setGroupVisible(actualGroup, true);
          actualGroup.collapsed = false;
          if (actualGroup.proxied) {
            this.instance.addClass(groupEl, CLASS_GROUP_EXPANDED);
            this.instance.removeClass(groupEl, CLASS_GROUP_COLLAPSED);
            var _expandSet = function _expandSet(conns, index) {
              for (var i = 0; i < conns.length; i++) {
                var c = conns[i];
                _this6._expandConnection(c, index, actualGroup);
              }
            };
            _expandSet(actualGroup.connections.source, 0);
            _expandSet(actualGroup.connections.target, 1);
            var _expandNestedGroup = function _expandNestedGroup(group) {
              if (group.collapsed) {
                var _collapseSet = function _collapseSet(conns, index) {
                  for (var i = 0; i < conns.length; i++) {
                    var c = conns[i];
                    _this6._collapseConnection(c, index, group.collapseParent || group);
                  }
                };
                _collapseSet(group.connections.source, 0);
                _collapseSet(group.connections.target, 1);
                group.connections.internal.forEach(function (c) {
                  return c.setVisible(false);
                });
                group.childGroups.forEach(_expandNestedGroup);
              } else {
                _this6.expandGroup(group, doNotFireEvent);
              }
            };
            actualGroup.childGroups.forEach(_expandNestedGroup);
          }
          this.instance.revalidate(groupEl);
          this.repaintGroup(actualGroup);
          if (!doNotFireEvent) {
            this.instance.fire(EVENT_EXPAND, {
              group: group
            });
          }
        } else {
          actualGroup.collapsed = false;
          this.instance.addClass(groupEl, CLASS_GROUP_EXPANDED);
          this.instance.removeClass(groupEl, CLASS_GROUP_COLLAPSED);
        }
      }
    }, {
      key: "cascadeExpand",
      value: function cascadeExpand(expandedGroup, targetGroup) {
        var _this7 = this;
        if (expandedGroup.proxied) {
          var _expandSet = function _expandSet(conns, index) {
            for (var i = 0; i < conns.length; i++) {
              var c = conns[i];
              if (targetGroup.collapsed) {
                _this7._collapseConnection(c, index, targetGroup);
              } else {
                _this7._expandConnection(c, index, expandedGroup);
              }
            }
          };
          _expandSet(targetGroup.connections.source, 0);
          _expandSet(targetGroup.connections.target, 1);
        }
        this.instance.revalidate(targetGroup.el);
        this.repaintGroup(targetGroup.el);
        this.instance.fire(EVENT_EXPAND, {
          group: targetGroup.el
        });
        targetGroup.childGroups.forEach(function (cg) {
          _this7.cascadeExpand(expandedGroup, cg);
        });
      }
    }, {
      key: "toggleGroup",
      value: function toggleGroup(group) {
        group = this.getGroup(group);
        if (group != null) {
          if (group.collapsed) {
            this.expandGroup(group);
          } else {
            this.collapseGroup(group);
          }
        }
      }
    }, {
      key: "repaintGroup",
      value: function repaintGroup(group) {
        var actualGroup = this.getGroup(group);
        var m = actualGroup.children;
        for (var i = 0; i < m.length; i++) {
          this.instance.revalidate(m[i]);
        }
      }
    }, {
      key: "addToGroup",
      value: function addToGroup(group, doNotFireEvent) {
        var _this8 = this;
        var actualGroup = this.getGroup(group);
        if (actualGroup) {
          var groupEl = actualGroup.el;
          var _one = function _one(el) {
            var isGroup = el[IS_GROUP_KEY] != null,
                droppingGroup = el[GROUP_KEY];
            var currentGroup = el[PARENT_GROUP_KEY];
            if (currentGroup !== actualGroup) {
              var elpos = _this8.instance.getOffset(el);
              var cpos = actualGroup.collapsed ? _this8.instance.getOffset(groupEl, true) : _this8.instance.getOffset(actualGroup.getContentArea());
              if (currentGroup != null) {
                currentGroup.remove(el, false, doNotFireEvent, false, actualGroup);
                _this8._updateConnectionsForGroup(currentGroup);
              }
              if (isGroup) {
                actualGroup.addGroup(droppingGroup);
              } else {
                actualGroup.add(el, doNotFireEvent);
              }
              var handleDroppedConnections = function handleDroppedConnections(list, index) {
                var oidx = index === 0 ? 1 : 0;
                list.each(function (c) {
                  c.setVisible(false);
                  if (c.endpoints[oidx].element[GROUP_KEY] === actualGroup) {
                    c.endpoints[oidx].setVisible(false);
                    _this8._expandConnection(c, oidx, actualGroup);
                  } else {
                    c.endpoints[index].setVisible(false);
                    _this8._collapseConnection(c, index, actualGroup);
                  }
                });
              };
              if (actualGroup.collapsed) {
                handleDroppedConnections(_this8.instance.select({
                  source: el
                }), 0);
                handleDroppedConnections(_this8.instance.select({
                  target: el
                }), 1);
              }
              var elId = _this8.instance.getId(el);
              var newPosition = {
                left: elpos.left - cpos.left,
                top: elpos.top - cpos.top
              };
              _this8.instance.setPosition(el, newPosition);
              _this8._updateConnectionsForGroup(actualGroup);
              _this8.instance.revalidate(el);
              if (!doNotFireEvent) {
                var p = {
                  group: actualGroup,
                  el: el,
                  pos: newPosition
                };
                if (currentGroup) {
                  p.sourceGroup = currentGroup;
                }
                _this8.instance.fire(EVENT_GROUP_MEMBER_ADDED, p);
              }
            }
          };
          for (var _len = arguments.length, el = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            el[_key - 2] = arguments[_key];
          }
          el.forEach(_one);
        }
      }
    }, {
      key: "removeFromGroup",
      value: function removeFromGroup(group, doNotFireEvent) {
        var _this9 = this;
        var actualGroup = this.getGroup(group);
        if (actualGroup) {
          var _one = function _one(_el) {
            if (actualGroup.collapsed) {
              var _expandSet = function _expandSet(conns, index) {
                for (var i = 0; i < conns.length; i++) {
                  var c = conns[i];
                  if (c.proxies) {
                    for (var j = 0; j < c.proxies.length; j++) {
                      if (c.proxies[j] != null) {
                        var proxiedElement = c.proxies[j].originalEp.element;
                        if (proxiedElement === _el || _this9.isElementDescendant(proxiedElement, _el)) {
                          _this9._expandConnection(c, index, actualGroup);
                        }
                      }
                    }
                  }
                }
              };
              _expandSet(actualGroup.connections.source.slice(), 0);
              _expandSet(actualGroup.connections.target.slice(), 1);
            }
            actualGroup.remove(_el, null, doNotFireEvent);
          };
          for (var _len2 = arguments.length, el = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
            el[_key2 - 2] = arguments[_key2];
          }
          el.forEach(_one);
        }
      }
    }, {
      key: "getAncestors",
      value: function getAncestors(group) {
        var ancestors = [];
        var p = group.group;
        while (p != null) {
          ancestors.push(p);
          p = p.group;
        }
        return ancestors;
      }
    }, {
      key: "isAncestor",
      value: function isAncestor(group, possibleAncestor) {
        if (group == null || possibleAncestor == null) {
          return false;
        }
        return this.getAncestors(group).indexOf(possibleAncestor) !== -1;
      }
    }, {
      key: "getDescendants",
      value: function getDescendants(group) {
        var d = [];
        var _one = function _one(g) {
          d.push.apply(d, _toConsumableArray(g.childGroups));
          g.childGroups.forEach(_one);
        };
        _one(group);
        return d;
      }
    }, {
      key: "isDescendant",
      value: function isDescendant(possibleDescendant, ancestor) {
        if (possibleDescendant == null || ancestor == null) {
          return false;
        }
        return this.getDescendants(ancestor).indexOf(possibleDescendant) !== -1;
      }
    }, {
      key: "reset",
      value: function reset() {
        this._connectionSourceMap = {};
        this._connectionTargetMap = {};
        this.groupMap = {};
      }
    }]);
    return GroupManager;
  }();

  function placeAnchorsOnLine(element, connections, horizontal, otherMultiplier, reverse) {
    var sizeInAxis = horizontal ? element.w : element.h;
    var sizeInOtherAxis = horizontal ? element.h : element.w;
    var a = [],
        step = sizeInAxis / (connections.length + 1);
    for (var i = 0; i < connections.length; i++) {
      var val = (i + 1) * step,
          other = otherMultiplier * sizeInOtherAxis;
      if (reverse) {
        val = sizeInAxis - val;
      }
      var dx = horizontal ? val : other,
          x = element.x + dx,
          xp = dx / element.w;
      var dy = horizontal ? other : val,
          y = element.y + dy,
          yp = dy / element.h;
      if (element.r !== 0 && element.r != null) {
        var rotated = rotatePoint([x, y], element.c, element.r);
        x = rotated[0];
        y = rotated[1];
      }
      a.push([x, y, xp, yp, connections[i][1], connections[i][2]]);
    }
    return a;
  }
  function rightAndBottomSort(a, b) {
    return b[0][0] - a[0][0];
  }
  function leftAndTopSort(a, b) {
    var p1 = a[0][0] < 0 ? -Math.PI - a[0][0] : Math.PI - a[0][0],
        p2 = b[0][0] < 0 ? -Math.PI - b[0][0] : Math.PI - b[0][0];
    return p1 - p2;
  }
  var edgeSortFunctions = {
    "top": leftAndTopSort,
    "right": rightAndBottomSort,
    "bottom": rightAndBottomSort,
    "left": leftAndTopSort
  };
  var DefaultRouter =
  function () {
    function DefaultRouter(instance) {
      var _this = this;
      _classCallCheck(this, DefaultRouter);
      this.instance = instance;
      _defineProperty(this, "continuousAnchorLocations", {});
      _defineProperty(this, "continuousAnchorOrientations", {});
      _defineProperty(this, "anchorLists", {});
      instance.bind(EVENT_INTERNAL_CONNECTION_DETACHED, function (p) {
        _this.removeEndpointFromAnchorLists(p.sourceEndpoint);
        _this.removeEndpointFromAnchorLists(p.targetEndpoint);
      });
    }
    _createClass(DefaultRouter, [{
      key: "reset",
      value: function reset() {
        this.anchorLists = {};
      }
    }, {
      key: "getEndpointLocation",
      value: function getEndpointLocation(endpoint, params) {
        return endpoint.anchor.getCurrentLocation(params);
      }
    }, {
      key: "getContinuousAnchorLocation",
      value: function getContinuousAnchorLocation(elementId) {
        return this.continuousAnchorLocations[elementId] || [0, 0, 0, 0];
      }
    }, {
      key: "getContinuousAnchorOrientation",
      value: function getContinuousAnchorOrientation(endpointId) {
        return this.continuousAnchorOrientations[endpointId] || [0, 0];
      }
    }, {
      key: "addEndpoint",
      value: function addEndpoint(endpoint, elementId) {
      }
    }, {
      key: "elementRemoved",
      value: function elementRemoved(id) {
      }
    }, {
      key: "computePath",
      value: function computePath(connection, timestamp) {
        var sourceInfo = this.instance.viewport.getPosition(connection.sourceId),
        sourceOffset = {
          left: sourceInfo.x,
          top: sourceInfo.y
        },
            targetInfo = this.instance.viewport.getPosition(connection.targetId),
            targetOffset = {
          left: targetInfo.x,
          top: targetInfo.y
        },
            sE = connection.endpoints[0],
            tE = connection.endpoints[1];
        var sAnchorP = this.getEndpointLocation(sE, {
          xy: [sourceInfo.x, sourceInfo.y],
          wh: [sourceInfo.w, sourceInfo.h],
          element: sE,
          timestamp: timestamp,
          rotation: sourceInfo.r
        }),
            tAnchorP = this.getEndpointLocation(tE, {
          xy: [targetInfo.x, targetInfo.y],
          wh: [targetInfo.w, targetInfo.h],
          element: tE,
          timestamp: timestamp,
          rotation: targetInfo.r
        });
        connection.connector.resetBounds();
        connection.connector.compute({
          sourcePos: sAnchorP,
          targetPos: tAnchorP,
          sourceOrientation: sE.anchor.getOrientation(sE),
          targetOrientation: tE.anchor.getOrientation(tE),
          sourceEndpoint: connection.endpoints[0],
          targetEndpoint: connection.endpoints[1],
          strokeWidth: connection.paintStyleInUse.strokeWidth,
          sourceInfo: sourceOffset,
          targetInfo: targetOffset
        });
      }
    }, {
      key: "placeAnchors",
      value: function placeAnchors(instance, elementId, _anchorLists) {
        var _this2 = this;
        var cd = instance.viewport.getPosition(elementId),
            placeSomeAnchors = function placeSomeAnchors(desc, element, unsortedConnections, isHorizontal, otherMultiplier, orientation) {
          if (unsortedConnections.length > 0) {
            var sc = sortHelper(unsortedConnections, edgeSortFunctions[desc]),
            reverse = desc === "right" || desc === "top",
                anchors = placeAnchorsOnLine(cd, sc, isHorizontal, otherMultiplier, reverse);
            var _setAnchorLocation = function _setAnchorLocation(endpoint, anchorPos) {
              _this2.continuousAnchorLocations[endpoint.id] = [anchorPos[0], anchorPos[1], anchorPos[2], anchorPos[3]];
              _this2.continuousAnchorOrientations[endpoint.id] = orientation;
            };
            for (var i = 0; i < anchors.length; i++) {
              var c = anchors[i][4],
                  weAreSource = c.endpoints[0].elementId === elementId,
                  weAreTarget = c.endpoints[1].elementId === elementId;
              if (weAreSource) {
                _setAnchorLocation(c.endpoints[0], anchors[i]);
              }
              if (weAreTarget) {
                _setAnchorLocation(c.endpoints[1], anchors[i]);
              }
            }
          }
        };
        placeSomeAnchors("bottom", cd, _anchorLists.bottom, true, 1, [0, 1]);
        placeSomeAnchors("top", cd, _anchorLists.top, true, 0, [0, -1]);
        placeSomeAnchors("left", cd, _anchorLists.left, false, 0, [-1, 0]);
        placeSomeAnchors("right", cd, _anchorLists.right, false, 1, [1, 0]);
      }
    }, {
      key: "clearContinuousAnchorPlacement",
      value: function clearContinuousAnchorPlacement(endpointId) {
        delete this.continuousAnchorLocations[endpointId];
      }
    }, {
      key: "removeEndpointFromAnchorLists",
      value: function removeEndpointFromAnchorLists(endpoint) {
        var listsForElement = this.anchorLists[endpoint.elementId];
        var total = 0;
        (function (list, eId) {
          if (list) {
            var f = function f(e) {
              return e[4] === eId;
            };
            removeWithFunction(list.top, f);
            removeWithFunction(list.left, f);
            removeWithFunction(list.bottom, f);
            removeWithFunction(list.right, f);
            total += list.top.length;
            total += list.left.length;
            total += list.bottom.length;
            total += list.right.length;
          }
        })(listsForElement, endpoint.id);
        if (total === 0) {
          delete this.anchorLists[endpoint.elementId];
        }
      }
    }, {
      key: "_updateAnchorList",
      value: function _updateAnchorList(lists, theta, order, conn, aBoolean, otherElId, idx, reverse, edgeId, connsToPaint, endpointsToPaint) {
        var endpoint = conn.endpoints[idx],
            endpointId = endpoint.id,
            oIdx = [1, 0][idx],
            values = [[theta, order], conn, aBoolean, otherElId, endpointId],
            listToAddTo = lists[edgeId],
            listToRemoveFrom = endpoint._continuousAnchorEdge ? lists[endpoint._continuousAnchorEdge] : null,
            candidate;
        if (listToRemoveFrom) {
          var rIdx = findWithFunction(listToRemoveFrom, function (e) {
            return e[4] === endpointId;
          });
          if (rIdx !== -1) {
            listToRemoveFrom.splice(rIdx, 1);
            for (var i = 0; i < listToRemoveFrom.length; i++) {
              candidate = listToRemoveFrom[i][1];
              connsToPaint.add(candidate);
              endpointsToPaint.add(listToRemoveFrom[i][1].endpoints[idx]);
              endpointsToPaint.add(listToRemoveFrom[i][1].endpoints[oIdx]);
            }
          }
        }
        for (var _i = 0; _i < listToAddTo.length; _i++) {
          candidate = listToAddTo[_i][1];
          connsToPaint.add(candidate);
          endpointsToPaint.add(listToAddTo[_i][1].endpoints[idx]);
          endpointsToPaint.add(listToAddTo[_i][1].endpoints[oIdx]);
        }
        {
          var insertIdx = reverse ?  0 : listToAddTo.length;
          listToAddTo.splice(insertIdx, 0, values);
        }
        endpoint._continuousAnchorEdge = edgeId;
      }
    }, {
      key: "redraw",
      value: function redraw(elementId, ui, timestamp, offsetToUI) {
        var connectionsToPaint = new Set(),
            endpointsToPaint = new Set(),
            anchorsToUpdate = new Set();
        if (!this.instance._suspendDrawing) {
          var ep = this.instance.endpointsByElement[elementId] || [];
          timestamp = timestamp || uuid();
          offsetToUI = offsetToUI || {
            left: 0,
            top: 0
          };
          var offsetToUse = null;
          if (ui) {
            offsetToUse = {
              left: ui.x + offsetToUI.left,
              top: ui.y + offsetToUI.top
            };
          }
          var orientationCache = {};
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;
          try {
            for (var _iterator = ep[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var anEndpoint = _step.value;
              endpointsToPaint.add(anEndpoint);
              if (anEndpoint.connections.length === 0) {
                if (anEndpoint.anchor.isContinuous) {
                  if (!this.anchorLists[elementId]) {
                    this.anchorLists[elementId] = {
                      top: [],
                      right: [],
                      bottom: [],
                      left: []
                    };
                  }
                  this._updateAnchorList(this.anchorLists[elementId], -Math.PI / 2, 0, {
                    endpoints: [anEndpoint, anEndpoint]
                  }, false, elementId, 0, false, anEndpoint.anchor.getDefaultFace(), connectionsToPaint, endpointsToPaint);
                  anchorsToUpdate.add(elementId);
                }
              } else {
                for (var i = 0; i < anEndpoint.connections.length; i++) {
                  var conn = anEndpoint.connections[i],
                      sourceId = conn.sourceId,
                      targetId = conn.targetId,
                      sourceContinuous = conn.endpoints[0].anchor.isContinuous,
                      targetContinuous = conn.endpoints[1].anchor.isContinuous;
                  if (sourceContinuous || targetContinuous) {
                    var oKey = sourceId + "_" + targetId,
                        o = orientationCache[oKey],
                        oIdx = conn.sourceId === elementId ? 1 : 0;
                    if (sourceContinuous && !this.anchorLists[sourceId]) {
                      this.anchorLists[sourceId] = {
                        top: [],
                        right: [],
                        bottom: [],
                        left: []
                      };
                    }
                    if (targetContinuous && !this.anchorLists[targetId]) {
                      this.anchorLists[targetId] = {
                        top: [],
                        right: [],
                        bottom: [],
                        left: []
                      };
                    }
                    var td = this.instance.viewport.getPosition(targetId),
                        sd = this.instance.viewport.getPosition(sourceId);
                    if (targetId === sourceId && (sourceContinuous || targetContinuous)) {
                      this._updateAnchorList(this.anchorLists[sourceId], -Math.PI / 2, 0, conn, false, targetId, 0, false, "top", connectionsToPaint, endpointsToPaint);
                      this._updateAnchorList(this.anchorLists[targetId], -Math.PI / 2, 0, conn, false, sourceId, 1, false, "top", connectionsToPaint, endpointsToPaint);
                    } else {
                      var sourceRotation = this.instance.getRotation(sourceId);
                      var targetRotation = this.instance.getRotation(targetId);
                      if (!o) {
                        o = this.calculateOrientation(sourceId, targetId, sd, td, conn.endpoints[0].anchor, conn.endpoints[1].anchor, sourceRotation, targetRotation);
                        orientationCache[oKey] = o;
                      }
                      if (sourceContinuous) {
                        this._updateAnchorList(this.anchorLists[sourceId], o.theta, 0, conn, false, targetId, 0, false, o.a[0], connectionsToPaint, endpointsToPaint);
                      }
                      if (targetContinuous) {
                        this._updateAnchorList(this.anchorLists[targetId], o.theta2, -1, conn, true, sourceId, 1, true, o.a[1], connectionsToPaint, endpointsToPaint);
                      }
                    }
                    if (sourceContinuous) {
                      anchorsToUpdate.add(sourceId);
                    }
                    if (targetContinuous) {
                      anchorsToUpdate.add(targetId);
                    }
                    connectionsToPaint.add(conn);
                    if (sourceContinuous && oIdx === 0 || targetContinuous && oIdx === 1) {
                      endpointsToPaint.add(conn.endpoints[oIdx]);
                    }
                  } else {
                    var otherEndpoint = anEndpoint.connections[i].endpoints[conn.sourceId === elementId ? 1 : 0];
                    if (otherEndpoint.anchor.constructor === DynamicAnchor) {
                      this.instance.paintEndpoint(otherEndpoint, {
                        elementWithPrecedence: elementId,
                        timestamp: timestamp
                      });
                      connectionsToPaint.add(anEndpoint.connections[i]);
                      for (var k = 0; k < otherEndpoint.connections.length; k++) {
                        if (otherEndpoint.connections[k] !== anEndpoint.connections[i]) {
                          connectionsToPaint.add(otherEndpoint.connections[k]);
                        }
                      }
                    } else {
                      connectionsToPaint.add(anEndpoint.connections[i]);
                    }
                  }
                }
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;
          try {
            for (var _iterator2 = anchorsToUpdate[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var anchor = _step2.value;
              this.placeAnchors(this.instance, anchor, this.anchorLists[anchor]);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                _iterator2["return"]();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;
          try {
            for (var _iterator3 = endpointsToPaint[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var _ep = _step3.value;
              var cd = this.instance.viewport.getPosition(_ep.elementId);
              this.instance.paintEndpoint(_ep, {
                timestamp: timestamp,
                offset: cd
              });
            }
          } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
                _iterator3["return"]();
              }
            } finally {
              if (_didIteratorError3) {
                throw _iteratorError3;
              }
            }
          }
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;
          try {
            for (var _iterator4 = connectionsToPaint[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var c = _step4.value;
              this.instance.paintConnection(c, {
                elId: elementId,
                timestamp: timestamp,
                recalc: false
              });
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
                _iterator4["return"]();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        }
        return {
          c: connectionsToPaint,
          e: endpointsToPaint
        };
      }
    }, {
      key: "calculateOrientation",
      value: function calculateOrientation(sourceId, targetId, sd, td, sourceAnchor, targetAnchor, sourceRotation, targetRotation) {
        var Orientation = {
          HORIZONTAL: "horizontal",
          VERTICAL: "vertical",
          DIAGONAL: "diagonal",
          IDENTITY: "identity"
        };
        if (sourceId === targetId) {
          return {
            orientation: Orientation.IDENTITY,
            a: ["top", "top"]
          };
        }
        var theta = Math.atan2(td.c[1] - sd.c[1], td.c[0] - sd.c[0]),
            theta2 = Math.atan2(sd.c[1] - td.c[1], sd.c[0] - td.c[0]);
        var candidates = [],
            midpoints = {};
        (function (types, dim) {
          for (var i = 0; i < types.length; i++) {
            midpoints[types[i]] = {
              "left": {
                x: dim[i][0].x,
                y: dim[i][0].c[1]
              },
              "right": {
                x: dim[i][0].x + dim[i][0].w,
                y: dim[i][0].c[1]
              },
              "top": {
                x: dim[i][0].c[0],
                y: dim[i][0].y
              },
              "bottom": {
                x: dim[i][0].c[0],
                y: dim[i][0].y + dim[i][0].h
              }
            };
            if (dim[i][1] !== 0) {
              for (var axis in midpoints[types[i]]) {
                midpoints[types[i]][axis] = rotatePointXY(midpoints[types[i]][axis], {
                  x: dim[i][0].c[0],
                  y: dim[i][0].c[1]
                }, dim[i][1]);
              }
            }
          }
        })(["source", "target"], [[sd, sourceRotation], [td, targetRotation]]);
        var FACES = ["top", "right", "left", "bottom"];
        for (var sf = 0; sf < FACES.length; sf++) {
          for (var tf = 0; tf < FACES.length; tf++) {
            candidates.push({
              source: FACES[sf],
              target: FACES[tf],
              dist: this.instance.geometry.lineLength(midpoints.source[FACES[sf]], midpoints.target[FACES[tf]])
            });
          }
        }
        candidates.sort(function (a, b) {
          if (a.dist < b.dist) {
            return -1;
          } else if (b.dist < a.dist) {
            return 1;
          } else {
            var axisIndices = {
              "left": 0,
              "top": 1,
              "right": 2,
              "bottom": 3
            },
                ais = axisIndices[a.source],
                bis = axisIndices[b.source],
                ait = axisIndices[a.target],
                bit = axisIndices[b.target];
            return ais < bis ? -1 : bis < ais ? 1 : ait < bit ? -1 : bit < ait ? 1 : 0;
          }
        });
        var sourceEdge = candidates[0].source,
            targetEdge = candidates[0].target;
        for (var i = 0; i < candidates.length; i++) {
          if (sourceAnchor.isContinuous && sourceAnchor.locked) {
            sourceEdge = sourceAnchor.getCurrentFace();
          } else if (!sourceAnchor.isContinuous || sourceAnchor.isEdgeSupported(candidates[i].source)) {
            sourceEdge = candidates[i].source;
          } else {
            sourceEdge = null;
          }
          if (targetAnchor.isContinuous && targetAnchor.locked) {
            targetEdge = targetAnchor.getCurrentFace();
          } else if (!targetAnchor.isContinuous || targetAnchor.isEdgeSupported(candidates[i].target)) {
            targetEdge = candidates[i].target;
          } else {
            targetEdge = null;
          }
          if (sourceEdge != null && targetEdge != null) {
            break;
          }
        }
        if (sourceAnchor.isContinuous) {
          sourceAnchor.setCurrentFace(sourceEdge);
        }
        if (targetAnchor.isContinuous) {
          targetAnchor.setCurrentFace(targetEdge);
        }
        return {
          a: [sourceEdge, targetEdge],
          theta: theta,
          theta2: theta2
        };
      }
    }]);
    return DefaultRouter;
  }();

  var SelectionBase =
  function () {
    function SelectionBase(instance, entries) {
      _classCallCheck(this, SelectionBase);
      this.instance = instance;
      this.entries = entries;
    }
    _createClass(SelectionBase, [{
      key: "each",
      value: function each(handler) {
        this.entries.forEach(function (e) {
          return handler(e);
        });
        return this;
      }
    }, {
      key: "get",
      value: function get(index) {
        return this.entries[index];
      }
    }, {
      key: "addClass",
      value: function addClass(clazz, updateAttachedElements) {
        this.each(function (c) {
          return c.addClass(clazz, updateAttachedElements);
        });
        return this;
      }
    }, {
      key: "removeClass",
      value: function removeClass(clazz, updateAttachedElements) {
        this.each(function (c) {
          return c.removeClass(clazz, updateAttachedElements);
        });
        return this;
      }
    }, {
      key: "removeAllOverlays",
      value: function removeAllOverlays() {
        this.each(function (c) {
          return c.removeAllOverlays();
        });
        return this;
      }
    }, {
      key: "setLabel",
      value: function setLabel(label) {
        this.each(function (c) {
          return c.setLabel(label);
        });
        return this;
      }
    }, {
      key: "clear",
      value: function clear() {
        this.entries.length = 0;
        return this;
      }
    }, {
      key: "map",
      value: function map(fn) {
        var a = [];
        this.each(function (e) {
          return a.push(fn(e));
        });
        return a;
      }
    }, {
      key: "addOverlay",
      value: function addOverlay(spec) {
        this.each(function (c) {
          return c.addOverlay(spec);
        });
        return this;
      }
    }, {
      key: "removeOverlay",
      value: function removeOverlay(id) {
        this.each(function (c) {
          return c.removeOverlay(id);
        });
        return this;
      }
    }, {
      key: "removeOverlays",
      value: function removeOverlays() {
        this.each(function (c) {
          return c.removeOverlays();
        });
        return this;
      }
    }, {
      key: "showOverlay",
      value: function showOverlay(id) {
        this.each(function (c) {
          return c.showOverlay(id);
        });
        return this;
      }
    }, {
      key: "hideOverlay",
      value: function hideOverlay(id) {
        this.each(function (c) {
          return c.hideOverlay(id);
        });
        return this;
      }
    }, {
      key: "setPaintStyle",
      value: function setPaintStyle(style) {
        this.each(function (c) {
          return c.setPaintStyle(style);
        });
        return this;
      }
    }, {
      key: "setHoverPaintStyle",
      value: function setHoverPaintStyle(style) {
        this.each(function (c) {
          return c.setHoverPaintStyle(style);
        });
        return this;
      }
    }, {
      key: "setSuspendEvents",
      value: function setSuspendEvents(suspend) {
        this.each(function (c) {
          return c.setSuspendEvents(suspend);
        });
        return this;
      }
    }, {
      key: "setParameter",
      value: function setParameter(name, value) {
        this.each(function (c) {
          return c.setParameter(name, value);
        });
        return this;
      }
    }, {
      key: "setParameters",
      value: function setParameters(p) {
        this.each(function (c) {
          return c.setParameters(p);
        });
        return this;
      }
    }, {
      key: "setVisible",
      value: function setVisible(v) {
        this.each(function (c) {
          return c.setVisible(v);
        });
        return this;
      }
    }, {
      key: "addType",
      value: function addType(name) {
        this.each(function (c) {
          return c.addType(name);
        });
        return this;
      }
    }, {
      key: "toggleType",
      value: function toggleType(name) {
        this.each(function (c) {
          return c.toggleType(name);
        });
        return this;
      }
    }, {
      key: "removeType",
      value: function removeType(name) {
        this.each(function (c) {
          return c.removeType(name);
        });
        return this;
      }
    }, {
      key: "bind",
      value: function bind(evt, handler) {
        this.each(function (c) {
          return c.bind(evt, handler);
        });
        return this;
      }
    }, {
      key: "unbind",
      value: function unbind(evt, handler) {
        this.each(function (c) {
          return c.unbind(evt, handler);
        });
        return this;
      }
    }, {
      key: "setHover",
      value: function setHover(h) {
        var _this = this;
        this.each(function (c) {
          return _this.instance.setHover(c, h);
        });
        return this;
      }
    }, {
      key: "length",
      get: function get() {
        return this.entries.length;
      }
    }]);
    return SelectionBase;
  }();

  var EndpointSelection =
  function (_SelectionBase) {
    _inherits(EndpointSelection, _SelectionBase);
    function EndpointSelection() {
      _classCallCheck(this, EndpointSelection);
      return _possibleConstructorReturn(this, _getPrototypeOf(EndpointSelection).apply(this, arguments));
    }
    _createClass(EndpointSelection, [{
      key: "setEnabled",
      value: function setEnabled(e) {
        this.each(function (ep) {
          return ep.enabled = e;
        });
        return this;
      }
    }, {
      key: "setAnchor",
      value: function setAnchor(a) {
        this.each(function (ep) {
          return ep.setAnchor(a);
        });
        return this;
      }
    }, {
      key: "deleteEveryConnection",
      value: function deleteEveryConnection() {
        this.each(function (ep) {
          return ep.deleteEveryConnection();
        });
        return this;
      }
    }, {
      key: "deleteAll",
      value: function deleteAll() {
        var _this = this;
        this.each(function (ep) {
          return _this.instance.deleteEndpoint(ep);
        });
        this.clear();
        return this;
      }
    }]);
    return EndpointSelection;
  }(SelectionBase);

  var ConnectionSelection =
  function (_SelectionBase) {
    _inherits(ConnectionSelection, _SelectionBase);
    function ConnectionSelection() {
      _classCallCheck(this, ConnectionSelection);
      return _possibleConstructorReturn(this, _getPrototypeOf(ConnectionSelection).apply(this, arguments));
    }
    _createClass(ConnectionSelection, [{
      key: "setDetachable",
      value: function setDetachable(d) {
        this.each(function (c) {
          return c.setDetachable(d);
        });
        return this;
      }
    }, {
      key: "setReattach",
      value: function setReattach(d) {
        this.each(function (c) {
          return c.setReattach(d);
        });
        return this;
      }
    }, {
      key: "setConnector",
      value: function setConnector(spec) {
        this.each(function (c) {
          return c.setConnector(spec);
        });
        return this;
      }
    }, {
      key: "deleteAll",
      value: function deleteAll() {
        var _this = this;
        this.each(function (c) {
          return _this.instance.deleteConnection(c);
        });
        this.clear();
      }
    }, {
      key: "repaint",
      value: function repaint() {
        var _this2 = this;
        this.each(function (c) {
          return _this2.instance.paintConnection(c);
        });
        return this;
      }
    }]);
    return ConnectionSelection;
  }(SelectionBase);

  function EMPTY_POSITION() {
    return {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      r: 0,
      c: [0, 0],
      x2: 0,
      y2: 0,
      t: {
        x: 0,
        y: 0,
        c: [0, 0],
        w: 0,
        h: 0,
        r: 0,
        x2: 0,
        y2: 0,
        cr: 0,
        sr: 0
      },
      dirty: true
    };
  }
  function rotate(x, y, w, h, r) {
    var center = [x + w / 2, y + h / 2],
        cr = Math.cos(r / 360 * Math.PI * 2),
        sr = Math.sin(r / 360 * Math.PI * 2),
        _point = function _point(x, y) {
      return [center[0] + Math.round((x - center[0]) * cr - (y - center[1]) * sr), center[1] + Math.round((y - center[1]) * cr - (x - center[0]) * sr)];
    };
    var p1 = _point(x, y),
        p2 = _point(x + w, y),
        p3 = _point(x + w, y + h),
        p4 = _point(x, y + h),
        c = _point(x + w / 2, y + h / 2);
    var xmin = Math.min(p1[0], p2[0], p3[0], p4[0]),
        xmax = Math.max(p1[0], p2[0], p3[0], p4[0]),
        ymin = Math.min(p1[1], p2[1], p3[1], p4[1]),
        ymax = Math.max(p1[1], p2[1], p3[1], p4[1]);
    return {
      x: xmin,
      y: ymin,
      w: xmax - xmin,
      h: ymax - ymin,
      c: c,
      r: r,
      x2: xmax,
      y2: ymax,
      cr: cr,
      sr: sr
    };
  }
  var entryComparator = function entryComparator(value, arrayEntry, sortDescending) {
    var c = 0;
    if (arrayEntry[1] > value[1]) {
      c = -1;
    } else if (arrayEntry[1] < value[1]) {
      c = 1;
    }
    if (sortDescending) {
      c *= -1;
    }
    return c;
  };
  function insertSorted(value, array, comparator, sortDescending) {
    if (array.length === 0) {
      array.push(value);
    } else {
      var min = 0;
      var max = array.length;
      var index = Math.floor((min + max) / 2);
      while (max > min) {
        if (comparator(value, array[index], sortDescending) < 0) {
          max = index;
        } else {
          min = index + 1;
        }
        index = Math.floor((min + max) / 2);
      }
      array.splice(index, 0, value);
    }
  }
  var Viewport =
  function (_EventGenerator) {
    _inherits(Viewport, _EventGenerator);
    function Viewport() {
      var _getPrototypeOf2;
      var _this;
      _classCallCheck(this, Viewport);
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Viewport)).call.apply(_getPrototypeOf2, [this].concat(args)));
      _defineProperty(_assertThisInitialized(_this), "_eventsSuspended", false);
      _defineProperty(_assertThisInitialized(_this), "_sortedElements", {
        xmin: [],
        xmax: [],
        ymin: [],
        ymax: []
      });
      _defineProperty(_assertThisInitialized(_this), "_elementMap", new Map());
      _defineProperty(_assertThisInitialized(_this), "_transformedElementMap", new Map());
      _defineProperty(_assertThisInitialized(_this), "_bounds", {
        minx: 0,
        maxx: 0,
        miny: 0,
        maxy: 0
      });
      return _this;
    }
    _createClass(Viewport, [{
      key: "_clearElementIndex",
      value: function _clearElementIndex(id, array) {
        var idx = array.findIndex(function (entry) {
          return entry[0] === id;
        });
        if (idx > -1) {
          array.splice(idx, 1);
        }
      }
    }, {
      key: "_fireUpdate",
      value: function _fireUpdate(payload) {
        this.fire("update", payload || {});
      }
    }, {
      key: "_updateBounds",
      value: function _updateBounds(id, updatedElement) {
        if (updatedElement != null) {
          this._clearElementIndex(id, this._sortedElements.xmin);
          this._clearElementIndex(id, this._sortedElements.xmax);
          this._clearElementIndex(id, this._sortedElements.ymin);
          this._clearElementIndex(id, this._sortedElements.ymax);
          Viewport._updateElementIndex(id, updatedElement.t.x, this._sortedElements.xmin, false);
          Viewport._updateElementIndex(id, updatedElement.t.x + updatedElement.t.w, this._sortedElements.xmax, true);
          Viewport._updateElementIndex(id, updatedElement.t.y, this._sortedElements.ymin, false);
          Viewport._updateElementIndex(id, updatedElement.t.y + updatedElement.t.h, this._sortedElements.ymax, true);
          this._recalculateBounds();
        }
      }
    }, {
      key: "_recalculateBounds",
      value: function _recalculateBounds() {
        this._bounds.minx = this._sortedElements.xmin.length > 0 ? this._sortedElements.xmin[0][1] : 0;
        this._bounds.maxx = this._sortedElements.xmax.length > 0 ? this._sortedElements.xmax[0][1] : 0;
        this._bounds.miny = this._sortedElements.ymin.length > 0 ? this._sortedElements.ymin[0][1] : 0;
        this._bounds.maxy = this._sortedElements.ymax.length > 0 ? this._sortedElements.ymax[0][1] : 0;
      }
    }, {
      key: "_finaliseUpdate",
      value: function _finaliseUpdate(id, e) {
        e.t = rotate(e.x, e.y, e.w, e.h, e.r);
        this._transformedElementMap.set(id, e.t);
        this._updateBounds(id, e);
      }
    }, {
      key: "shouldFireEvent",
      value: function shouldFireEvent(event, value, originalEvent) {
        return !this._eventsSuspended;
      }
    }, {
      key: "startTransaction",
      value: function startTransaction() {
        this._eventsSuspended = true;
      }
    }, {
      key: "endTransaction",
      value: function endTransaction(doNotFireUpdate) {
        this._eventsSuspended = false;
        if (!doNotFireUpdate) {
          this._fireUpdate();
        }
      }
    }, {
      key: "updateElements",
      value: function updateElements(entries) {
        var _this2 = this;
        this.startTransaction();
        entries.forEach(function (e) {
          return _this2.updateElement(e.id, e.x, e.y, e.width, e.height, e.rotation);
        });
        this.endTransaction();
      }
    }, {
      key: "updateElement",
      value: function updateElement(id, x, y, width, height, rotation) {
        var e = getsert(this._elementMap, id, EMPTY_POSITION);
        e.dirty = x == null && e.x == null || y == null && e.y == null || width == null && e.w == null || height == null && e.h == null;
        if (x != null) {
          e.x = x;
        }
        if (y != null) {
          e.y = y;
        }
        if (width != null) {
          e.w = width;
        }
        if (height != null) {
          e.h = height;
        }
        if (rotation != null) {
          e.r = rotation || 0;
        }
        e.c[0] = e.x + e.w / 2;
        e.c[1] = e.y + e.h / 2;
        e.x2 = e.x + e.w;
        e.y2 = e.y + e.h;
        this._finaliseUpdate(id, e);
        return e;
      }
    }, {
      key: "registerElement",
      value: function registerElement(id) {
        return this.updateElement(id, 0, 0, 0, 0, 0);
      }
    }, {
      key: "addElement",
      value: function addElement(id, x, y, width, height, rotation) {
        return this.updateElement(id, x, y, width, height, rotation);
      }
    }, {
      key: "rotateElement",
      value: function rotateElement(id, rotation) {
        var e = getsert(this._elementMap, id, EMPTY_POSITION);
        e.r = rotation || 0;
        this._finaliseUpdate(id, e);
        return e;
      }
    }, {
      key: "getBoundsWidth",
      value: function getBoundsWidth() {
        return this._bounds.maxx - this._bounds.minx;
      }
    }, {
      key: "getBoundsHeight",
      value: function getBoundsHeight() {
        return this._bounds.maxy - this._bounds.miny;
      }
    }, {
      key: "getX",
      value: function getX() {
        return this._bounds.minx;
      }
    }, {
      key: "getY",
      value: function getY() {
        return this._bounds.miny;
      }
    }, {
      key: "setSize",
      value: function setSize(id, w, h) {
        if (this._elementMap.has(id)) {
          return this.updateElement(id, null, null, w, h, null);
        }
      }
    }, {
      key: "setPosition",
      value: function setPosition(id, x, y) {
        if (this._elementMap.has(id)) {
          return this.updateElement(id, x, y, null, null, null);
        }
      }
    }, {
      key: "reset",
      value: function reset() {
        this._sortedElements.xmin.length = 0;
        this._sortedElements.xmax.length = 0;
        this._sortedElements.ymin.length = 0;
        this._sortedElements.ymax.length = 0;
        this._elementMap.clear();
        this._transformedElementMap.clear();
        this._recalculateBounds();
      }
    }, {
      key: "remove",
      value: function remove(id) {
        this._clearElementIndex(id, this._sortedElements.xmin);
        this._clearElementIndex(id, this._sortedElements.xmax);
        this._clearElementIndex(id, this._sortedElements.ymin);
        this._clearElementIndex(id, this._sortedElements.ymax);
        this._elementMap["delete"](id);
        this._transformedElementMap["delete"](id);
        this._recalculateBounds();
      }
    }, {
      key: "getPosition",
      value: function getPosition(id) {
        return this._elementMap.get(id);
      }
    }, {
      key: "getElements",
      value: function getElements() {
        return this._elementMap;
      }
    }, {
      key: "isEmpty",
      value: function isEmpty() {
        return this._elementMap.size === 0;
      }
    }], [{
      key: "_updateElementIndex",
      value: function _updateElementIndex(id, value, array, sortDescending) {
        insertSorted([id, value], array, entryComparator, sortDescending);
      }
    }]);
    return Viewport;
  }(EventGenerator);

  function _scopeMatch(e1, e2) {
    var s1 = e1.scope.split(/\s/),
        s2 = e2.scope.split(/\s/);
    for (var i = 0; i < s1.length; i++) {
      for (var j = 0; j < s2.length; j++) {
        if (s2[j] === s1[i]) {
          return true;
        }
      }
    }
    return false;
  }
  function prepareList(instance, input, doNotGetIds) {
    var r = [];
    var _resolveId = function _resolveId(i) {
      if (isString(i)) {
        return i;
      } else {
        return instance.getId(i);
      }
    };
    if (input) {
      if (typeof input === 'string') {
        if (input === "*") {
          return input;
        }
        r.push(input);
      } else {
        if (doNotGetIds) {
          r = input;
        } else {
          if (input.length != null) {
            var _r;
            (_r = r).push.apply(_r, _toConsumableArray(_toConsumableArray(input).map(_resolveId)));
          } else {
            r.push(_resolveId(input));
          }
        }
      }
    }
    return r;
  }
  var ID_ATTRIBUTE = JTK_ID;
  var JsPlumbInstance =
  function (_EventGenerator) {
    _inherits(JsPlumbInstance, _EventGenerator);
    _createClass(JsPlumbInstance, [{
      key: "defaultScope",
      get: function get() {
        return this.DEFAULT_SCOPE;
      }
    }, {
      key: "currentZoom",
      get: function get() {
        return this._zoom;
      }
    }]);
    function JsPlumbInstance(_instanceIndex, defaults, helpers) {
      var _this;
      _classCallCheck(this, JsPlumbInstance);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(JsPlumbInstance).call(this));
      _this._instanceIndex = _instanceIndex;
      _defineProperty(_assertThisInitialized(_this), "Defaults", void 0);
      _defineProperty(_assertThisInitialized(_this), "_initialDefaults", {});
      _defineProperty(_assertThisInitialized(_this), "isConnectionBeingDragged", false);
      _defineProperty(_assertThisInitialized(_this), "currentlyDragging", false);
      _defineProperty(_assertThisInitialized(_this), "hoverSuspended", false);
      _defineProperty(_assertThisInitialized(_this), "_suspendDrawing", false);
      _defineProperty(_assertThisInitialized(_this), "_suspendedAt", null);
      _defineProperty(_assertThisInitialized(_this), "connectorClass", "jtk-connector");
      _defineProperty(_assertThisInitialized(_this), "connectorOutlineClass", "jtk-connector-outline");
      _defineProperty(_assertThisInitialized(_this), "connectedClass", "jtk-connected");
      _defineProperty(_assertThisInitialized(_this), "endpointClass", "jtk-endpoint");
      _defineProperty(_assertThisInitialized(_this), "endpointConnectedClass", "jtk-endpoint-connected");
      _defineProperty(_assertThisInitialized(_this), "endpointFullClass", "jtk-endpoint-full");
      _defineProperty(_assertThisInitialized(_this), "endpointDropAllowedClass", "jtk-endpoint-drop-allowed");
      _defineProperty(_assertThisInitialized(_this), "endpointDropForbiddenClass", "jtk-endpoint-drop-forbidden");
      _defineProperty(_assertThisInitialized(_this), "endpointAnchorClassPrefix", "jtk-endpoint-anchor");
      _defineProperty(_assertThisInitialized(_this), "overlayClass", "jtk-overlay");
      _defineProperty(_assertThisInitialized(_this), "connections", []);
      _defineProperty(_assertThisInitialized(_this), "endpointsByElement", {});
      _defineProperty(_assertThisInitialized(_this), "endpointsByUUID", new Map());
      _defineProperty(_assertThisInitialized(_this), "allowNestedGroups", void 0);
      _defineProperty(_assertThisInitialized(_this), "_curIdStamp", 1);
      _defineProperty(_assertThisInitialized(_this), "viewport", new Viewport());
      _defineProperty(_assertThisInitialized(_this), "router", void 0);
      _defineProperty(_assertThisInitialized(_this), "groupManager", void 0);
      _defineProperty(_assertThisInitialized(_this), "_connectionTypes", new Map());
      _defineProperty(_assertThisInitialized(_this), "_endpointTypes", new Map());
      _defineProperty(_assertThisInitialized(_this), "_container", void 0);
      _defineProperty(_assertThisInitialized(_this), "_managedElements", {});
      _defineProperty(_assertThisInitialized(_this), "DEFAULT_SCOPE", void 0);
      _defineProperty(_assertThisInitialized(_this), "_helpers", void 0);
      _defineProperty(_assertThisInitialized(_this), "geometry", void 0);
      _defineProperty(_assertThisInitialized(_this), "_zoom", 1);
      _this._helpers = helpers || {};
      _this.geometry = new jsPlumbGeometry();
      _this.Defaults = {
        anchor: "Bottom",
        anchors: [null, null],
        connectionsDetachable: true,
        connectionOverlays: [],
        connector: "Bezier",
        container: null,
        endpoint: "Dot",
        endpointOverlays: [],
        endpoints: [null, null],
        endpointStyle: {
          fill: "#456"
        },
        endpointStyles: [null, null],
        endpointHoverStyle: null,
        endpointHoverStyles: [null, null],
        hoverPaintStyle: null,
        listStyle: {},
        maxConnections: 1,
        paintStyle: {
          strokeWidth: 2,
          stroke: "#456"
        },
        reattachConnections: false,
        scope: "jsplumb_defaultscope",
        allowNestedGroups: true
      };
      if (defaults) {
        extend(_this.Defaults, defaults);
      }
      extend(_this._initialDefaults, _this.Defaults);
      _this.DEFAULT_SCOPE = _this.Defaults.scope;
      _this.allowNestedGroups = _this._initialDefaults.allowNestedGroups !== false;
      _this.router = new DefaultRouter(_assertThisInitialized(_this));
      _this.groupManager = new GroupManager(_assertThisInitialized(_this));
      _this.setContainer(_this._initialDefaults.container);
      return _this;
    }
    _createClass(JsPlumbInstance, [{
      key: "getSize",
      value: function getSize(el) {
        return this._helpers.getSize ? this._helpers.getSize(el) : this._getSize(el);
      }
    }, {
      key: "getOffset",
      value: function getOffset(el, relativeToRoot) {
        if (relativeToRoot) {
          return this._helpers.getOffsetRelativeToRoot ? this._helpers.getOffsetRelativeToRoot(el) : this._getOffsetRelativeToRoot(el);
        } else {
          return this._helpers.getOffset ? this._helpers.getOffset(el) : this._getOffset(el);
        }
      }
    }, {
      key: "getContainer",
      value: function getContainer() {
        return this._container;
      }
    }, {
      key: "setZoom",
      value: function setZoom(z, repaintEverything) {
        this._zoom = z;
        this.fire(EVENT_ZOOM, this._zoom);
        if (repaintEverything) {
          this.repaintEverything();
        }
        return true;
      }
    }, {
      key: "_idstamp",
      value: function _idstamp() {
        return "" + this._curIdStamp++;
      }
    }, {
      key: "convertToFullOverlaySpec",
      value: function convertToFullOverlaySpec(spec) {
        var o = null;
        if (isString(spec)) {
          o = [spec, {}];
        } else {
          o = spec;
        }
        o[1].id = o[1].id || uuid();
        return o;
      }
    }, {
      key: "checkCondition",
      value: function checkCondition(conditionName, args) {
        var l = this.getListener(conditionName),
            r = true;
        if (l && l.length > 0) {
          var values = Array.prototype.slice.call(arguments, 1);
          try {
            for (var i = 0, j = l.length; i < j; i++) {
              r = r && l[i].apply(l[i], values);
            }
          } catch (e) {
            log("cannot check condition [" + conditionName + "]" + e);
          }
        }
        return r;
      }
    }, {
      key: "getId",
      value: function getId(element, uuid) {
        if (element == null) {
          return null;
        }
        var id = this.getAttribute(element, ID_ATTRIBUTE);
        if (!id || id === "undefined") {
          if (arguments.length === 2 && arguments[1] !== undefined) {
            id = uuid;
          } else if (arguments.length === 1 || arguments.length === 3 && !arguments[2]) {
            id = "jsplumb-" + this._instanceIndex + "-" + this._idstamp();
          }
          this.setAttribute(element, ID_ATTRIBUTE, id);
        }
        return id;
      }
    }, {
      key: "getConnections",
      value: function getConnections(options, flat) {
        if (!options) {
          options = {};
        } else if (options.constructor === String) {
          options = {
            "scope": options
          };
        }
        var scope = options.scope || this.defaultScope,
            scopes = prepareList(this, scope, true),
            sources = prepareList(this, options.source),
            targets = prepareList(this, options.target),
            results = !flat && scopes.length > 1 ? {} : [],
            _addOne = function _addOne(scope, obj) {
          if (!flat && scopes.length > 1) {
            var ss = results[scope];
            if (ss == null) {
              ss = results[scope] = [];
            }
            ss.push(obj);
          } else {
            results.push(obj);
          }
        };
        for (var j = 0, jj = this.connections.length; j < jj; j++) {
          var _c2 = this.connections[j],
              sourceId = _c2.proxies && _c2.proxies[0] ? _c2.proxies[0].originalEp.elementId : _c2.sourceId,
              targetId = _c2.proxies && _c2.proxies[1] ? _c2.proxies[1].originalEp.elementId : _c2.targetId;
          if (filterList(scopes, _c2.scope) && filterList(sources, sourceId) && filterList(targets, targetId)) {
            _addOne(_c2.scope, _c2);
          }
        }
        return results;
      }
    }, {
      key: "select",
      value: function select(params) {
        params = params || {};
        params.scope = params.scope || "*";
        return new ConnectionSelection(this, params.connections || this.getConnections(params, true));
      }
    }, {
      key: "selectEndpoints",
      value: function selectEndpoints(params) {
        params = params || {};
        params.scope = params.scope || WILDCARD;
        var noElementFilters = !params.element && !params.source && !params.target,
            elements = noElementFilters ? WILDCARD : prepareList(this, params.element),
            sources = noElementFilters ? WILDCARD : prepareList(this, params.source),
            targets = noElementFilters ? WILDCARD : prepareList(this, params.target),
            scopes = prepareList(this, params.scope, true);
        var ep = [];
        for (var _el2 in this.endpointsByElement) {
          var either = filterList(elements, _el2, true),
              source = filterList(sources, _el2, true),
              sourceMatchExact = sources !== "*",
              target = filterList(targets, _el2, true),
              targetMatchExact = targets !== "*";
          if (either || source || target) {
            inner: for (var i = 0, ii = this.endpointsByElement[_el2].length; i < ii; i++) {
              var _ep = this.endpointsByElement[_el2][i];
              if (filterList(scopes, _ep.scope, true)) {
                var noMatchSource = sourceMatchExact && sources.length > 0 && !_ep.isSource,
                    noMatchTarget = targetMatchExact && targets.length > 0 && !_ep.isTarget;
                if (noMatchSource || noMatchTarget) {
                  continue inner;
                }
                ep.push(_ep);
              }
            }
          }
        }
        return new EndpointSelection(this, ep);
      }
    }, {
      key: "setContainer",
      value: function setContainer(c) {
        this._container = c;
        this.fire(EVENT_CONTAINER_CHANGE, this._container);
      }
    }, {
      key: "_set",
      value: function _set(c, el, idx) {
        var stTypes = [{
          el: "source",
          elId: "sourceId",
          epDefs: SOURCE_DEFINITION_LIST
        }, {
          el: "target",
          elId: "targetId",
          epDefs: TARGET_DEFINITION_LIST
        }];
        var ep,
            _st = stTypes[idx],
            cId = c[_st.elId],
            sid,
            sep,
            oldEndpoint = c.endpoints[idx];
        var evtParams = {
          index: idx,
          originalSource: c.source,
          originalTarget: c.target,
          originalSourceId: idx === 0 ? cId : c.sourceId,
          newSourceId: c.sourceId,
          originalTargetId: idx === 1 ? cId : c.targetId,
          newTargetId: c.targetId,
          connection: c
        };
        if (el instanceof Endpoint) {
          ep = el;
          ep.addConnection(c);
          el = ep.element;
        } else {
          sid = this.getId(el);
          sep = el[_st.epDefs] ? el[_st.epDefs][0] : null;
          if (sid === c[_st.elId]) {
            ep = null;
          } else if (sep) {
            if (!sep.enabled) {
              return;
            }
            ep = sep.endpoint != null ? sep.endpoint : this.addEndpoint(el, sep.def);
            if (sep.uniqueEndpoint) {
              sep.endpoint = ep;
            }
            ep.addConnection(c);
          } else {
            ep = c.makeEndpoint(idx === 0, el, sid);
          }
        }
        if (ep != null) {
          oldEndpoint.detachFromConnection(c);
          c.endpoints[idx] = ep;
          c[_st.el] = ep.element;
          c[_st.elId] = ep.elementId;
          evtParams[idx === 0 ? "newSourceId" : "newTargetId"] = ep.elementId;
          this.fireMoveEvent(evtParams);
          this.paintConnection(c);
        }
        evtParams.element = el;
        return evtParams;
      }
    }, {
      key: "setSource",
      value: function setSource(connection, el) {
        var p = this._set(connection, el, 0);
        Connection.updateConnectedClass(this, connection, p.originalSource, true);
        this.sourceOrTargetChanged(p.originalSourceId, p.newSourceId, connection, p.element, 0);
      }
    }, {
      key: "setTarget",
      value: function setTarget(connection, el) {
        var p = this._set(connection, el, 1);
        Connection.updateConnectedClass(this, connection, p.originalTarget, true);
        connection.updateConnectedClass(false);
      }
    }, {
      key: "isHoverSuspended",
      value: function isHoverSuspended() {
        return this.hoverSuspended;
      }
    }, {
      key: "setSuspendDrawing",
      value: function setSuspendDrawing(val, repaintAfterwards) {
        var curVal = this._suspendDrawing;
        this._suspendDrawing = val;
        if (val) {
          this._suspendedAt = "" + new Date().getTime();
        } else {
          this._suspendedAt = null;
        }
        if (repaintAfterwards) {
          this.repaintEverything();
        }
        return curVal;
      }
    }, {
      key: "computeAnchorLoc",
      value: function computeAnchorLoc(endpoint, timestamp) {
        var myOffset = this._managedElements[endpoint.elementId].viewportElement;
        return endpoint.anchor.compute({
          xy: [myOffset.x, myOffset.y],
          wh: [myOffset.w, myOffset.h],
          element: endpoint,
          timestamp: timestamp || this._suspendedAt,
          rotation: this._managedElements[endpoint.elementId].rotation
        });
      }
    }, {
      key: "getSuspendedAt",
      value: function getSuspendedAt() {
        return this._suspendedAt;
      }
    }, {
      key: "batch",
      value: function batch(fn, doNotRepaintAfterwards) {
        var _wasSuspended = this._suspendDrawing === true;
        if (!_wasSuspended) {
          this.setSuspendDrawing(true);
        }
        fn();
        if (!_wasSuspended) {
          this.setSuspendDrawing(false, !doNotRepaintAfterwards);
        }
      }
    }, {
      key: "each",
      value: function each(spec, fn) {
        if (spec == null) {
          return;
        }
        if (spec.length != null) {
          for (var i = 0; i < spec.length; i++) {
            fn(spec[i]);
          }
        } else {
          fn(spec);
        }
        return this;
      }
    }, {
      key: "updateOffset",
      value: function updateOffset(params) {
        var recalc = params.recalc,
            elId = params.elId,
            s;
        if (recalc || this.viewport.getPosition(elId) == null) {
          s = this._managedElements[elId] ? this._managedElements[elId].el : null;
          if (s != null) {
            var size = this.getSize(s);
            var offset = this.getOffset(s);
            this.viewport.updateElement(elId, offset.left, offset.top, size[0], size[1], null);
          }
        }
        return this.viewport.getPosition(elId);
      }
    }, {
      key: "deleteConnection",
      value: function deleteConnection(connection, params) {
        if (connection != null) {
          params = params || {};
          if (params.force || functionChain(true, false, [[connection.endpoints[0], IS_DETACH_ALLOWED, [connection]], [connection.endpoints[1], IS_DETACH_ALLOWED, [connection]], [connection, IS_DETACH_ALLOWED, [connection]], [this, CHECK_CONDITION, [INTERCEPT_BEFORE_DETACH, connection]]])) {
            this.fireDetachEvent(connection, !connection.pending && params.fireEvent !== false, params.originalEvent);
            var sourceEndpoint = connection.endpoints[0];
            var targetEndpoint = connection.endpoints[1];
            if (sourceEndpoint !== params.endpointToIgnore) {
              sourceEndpoint.detachFromConnection(connection, null, true);
            }
            if (targetEndpoint !== params.endpointToIgnore) {
              targetEndpoint.detachFromConnection(connection, null, true);
            }
            removeWithFunction(this.connections, function (_c) {
              return connection.id === _c.id;
            });
            connection.destroy();
            if (sourceEndpoint !== params.endpointToIgnore && sourceEndpoint.deleteOnEmpty && sourceEndpoint.connections.length === 0) {
              this.deleteEndpoint(sourceEndpoint);
            }
            if (targetEndpoint !== params.endpointToIgnore && targetEndpoint.deleteOnEmpty && targetEndpoint.connections.length === 0) {
              this.deleteEndpoint(targetEndpoint);
            }
            return true;
          }
        }
        return false;
      }
    }, {
      key: "deleteEveryConnection",
      value: function deleteEveryConnection(params) {
        var _this2 = this;
        params = params || {};
        var count = this.connections.length,
            deletedCount = 0;
        this.batch(function () {
          for (var i = 0; i < count; i++) {
            deletedCount += _this2.deleteConnection(_this2.connections[0], params) ? 1 : 0;
          }
        });
        return deletedCount;
      }
    }, {
      key: "deleteConnectionsForElement",
      value: function deleteConnectionsForElement(el, params) {
        params = params || {};
        var id = this.getId(el),
            endpoints = this.endpointsByElement[id];
        if (endpoints && endpoints.length) {
          for (var i = 0, j = endpoints.length; i < j; i++) {
            endpoints[i].deleteEveryConnection(params);
          }
        }
        return this;
      }
    }, {
      key: "fireDetachEvent",
      value: function fireDetachEvent(jpc, doFireEvent, originalEvent) {
        var argIsConnection = jpc.id != null,
            params = argIsConnection ? {
          connection: jpc,
          source: jpc.source,
          target: jpc.target,
          sourceId: jpc.sourceId,
          targetId: jpc.targetId,
          sourceEndpoint: jpc.endpoints[0],
          targetEndpoint: jpc.endpoints[1]
        } : jpc;
        if (doFireEvent) {
          this.fire(EVENT_CONNECTION_DETACHED, params, originalEvent);
        }
        this.fire(EVENT_INTERNAL_CONNECTION_DETACHED, params, originalEvent);
      }
    }, {
      key: "fireMoveEvent",
      value: function fireMoveEvent(params, evt) {
        this.fire(EVENT_CONNECTION_MOVED, params, evt);
      }
    }, {
      key: "manageAll",
      value: function manageAll(elements, recalc) {
        for (var i = 0; i < elements.length; i++) {
          this.manage(elements[i], null, recalc);
        }
      }
    }, {
      key: "manage",
      value: function manage(element, internalId, recalc) {
        if (this.getAttribute(element, ID_ATTRIBUTE) == null) {
          internalId = internalId || uuid();
          this.setAttribute(element, ID_ATTRIBUTE, internalId);
        }
        var elId = this.getId(element);
        if (!this._managedElements[elId]) {
          this.setAttribute(element, ATTRIBUTE_MANAGED, "");
          this._managedElements[elId] = {
            el: element,
            endpoints: [],
            connections: [],
            rotation: 0
          };
          if (this._suspendDrawing) {
            this._managedElements[elId].viewportElement = this.viewport.registerElement(elId);
          } else {
            this._managedElements[elId].viewportElement = this.updateOffset({
              elId: elId,
              recalc: true
            });
          }
          this.fire(EVENT_MANAGE_ELEMENT, {
            el: element
          });
        } else {
          if (recalc) {
            this._managedElements[elId].viewportElement = this.updateOffset({
              elId: elId,
              timestamp: null,
              recalc: true
            });
          }
        }
        return this._managedElements[elId];
      }
    }, {
      key: "unmanage",
      value: function unmanage(el, removeElement) {
        var _this3 = this;
        var affectedElements = [];
        this.removeAllEndpoints(el, true, affectedElements);
        var _one = function _one(_el) {
          var id = _this3.getId(_el);
          _this3.router.elementRemoved(id);
          if (_this3.isSource(_el)) {
            _this3.unmakeSource(_el);
          }
          if (_this3.isTarget(_el)) {
            _this3.unmakeTarget(_el);
          }
          _this3.removeAttribute(_el, ID_ATTRIBUTE);
          _this3.removeAttribute(_el, ATTRIBUTE_MANAGED);
          delete _this3._managedElements[id];
          _this3.viewport.remove(id);
          _this3.fire(EVENT_UNMANAGE_ELEMENT, {
            el: _el
          });
          if (_el && removeElement) {
            _this3.removeElement(_el);
          }
        };
        for (var ae = 1; ae < affectedElements.length; ae++) {
          _one(affectedElements[ae]);
        }
        _one(el);
      }
    }, {
      key: "rotate",
      value: function rotate(element, rotation, doNotRepaint) {
        var elementId = this.getId(element);
        if (this._managedElements[elementId]) {
          this._managedElements[elementId].rotation = rotation;
          this.viewport.rotateElement(elementId, rotation);
          if (doNotRepaint !== true) {
            return this.revalidate(element);
          }
        }
        return {
          c: new Set(),
          e: new Set()
        };
      }
    }, {
      key: "getRotation",
      value: function getRotation(elementId) {
        return this._managedElements[elementId] ? this._managedElements[elementId].rotation || 0 : 0;
      }
    }, {
      key: "newEndpoint",
      value: function newEndpoint(params, id) {
        var _p = extend({}, params);
        _p.elementId = id || this.getId(_p.source);
        var ep = new Endpoint(this, _p);
        ep.id = "ep_" + this._idstamp();
        this.manage(_p.source);
        if (params.uuid) {
          this.endpointsByUUID.set(params.uuid, ep);
        }
        return ep;
      }
    }, {
      key: "deriveEndpointAndAnchorSpec",
      value: function deriveEndpointAndAnchorSpec(type, dontPrependDefault) {
        var bits = ((dontPrependDefault ? "" : "default ") + type).split(/[\s]/),
            eps = null,
            ep = null,
            a = null,
            as = null;
        for (var i = 0; i < bits.length; i++) {
          var _t = this.getType(bits[i], "connection");
          if (_t) {
            if (_t.endpoints) {
              eps = _t.endpoints;
            }
            if (_t.endpoint) {
              ep = _t.endpoint;
            }
            if (_t.anchors) {
              as = _t.anchors;
            }
            if (_t.anchor) {
              a = _t.anchor;
            }
          }
        }
        return {
          endpoints: eps ? eps : [ep, ep],
          anchors: as ? as : [a, a]
        };
      }
    }, {
      key: "revalidate",
      value: function revalidate(el, timestamp) {
        var elId = this.getId(el);
        this.updateOffset({
          elId: elId,
          recalc: true,
          timestamp: timestamp
        });
        return this._draw(el);
      }
    }, {
      key: "repaintEverything",
      value: function repaintEverything() {
        var timestamp = uuid(),
            elId;
        for (elId in this.endpointsByElement) {
          this.updateOffset({
            elId: elId,
            recalc: true,
            timestamp: timestamp
          });
        }
        for (elId in this.endpointsByElement) {
          this._draw(this._managedElements[elId].el, null, timestamp, true);
        }
        return this;
      }
    }, {
      key: "setElementPosition",
      value: function setElementPosition(el, x, y) {
        var id = this.getId(el);
        this.viewport.setPosition(id, x, y);
        return this._draw(el);
      }
    }, {
      key: "repaint",
      value: function repaint(el) {
        this._draw(el);
      }
    }, {
      key: "_draw",
      value: function _draw(el, ui, timestamp, offsetsWereJustCalculated) {
        var r = {
          c: new Set(),
          e: new Set()
        };
        var _mergeRedraw = function _mergeRedraw(r2) {
          r2.c.forEach(function (c) {
            return r.c.add(c);
          });
          r2.e.forEach(function (e) {
            return r.e.add(e);
          });
        };
        if (!this._suspendDrawing) {
          var id = this.getId(el);
          if (el != null) {
            var repaintEls = this._getAssociatedElements(el),
                repaintOffsets = [];
            if (timestamp == null) {
              timestamp = uuid();
            }
            if (!offsetsWereJustCalculated) {
              for (var i = 0; i < repaintEls.length; i++) {
                repaintOffsets.push(this.updateOffset({
                  elId: this.getId(repaintEls[i]),
                  recalc: true,
                  timestamp: timestamp
                }));
              }
            } else {
              for (var _i = 0; _i < repaintEls.length; _i++) {
                var reId = this.getId(repaintEls[_i]);
                repaintOffsets.push(this.viewport.getPosition(reId));
              }
            }
            _mergeRedraw(this.router.redraw(id, ui, timestamp, null));
            if (repaintEls.length > 0) {
              for (var j = 0; j < repaintEls.length; j++) {
                _mergeRedraw(this.router.redraw(this.getId(repaintEls[j]), repaintOffsets[j], timestamp, null));
              }
            }
          }
        }
        return r;
      }
    }, {
      key: "unregisterEndpoint",
      value: function unregisterEndpoint(endpoint) {
        var uuid = endpoint.getUuid();
        if (uuid) {
          this.endpointsByUUID["delete"](uuid);
        }
        for (var _e in this.endpointsByElement) {
          var endpoints = this.endpointsByElement[_e];
          if (endpoints) {
            var newEndpoints = [];
            for (var i = 0, j = endpoints.length; i < j; i++) {
              if (endpoints[i] !== endpoint) {
                newEndpoints.push(endpoints[i]);
              }
            }
            this.endpointsByElement[_e] = newEndpoints;
          }
          if (this.endpointsByElement[_e].length < 1) {
            delete this.endpointsByElement[_e];
          }
        }
        this.fire(EVENT_INTERNAL_ENDPOINT_UNREGISTERED, endpoint);
      }
    }, {
      key: "maybePruneEndpoint",
      value: function maybePruneEndpoint(endpoint) {
        if (endpoint.deleteOnEmpty && endpoint.connections.length === 0) {
          this.deleteEndpoint(endpoint);
          return true;
        } else {
          return false;
        }
      }
    }, {
      key: "deleteEndpoint",
      value: function deleteEndpoint(object) {
        var _this4 = this;
        var endpoint = typeof object === "string" ? this.endpointsByUUID.get(object) : object;
        if (endpoint) {
          var connectionsToDelete = endpoint.connections.slice();
          connectionsToDelete.forEach(function (connection) {
            endpoint.detachFromConnection(connection, null, true);
          });
          this.unregisterEndpoint(endpoint);
          endpoint.destroy(true);
          connectionsToDelete.forEach(function (connection) {
            _this4.deleteConnection(connection, {
              force: true,
              endpointToIgnore: endpoint
            });
          });
        }
        return this;
      }
    }, {
      key: "addEndpoint",
      value: function addEndpoint(el, params, referenceParams) {
        referenceParams = referenceParams || {};
        var p = extend({}, referenceParams);
        extend(p, params);
        p.endpoint = p.endpoint || this.Defaults.endpoint;
        p.paintStyle = p.paintStyle || this.Defaults.endpointStyle;
        var _p = extend({
          source: el
        }, p);
        var id = this.getId(_p.source);
        this.manage(el, null, !this._suspendDrawing);
        var e = this.newEndpoint(_p, id);
        addToDictionary(this.endpointsByElement, id, e);
        if (!this._suspendDrawing) {
          var anchorLoc = this.computeAnchorLoc(e);
          this.paintEndpoint(e, {
            anchorLoc: anchorLoc,
            timestamp: this._suspendedAt
          });
        }
        return e;
      }
    }, {
      key: "addEndpoints",
      value: function addEndpoints(el, endpoints, referenceParams) {
        var results = [];
        for (var i = 0, j = endpoints.length; i < j; i++) {
          results.push(this.addEndpoint(el, endpoints[i], referenceParams));
        }
        return results;
      }
    }, {
      key: "reset",
      value: function reset(silently) {
        var _this5 = this;
        this.silently(function () {
          _this5.endpointsByElement = {};
          _this5._managedElements = {};
          _this5.endpointsByUUID.clear();
          _this5.viewport.reset();
          _this5.router.reset();
          _this5.groupManager.reset();
          _this5._connectionTypes.clear();
          _this5._endpointTypes.clear();
          _this5.connections.length = 0;
        });
      }
    }, {
      key: "uuid",
      value: function uuid$1() {
        return uuid();
      }
    }, {
      key: "rotatePoint",
      value: function rotatePoint$1(point, center, rotation) {
        return rotatePoint(point, center, rotation);
      }
    }, {
      key: "rotateAnchorOrientation",
      value: function rotateAnchorOrientation$1(orientation, rotation) {
        return rotateAnchorOrientation(orientation, rotation);
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this.reset(true);
        this.unbind();
      }
    }, {
      key: "getEndpoints",
      value: function getEndpoints(el) {
        return this.endpointsByElement[this.getId(el)] || [];
      }
    }, {
      key: "getEndpoint",
      value: function getEndpoint(id) {
        return this.endpointsByUUID.get(id);
      }
    }, {
      key: "connect",
      value: function connect(params, referenceParams) {
        var _p = this._prepareConnectionParams(params, referenceParams),
            jpc;
        if (_p) {
          if (_p.source == null && _p.sourceEndpoint == null) {
            log("Cannot establish connection - source does not exist");
            return;
          }
          if (_p.target == null && _p.targetEndpoint == null) {
            log("Cannot establish connection - target does not exist");
            return;
          }
          jpc = this._newConnection(_p);
          this._finaliseConnection(jpc, _p);
        }
        return jpc;
      }
    }, {
      key: "_prepareConnectionParams",
      value: function _prepareConnectionParams(params, referenceParams) {
        var _this6 = this;
        var _p = extend({}, params);
        if (referenceParams) {
          extend(_p, referenceParams);
        }
        if (_p.source) {
          if (_p.source.endpoint) {
            _p.sourceEndpoint = _p.source;
          }
        }
        if (_p.target) {
          if (_p.target.endpoint) {
            _p.targetEndpoint = _p.target;
          }
        }
        if (params.uuids) {
          _p.sourceEndpoint = this.getEndpoint(params.uuids[0]);
          _p.targetEndpoint = this.getEndpoint(params.uuids[1]);
        }
        if (_p.sourceEndpoint && _p.sourceEndpoint.isFull()) {
          log("could not add connection; source endpoint is full");
          return;
        }
        if (_p.targetEndpoint && _p.targetEndpoint.isFull()) {
          log("could not add connection; target endpoint is full");
          return;
        }
        if (!_p.type && _p.sourceEndpoint) {
          _p.type = _p.sourceEndpoint.connectionType;
        }
        if (_p.sourceEndpoint && _p.sourceEndpoint.connectorOverlays) {
          _p.overlays = _p.overlays || [];
          for (var i = 0, j = _p.sourceEndpoint.connectorOverlays.length; i < j; i++) {
            _p.overlays.push(_p.sourceEndpoint.connectorOverlays[i]);
          }
        }
        if (_p.sourceEndpoint && _p.sourceEndpoint.scope) {
          _p.scope = _p.sourceEndpoint.scope;
        }
        var _addEndpoint = function _addEndpoint(el, def, idx) {
          var params = _mergeOverrides(def, {
            anchor: _p.anchors ? _p.anchors[idx] : _p.anchor,
            endpoint: _p.endpoints ? _p.endpoints[idx] : _p.endpoint,
            paintStyle: _p.endpointStyles ? _p.endpointStyles[idx] : _p.endpointStyle,
            hoverPaintStyle: _p.endpointHoverStyles ? _p.endpointHoverStyles[idx] : _p.endpointHoverStyle,
            portId: _p.ports ? _p.ports[idx] : null
          });
          return _this6.addEndpoint(el, params);
        };
        var _oneElementDef = function _oneElementDef(type, idx, matchType, portId) {
          if (_p[type] && !_p[type].endpoint && !_p[type + "Endpoint"] && !_p.newConnection) {
            var elDefs = _p[type][type === SOURCE ? SOURCE_DEFINITION_LIST : TARGET_DEFINITION_LIST];
            if (elDefs) {
              var defIdx = findWithFunction(elDefs, function (d) {
                return (d.def.connectionType == null || d.def.connectionType === matchType) && (d.def.portId == null || d.def.portId == portId);
              });
              if (defIdx >= 0) {
                var tep = elDefs[defIdx];
                if (tep) {
                  if (!tep.enabled) {
                    return false;
                  }
                  var epDef = extend({}, tep.def);
                  delete epDef.label;
                  var newEndpoint = tep.endpoint != null ? tep.endpoint : _addEndpoint(_p[type], epDef, idx);
                  if (newEndpoint.isFull()) {
                    return false;
                  }
                  _p[type + "Endpoint"] = newEndpoint;
                  if (!_p.scope && epDef.scope) {
                    _p.scope = epDef.scope;
                  }
                  if (tep.uniqueEndpoint) {
                    if (!tep.endpoint) {
                      tep.endpoint = newEndpoint;
                      newEndpoint.deleteOnEmpty = false;
                    } else {
                      newEndpoint.finalEndpoint = tep.endpoint;
                    }
                  } else {
                    newEndpoint.deleteOnEmpty = true;
                  }
                  if (idx === 0 && epDef.connectorOverlays) {
                    _p.overlays = _p.overlays || [];
                    Array.prototype.push.apply(_p.overlays, epDef.connectorOverlays);
                  }
                }
              }
            }
          }
        };
        if (_oneElementDef(SOURCE, 0, _p.type || DEFAULT, _p.ports ? _p.ports[0] : null) === false) {
          return;
        }
        if (_oneElementDef(TARGET, 1, _p.type || DEFAULT, _p.ports ? _p.ports[1] : null) === false) {
          return;
        }
        if (_p.sourceEndpoint && _p.targetEndpoint) {
          if (!_scopeMatch(_p.sourceEndpoint, _p.targetEndpoint)) {
            _p = null;
          }
        }
        return _p;
      }
    }, {
      key: "_newConnection",
      value: function _newConnection(params) {
        params.id = "con_" + this._idstamp();
        var c = new Connection(this, params);
        this.paintConnection(c);
        return c;
      }
    }, {
      key: "_finaliseConnection",
      value: function _finaliseConnection(jpc, params, originalEvent) {
        params = params || {};
        if (!jpc.suspendedEndpoint) {
          this.connections.push(jpc);
        }
        jpc.pending = null;
        jpc.endpoints[0].isTemporarySource = false;
        this._draw(jpc.source);
        if (!params.doNotFireConnectionEvent && params.fireEvent !== false) {
          var eventArgs = {
            connection: jpc,
            source: jpc.source,
            target: jpc.target,
            sourceId: jpc.sourceId,
            targetId: jpc.targetId,
            sourceEndpoint: jpc.endpoints[0],
            targetEndpoint: jpc.endpoints[1]
          };
          this.fire(EVENT_CONNECTION, eventArgs, originalEvent);
        }
      }
    }, {
      key: "removeAllEndpoints",
      value: function removeAllEndpoints(el, recurse, affectedElements) {
        var _this7 = this;
        affectedElements = affectedElements || [];
        var _one = function _one(_el) {
          var id = _this7.getId(_el),
              ebe = _this7.endpointsByElement[id],
              i,
              ii;
          if (ebe) {
            affectedElements.push(_el);
            for (i = 0, ii = ebe.length; i < ii; i++) {
              _this7.deleteEndpoint(ebe[i]);
            }
          }
          delete _this7.endpointsByElement[id];
          if (recurse) {
            _this7.getChildElements(_el).map(_one);
          }
        };
        _one(el);
        return this;
      }
    }, {
      key: "_setEnabled",
      value: function _setEnabled(type, el, state, toggle, connectionType) {
        var _this8 = this;
        var originalState = [],
            newState,
            os;
        var jel = el;
        connectionType = connectionType || DEFAULT;
        var defs = type === SOURCE ? jel._jsPlumbSourceDefinitions : jel._jsPlumbTargetDefinitions;
        if (defs) {
          defs.forEach(function (def) {
            if (def.def.connectionType == null || def.def.connectionType === connectionType) {
              os = def.enabled;
              originalState.push(os);
              newState = toggle ? !os : state;
              def.enabled = newState;
              var cls = ["jtk", type, "disabled"].join("-");
              if (newState) {
                _this8.removeClass(el, cls);
              } else {
                _this8.addClass(el, cls);
              }
            }
          });
        }
        return originalState.length > 1 ? originalState : originalState[0];
      }
    }, {
      key: "toggleSourceEnabled",
      value: function toggleSourceEnabled(el, connectionType) {
        this._setEnabled(SOURCE, el, null, true, connectionType);
        return this.isSourceEnabled(el, connectionType);
      }
    }, {
      key: "setSourceEnabled",
      value: function setSourceEnabled(el, state, connectionType) {
        return this._setEnabled(SOURCE, el, state, null, connectionType);
      }
    }, {
      key: "findFirstSourceDefinition",
      value: function findFirstSourceDefinition(el, connectionType) {
        return this.findFirstDefinition(SOURCE_DEFINITION_LIST, el, connectionType);
      }
    }, {
      key: "findFirstTargetDefinition",
      value: function findFirstTargetDefinition(el, connectionType) {
        return this.findFirstDefinition(TARGET_DEFINITION_LIST, el, connectionType);
      }
    }, {
      key: "findFirstDefinition",
      value: function findFirstDefinition(key, el, connectionType) {
        if (el == null) {
          return null;
        } else {
          var eldefs = el[key];
          if (eldefs && eldefs.length > 0) {
            var idx = connectionType == null ? 0 : findWithFunction(eldefs, function (d) {
              return d.def.connectionType === connectionType;
            });
            if (idx >= 0) {
              return eldefs[0];
            }
          }
        }
      }
    }, {
      key: "isSource",
      value: function isSource(el, connectionType) {
        return this.findFirstSourceDefinition(el, connectionType) != null;
      }
    }, {
      key: "isSourceEnabled",
      value: function isSourceEnabled(el, connectionType) {
        var def = this.findFirstSourceDefinition(el, connectionType);
        return def != null && def.enabled !== false;
      }
    }, {
      key: "toggleTargetEnabled",
      value: function toggleTargetEnabled(el, connectionType) {
        this._setEnabled(TARGET, el, null, true, connectionType);
        return this.isTargetEnabled(el, connectionType);
      }
    }, {
      key: "isTarget",
      value: function isTarget(el, connectionType) {
        return this.findFirstTargetDefinition(el, connectionType) != null;
      }
    }, {
      key: "isTargetEnabled",
      value: function isTargetEnabled(el, connectionType) {
        var def = this.findFirstTargetDefinition(el, connectionType);
        return def != null && def.enabled !== false;
      }
    }, {
      key: "setTargetEnabled",
      value: function setTargetEnabled(el, state, connectionType) {
        return this._setEnabled(TARGET, el, state, null, connectionType);
      }
    }, {
      key: "_unmake",
      value: function _unmake(type, key, el, connectionType) {
        connectionType = connectionType || "*";
        if (el[key]) {
          if (connectionType === "*") {
            delete el[key];
            this.removeAttribute(el, "jtk-" + type);
          } else {
            var _t2 = [];
            el[key].forEach(function (def) {
              if (connectionType !== def.def.connectionType) {
                _t2.push(def);
              }
            });
            if (_t2.length > 0) {
              el[key] = _t2;
            } else {
              delete el[key];
              this.removeAttribute(el, "jtk-" + type);
            }
          }
        }
      }
    }, {
      key: "_unmakeEvery",
      value: function _unmakeEvery(type, key, connectionType) {
        var els = this.getSelector("[jtk-" + type + "]");
        for (var i = 0; i < els.length; i++) {
          this._unmake(type, key, els[i], connectionType);
        }
      }
    }, {
      key: "unmakeTarget",
      value: function unmakeTarget(el, connectionType) {
        return this._unmake(TARGET, TARGET_DEFINITION_LIST, el, connectionType);
      }
    }, {
      key: "unmakeSource",
      value: function unmakeSource(el, connectionType) {
        return this._unmake(SOURCE, SOURCE_DEFINITION_LIST, el, connectionType);
      }
    }, {
      key: "unmakeEverySource",
      value: function unmakeEverySource(connectionType) {
        this._unmakeEvery(SOURCE, SOURCE_DEFINITION_LIST, connectionType || "*");
      }
    }, {
      key: "unmakeEveryTarget",
      value: function unmakeEveryTarget(connectionType) {
        this._unmakeEvery(TARGET, TARGET_DEFINITION_LIST, connectionType || "*");
      }
    }, {
      key: "_writeScopeAttribute",
      value: function _writeScopeAttribute(el, scope) {
        var scopes = scope.split(/\s/);
        for (var i = 0; i < scopes.length; i++) {
          this.setAttribute(el, SCOPE_PREFIX + scopes[i], "");
        }
      }
    }, {
      key: "makeSource",
      value: function makeSource(el, params, referenceParams) {
        var p = extend({
          _jsPlumb: this
        }, referenceParams);
        extend(p, params);
        p.connectionType = p.connectionType || DEFAULT;
        var aae = this.deriveEndpointAndAnchorSpec(p.connectionType);
        p.endpoint = p.endpoint || aae.endpoints[0];
        p.anchor = p.anchor || aae.anchors[0];
        var maxConnections = p.maxConnections || -1;
        this.manage(el);
        this.setAttribute(el, ATTRIBUTE_SOURCE, "");
        this._writeScopeAttribute(el, p.scope || this.Defaults.scope);
        this.setAttribute(el, [ATTRIBUTE_SOURCE, p.connectionType].join("-"), "");
        el._jsPlumbSourceDefinitions = el._jsPlumbSourceDefinitions || [];
        var _def = {
          def: extend({}, p),
          uniqueEndpoint: p.uniqueEndpoint,
          maxConnections: maxConnections,
          enabled: true,
          endpoint: null
        };
        if (p.createEndpoint) {
          _def.uniqueEndpoint = true;
          _def.endpoint = this.addEndpoint(el, _def.def);
          _def.endpoint.deleteOnEmpty = false;
        }
        el._jsPlumbSourceDefinitions.push(_def);
        return this;
      }
    }, {
      key: "_getScope",
      value: function _getScope(el, defKey) {
        if (el[defKey] && el[defKey].length > 0) {
          return el[defKey][0].def.scope;
        } else {
          return null;
        }
      }
    }, {
      key: "getSourceScope",
      value: function getSourceScope(el) {
        return this._getScope(el, SOURCE_DEFINITION_LIST);
      }
    }, {
      key: "getTargetScope",
      value: function getTargetScope(el) {
        return this._getScope(el, TARGET_DEFINITION_LIST);
      }
    }, {
      key: "getScope",
      value: function getScope(el) {
        return this.getSourceScope(el) || this.getTargetScope(el);
      }
    }, {
      key: "_setScope",
      value: function _setScope(el, scope, defKey) {
        if (el[defKey]) {
          el[defKey].forEach(function (def) {
            return def.def.scope = scope;
          });
        }
      }
    }, {
      key: "setSourceScope",
      value: function setSourceScope(el, scope) {
        this._setScope(el, scope, SOURCE_DEFINITION_LIST);
      }
    }, {
      key: "setTargetScope",
      value: function setTargetScope(el, scope) {
        this._setScope(el, scope, TARGET_DEFINITION_LIST);
      }
    }, {
      key: "setScope",
      value: function setScope(el, scope) {
        this._setScope(el, scope, SOURCE_DEFINITION_LIST);
        this._setScope(el, scope, TARGET_DEFINITION_LIST);
      }
    }, {
      key: "makeTarget",
      value: function makeTarget(el, params, referenceParams) {
        var jel = el;
        var p = extend({
          _jsPlumb: this
        }, referenceParams);
        extend(p, params);
        p.connectionType = p.connectionType || DEFAULT;
        var maxConnections = p.maxConnections || -1;
        var dropOptions = extend({}, p.dropOptions || {});
        this.manage(el);
        this.setAttribute(el, ATTRIBUTE_TARGET, "");
        this._writeScopeAttribute(el, p.scope || this.Defaults.scope);
        this.setAttribute(el, [ATTRIBUTE_TARGET, p.connectionType].join("-"), "");
        jel._jsPlumbTargetDefinitions = jel._jsPlumbTargetDefinitions || [];
        if (jel._jsPlumbGroup && dropOptions.rank == null) {
          dropOptions.rank = -1;
        }
        var _def = {
          def: extend({}, p),
          uniqueEndpoint: p.uniqueEndpoint,
          maxConnections: maxConnections,
          enabled: true,
          endpoint: null
        };
        if (p.createEndpoint) {
          _def.uniqueEndpoint = true;
          _def.endpoint = this.addEndpoint(el, _def.def);
          _def.endpoint.deleteOnEmpty = false;
        }
        jel._jsPlumbTargetDefinitions.push(_def);
        return this;
      }
    }, {
      key: "show",
      value: function show(el, changeEndpoints) {
        return this._setVisible(el, BLOCK, changeEndpoints);
      }
    }, {
      key: "hide",
      value: function hide(el, changeEndpoints) {
        return this._setVisible(el, NONE, changeEndpoints);
      }
    }, {
      key: "_setVisible",
      value: function _setVisible(el, state, alsoChangeEndpoints) {
        var visible = state === BLOCK;
        var endpointFunc = null;
        if (alsoChangeEndpoints) {
          endpointFunc = function endpointFunc(ep) {
            ep.setVisible(visible, true, true);
          };
        }
        var id = this.getId(el);
        this._operation(el, function (jpc) {
          if (visible && alsoChangeEndpoints) {
            var oidx = jpc.sourceId === id ? 1 : 0;
            if (jpc.endpoints[oidx].isVisible()) {
              jpc.setVisible(true);
            }
          } else {
            jpc.setVisible(visible);
          }
        }, endpointFunc);
        return this;
      }
    }, {
      key: "toggleVisible",
      value: function toggleVisible(el, changeEndpoints) {
        var endpointFunc = null;
        if (changeEndpoints) {
          endpointFunc = function endpointFunc(ep) {
            var state = ep.isVisible();
            ep.setVisible(!state);
          };
        }
        this._operation(el, function (jpc) {
          var state = jpc.isVisible();
          jpc.setVisible(!state);
        }, endpointFunc);
      }
    }, {
      key: "_operation",
      value: function _operation(el, func, endpointFunc) {
        var elId = this.getId(el);
        var endpoints = this.endpointsByElement[elId];
        if (endpoints && endpoints.length) {
          for (var i = 0, ii = endpoints.length; i < ii; i++) {
            for (var j = 0, jj = endpoints[i].connections.length; j < jj; j++) {
              var retVal = func(endpoints[i].connections[j]);
              if (retVal) {
                return;
              }
            }
            if (endpointFunc) {
              endpointFunc(endpoints[i]);
            }
          }
        }
      }
    }, {
      key: "registerConnectionType",
      value: function registerConnectionType(id, type) {
        this._connectionTypes.set(id, extend({}, type));
        if (type.overlays) {
          var to = {};
          for (var i = 0; i < type.overlays.length; i++) {
            var fo = this.convertToFullOverlaySpec(type.overlays[i]);
            to[fo[1].id] = fo;
          }
          this._connectionTypes.get(id).overlays = to;
        }
      }
    }, {
      key: "registerConnectionTypes",
      value: function registerConnectionTypes(types) {
        for (var i in types) {
          this.registerConnectionType(i, types[i]);
        }
      }
    }, {
      key: "registerEndpointType",
      value: function registerEndpointType(id, type) {
        this._endpointTypes.set(id, extend({}, type));
        if (type.overlays) {
          var to = {};
          for (var i = 0; i < type.overlays.length; i++) {
            var fo = this.convertToFullOverlaySpec(type.overlays[i]);
            to[fo[1].id] = fo;
          }
          this._endpointTypes.get(id).overlays = to;
        }
      }
    }, {
      key: "registerEndpointTypes",
      value: function registerEndpointTypes(types) {
        for (var i in types) {
          this.registerEndpointType(i, types[i]);
        }
      }
    }, {
      key: "getType",
      value: function getType(id, typeDescriptor) {
        return typeDescriptor === "connection" ? this._connectionTypes.get(id) : this._endpointTypes.get(id);
      }
    }, {
      key: "importDefaults",
      value: function importDefaults(d) {
        for (var i in d) {
          this.Defaults[i] = d[i];
        }
        if (d.container) {
          this.setContainer(d.container);
        }
        return this;
      }
    }, {
      key: "restoreDefaults",
      value: function restoreDefaults() {
        this.Defaults = extend({}, this._initialDefaults);
        return this;
      }
    }, {
      key: "getManagedElements",
      value: function getManagedElements() {
        return this._managedElements;
      }
    }, {
      key: "proxyConnection",
      value: function proxyConnection(connection, index, proxyEl, proxyElId, endpointGenerator, anchorGenerator) {
        var alreadyProxied = connection.proxies[index] != null,
            proxyEp,
            originalElementId = alreadyProxied ? connection.proxies[index].originalEp.elementId : connection.endpoints[index].elementId,
            originalEndpoint = alreadyProxied ? connection.proxies[index].originalEp : connection.endpoints[index];
        if (connection.proxies[index]) {
          if (connection.proxies[index].ep.elementId === proxyElId) {
            proxyEp = connection.proxies[index].ep;
          } else {
            connection.proxies[index].ep.detachFromConnection(connection, index);
            proxyEp = this.addEndpoint(proxyEl, {
              endpoint: endpointGenerator(connection, index),
              anchor: anchorGenerator(connection, index),
              parameters: {
                isProxyEndpoint: true
              }
            });
          }
        } else {
          proxyEp = this.addEndpoint(proxyEl, {
            endpoint: endpointGenerator(connection, index),
            anchor: anchorGenerator(connection, index),
            parameters: {
              isProxyEndpoint: true
            }
          });
        }
        proxyEp.deleteOnEmpty = true;
        connection.proxies[index] = {
          ep: proxyEp,
          originalEp: originalEndpoint
        };
        this.sourceOrTargetChanged(originalElementId, proxyElId, connection, proxyEl, index);
        originalEndpoint.detachFromConnection(connection, null, true);
        proxyEp.connections = [connection];
        connection.endpoints[index] = proxyEp;
        originalEndpoint.setVisible(false);
        connection.setVisible(true);
        this.revalidate(proxyEl);
      }
    }, {
      key: "unproxyConnection",
      value: function unproxyConnection(connection, index, proxyElId) {
        if (connection.proxies == null || connection.proxies[index] == null) {
          return;
        }
        var originalElement = connection.proxies[index].originalEp.element,
            originalElementId = connection.proxies[index].originalEp.elementId;
        connection.endpoints[index] = connection.proxies[index].originalEp;
        this.sourceOrTargetChanged(proxyElId, originalElementId, connection, originalElement, index);
        connection.proxies[index].ep.detachFromConnection(connection, null);
        connection.proxies[index].originalEp.addConnection(connection);
        if (connection.isVisible()) {
          connection.proxies[index].originalEp.setVisible(true);
        }
        connection.proxies[index] = null;
        if (connection.proxies.find(function (p) {
          return p != null;
        }) == null) {
          connection.proxies.length = 0;
        }
      }
    }, {
      key: "sourceOrTargetChanged",
      value: function sourceOrTargetChanged(originalId, newId, connection, newElement, index) {
        if (index === 0) {
          if (originalId !== newId) {
            connection.sourceId = newId;
            connection.source = newElement;
            connection.updateConnectedClass();
          }
        } else if (index === 1) {
          connection.targetId = newId;
          connection.target = newElement;
          connection.updateConnectedClass();
        }
      }
    }, {
      key: "getGroup",
      value: function getGroup(groupId) {
        return this.groupManager.getGroup(groupId);
      }
    }, {
      key: "getGroupFor",
      value: function getGroupFor(el) {
        return this.groupManager.getGroupFor(el);
      }
    }, {
      key: "addGroup",
      value: function addGroup(params) {
        return this.groupManager.addGroup(params);
      }
    }, {
      key: "addToGroup",
      value: function addToGroup(group) {
        var _this$groupManager;
        for (var _len = arguments.length, el = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          el[_key - 1] = arguments[_key];
        }
        return (_this$groupManager = this.groupManager).addToGroup.apply(_this$groupManager, [group, false].concat(el));
      }
    }, {
      key: "collapseGroup",
      value: function collapseGroup(group) {
        this.groupManager.collapseGroup(group);
      }
    }, {
      key: "expandGroup",
      value: function expandGroup(group) {
        this.groupManager.expandGroup(group);
      }
    }, {
      key: "toggleGroup",
      value: function toggleGroup(group) {
        this.groupManager.toggleGroup(group);
      }
    }, {
      key: "removeGroup",
      value: function removeGroup(group, deleteMembers, manipulateView, doNotFireEvent) {
        this.groupManager.removeGroup(group, deleteMembers, manipulateView, doNotFireEvent);
      }
    }, {
      key: "removeAllGroups",
      value: function removeAllGroups(deleteMembers, manipulateView) {
        this.groupManager.removeAllGroups(deleteMembers, manipulateView, false);
      }
    }, {
      key: "removeFromGroup",
      value: function removeFromGroup(group) {
        var _this$groupManager2,
            _this9 = this;
        for (var _len2 = arguments.length, el = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          el[_key2 - 1] = arguments[_key2];
        }
        (_this$groupManager2 = this.groupManager).removeFromGroup.apply(_this$groupManager2, [group, false].concat(el));
        el.forEach(function (_el) {
          _this9.appendElement(_el, _this9.getContainer());
          _this9.updateOffset({
            recalc: true,
            elId: _this9.getId(_el)
          });
        });
      }
    }, {
      key: "paintEndpoint",
      value: function paintEndpoint(endpoint, params) {
        function findConnectionToUseForDynamicAnchor(ep) {
          var idx = 0;
          if (params.elementWithPrecedence != null) {
            for (var i = 0; i < ep.connections.length; i++) {
              if (ep.connections[i].sourceId === params.elementWithPrecedence || ep.connections[i].targetId === params.elementWithPrecedence) {
                idx = i;
                break;
              }
            }
          }
          return ep.connections[idx];
        }
        params = params || {};
        var timestamp = params.timestamp,
            recalc = !(params.recalc === false);
        if (!timestamp || endpoint.timestamp !== timestamp) {
          var info = this.viewport.getPosition(endpoint.elementId);
          var xy = params.offset ? {
            left: params.offset.x,
            top: params.offset.y
          } : {
            left: info.x,
            top: info.y
          };
          if (xy != null) {
            var ap = params.anchorLoc;
            if (ap == null) {
              var wh = [info.w, info.h],
                  anchorParams = {
                xy: [xy.left, xy.top],
                wh: wh,
                element: endpoint,
                timestamp: timestamp
              };
              if (recalc && endpoint.anchor.isDynamic && endpoint.connections.length > 0) {
                var _c3 = findConnectionToUseForDynamicAnchor(endpoint),
                    oIdx = _c3.endpoints[0] === endpoint ? 1 : 0,
                    oId = oIdx === 0 ? _c3.sourceId : _c3.targetId,
                    oInfo = this.viewport.getPosition(oId);
                anchorParams.index = oIdx === 0 ? 1 : 0;
                anchorParams.connection = _c3;
                anchorParams.txy = [oInfo.x, oInfo.y];
                anchorParams.twh = [oInfo.w, oInfo.h];
                anchorParams.tElement = _c3.endpoints[oIdx];
                anchorParams.tRotation = this.getRotation(oId);
              } else if (endpoint.connections.length > 0) {
                anchorParams.connection = endpoint.connections[0];
              }
              anchorParams.rotation = this.getRotation(endpoint.elementId);
              ap = endpoint.anchor.compute(anchorParams);
            }
            endpoint.endpoint.compute(ap, endpoint.anchor.getOrientation(endpoint), endpoint.paintStyleInUse);
            this.renderEndpoint(endpoint, endpoint.paintStyleInUse);
            endpoint.timestamp = timestamp;
            for (var i in endpoint.overlays) {
              if (endpoint.overlays.hasOwnProperty(i)) {
                var _o = endpoint.overlays[i];
                if (_o.isVisible()) {
                  endpoint.overlayPlacements[i] = this.drawOverlay(_o, endpoint.endpoint, endpoint.paintStyleInUse, endpoint.getAbsoluteOverlayPosition(_o));
                  this.paintOverlay(_o, endpoint.overlayPlacements[i], {
                    xmin: 0,
                    ymin: 0
                  });
                }
              }
            }
          }
        }
      }
    }, {
      key: "paintConnection",
      value: function paintConnection(connection, params) {
        if (!this._suspendDrawing && connection.visible !== false) {
          params = params || {};
          var timestamp = params.timestamp;
          if (timestamp != null && timestamp === connection.lastPaintedAt) {
            return;
          }
          if (timestamp == null || timestamp !== connection.lastPaintedAt) {
            this.router.computePath(connection, timestamp);
            var overlayExtents = {
              minX: Infinity,
              minY: Infinity,
              maxX: -Infinity,
              maxY: -Infinity
            };
            for (var i in connection.overlays) {
              if (connection.overlays.hasOwnProperty(i)) {
                var _o2 = connection.overlays[i];
                if (_o2.isVisible()) {
                  connection.overlayPlacements[i] = this.drawOverlay(_o2, connection.connector, connection.paintStyleInUse, connection.getAbsoluteOverlayPosition(_o2));
                  overlayExtents.minX = Math.min(overlayExtents.minX, connection.overlayPlacements[i].minX);
                  overlayExtents.maxX = Math.max(overlayExtents.maxX, connection.overlayPlacements[i].maxX);
                  overlayExtents.minY = Math.min(overlayExtents.minY, connection.overlayPlacements[i].minY);
                  overlayExtents.maxY = Math.max(overlayExtents.maxY, connection.overlayPlacements[i].maxY);
                }
              }
            }
            var lineWidth = parseFloat("" + connection.paintStyleInUse.strokeWidth || "1") / 2,
                outlineWidth = parseFloat("" + connection.paintStyleInUse.strokeWidth || "0"),
                _extents = {
              xmin: Math.min(connection.connector.bounds.minX - (lineWidth + outlineWidth), overlayExtents.minX),
              ymin: Math.min(connection.connector.bounds.minY - (lineWidth + outlineWidth), overlayExtents.minY),
              xmax: Math.max(connection.connector.bounds.maxX + (lineWidth + outlineWidth), overlayExtents.maxX),
              ymax: Math.max(connection.connector.bounds.maxY + (lineWidth + outlineWidth), overlayExtents.maxY)
            };
            this.paintConnector(connection.connector, connection.paintStyleInUse, _extents);
            for (var j in connection.overlays) {
              if (connection.overlays.hasOwnProperty(j)) {
                var _p2 = connection.overlays[j];
                if (_p2.isVisible()) {
                  this.paintOverlay(_p2, connection.overlayPlacements[j], _extents);
                }
              }
            }
          }
          connection.lastPaintedAt = timestamp;
        }
      }
    }, {
      key: "refreshEndpoint",
      value: function refreshEndpoint(endpoint) {
        if (endpoint.connections.length > 0) {
          this.addEndpointClass(endpoint, this.endpointConnectedClass);
        } else {
          this.removeEndpointClass(endpoint, this.endpointConnectedClass);
        }
        if (endpoint.isFull()) {
          this.addEndpointClass(endpoint, this.endpointFullClass);
        } else {
          this.removeEndpointClass(endpoint, this.endpointFullClass);
        }
      }
    }]);
    return JsPlumbInstance;
  }(EventGenerator);

  var DEFAULT_WIDTH = 20;
  var DEFAULT_LENGTH = 20;
  var ArrowOverlay =
  function (_Overlay) {
    _inherits(ArrowOverlay, _Overlay);
    function ArrowOverlay(instance, component, p) {
      var _this;
      _classCallCheck(this, ArrowOverlay);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(ArrowOverlay).call(this, instance, component, p));
      _this.instance = instance;
      _this.component = component;
      _defineProperty(_assertThisInitialized(_this), "width", void 0);
      _defineProperty(_assertThisInitialized(_this), "length", void 0);
      _defineProperty(_assertThisInitialized(_this), "foldback", void 0);
      _defineProperty(_assertThisInitialized(_this), "direction", void 0);
      _defineProperty(_assertThisInitialized(_this), "paintStyle", void 0);
      _defineProperty(_assertThisInitialized(_this), "type", ArrowOverlay.arrowType);
      _defineProperty(_assertThisInitialized(_this), "cachedDimensions", void 0);
      p = p || {};
      _this.width = p.width || DEFAULT_WIDTH;
      _this.length = p.length || DEFAULT_LENGTH;
      _this.direction = (p.direction || 1) < 0 ? -1 : 1;
      _this.foldback = p.foldback || 0.623;
      _this.paintStyle = p.paintStyle || {
        "strokeWidth": 1
      };
      return _this;
    }
    _createClass(ArrowOverlay, [{
      key: "draw",
      value: function draw(component, currentConnectionPaintStyle, absolutePosition) {
        if (component instanceof AbstractConnector) {
          var connector = component;
          var hxy, mid, txy, tail, cxy;
          if (this.location > 1 || this.location < 0) {
            var fromLoc = this.location < 0 ? 1 : 0;
            hxy = connector.pointAlongPathFrom(fromLoc, this.location, false);
            mid = connector.pointAlongPathFrom(fromLoc, this.location - this.direction * this.length / 2, false);
            txy = this.instance.geometry.pointOnLine(hxy, mid, this.length);
          } else if (this.location === 1) {
            hxy = connector.pointOnPath(this.location);
            mid = connector.pointAlongPathFrom(this.location, -this.length);
            txy = this.instance.geometry.pointOnLine(hxy, mid, this.length);
            if (this.direction === -1) {
              var _ = txy;
              txy = hxy;
              hxy = _;
            }
          } else if (this.location === 0) {
            txy = connector.pointOnPath(this.location);
            mid = connector.pointAlongPathFrom(this.location, this.length);
            hxy = this.instance.geometry.pointOnLine(txy, mid, this.length);
            if (this.direction === -1) {
              var __ = txy;
              txy = hxy;
              hxy = __;
            }
          } else {
            hxy = connector.pointAlongPathFrom(this.location, this.direction * this.length / 2);
            mid = connector.pointOnPath(this.location);
            txy = this.instance.geometry.pointOnLine(hxy, mid, this.length);
          }
          tail = this.instance.geometry.perpendicularLineTo(hxy, txy, this.width);
          cxy = this.instance.geometry.pointOnLine(hxy, txy, this.foldback * this.length);
          var d = {
            hxy: hxy,
            tail: tail,
            cxy: cxy
          },
              stroke = this.paintStyle.stroke || currentConnectionPaintStyle.stroke,
              fill = this.paintStyle.fill || currentConnectionPaintStyle.stroke,
              lineWidth = this.paintStyle.strokeWidth || currentConnectionPaintStyle.strokeWidth;
          return {
            component: component,
            d: d,
            "stroke-width": lineWidth,
            stroke: stroke,
            fill: fill,
            minX: Math.min(hxy.x, tail[0].x, tail[1].x),
            maxX: Math.max(hxy.x, tail[0].x, tail[1].x),
            minY: Math.min(hxy.y, tail[0].y, tail[1].y),
            maxY: Math.max(hxy.y, tail[0].y, tail[1].y)
          };
        }
      }
    }, {
      key: "updateFrom",
      value: function updateFrom(d) {}
    }]);
    return ArrowOverlay;
  }(Overlay);
  _defineProperty(ArrowOverlay, "arrowType", "Arrow");
  function isArrowOverlay(o) {
    return o.type === ArrowOverlay.arrowType;
  }
  OverlayFactory.register("Arrow", ArrowOverlay);

  var PlainArrowOverlay =
  function (_ArrowOverlay) {
    _inherits(PlainArrowOverlay, _ArrowOverlay);
    function PlainArrowOverlay(instance, component, p) {
      var _this;
      _classCallCheck(this, PlainArrowOverlay);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(PlainArrowOverlay).call(this, instance, component, p));
      _this.instance = instance;
      _defineProperty(_assertThisInitialized(_this), "type", PlainArrowOverlay.arrowType);
      _this.foldback = 1;
      return _this;
    }
    return PlainArrowOverlay;
  }(ArrowOverlay);
  _defineProperty(PlainArrowOverlay, "arrowType", "PlainArrow");
  function isPlainArrowOverlay(o) {
    return o.type === PlainArrowOverlay.arrowType;
  }
  OverlayFactory.register("PlainArrow", PlainArrowOverlay);

  var DiamondOverlay =
  function (_ArrowOverlay) {
    _inherits(DiamondOverlay, _ArrowOverlay);
    function DiamondOverlay(instance, component, p) {
      var _this;
      _classCallCheck(this, DiamondOverlay);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(DiamondOverlay).call(this, instance, component, p));
      _this.instance = instance;
      _defineProperty(_assertThisInitialized(_this), "type", DiamondOverlay.arrowType);
      _this.length = _this.length / 2;
      _this.foldback = 2;
      return _this;
    }
    return DiamondOverlay;
  }(ArrowOverlay);
  _defineProperty(DiamondOverlay, "arrowType", "Diamond");
  function isDiamondOverlay(o) {
    return o.type === DiamondOverlay.arrowType;
  }
  OverlayFactory.register("Diamond", DiamondOverlay);

  var CustomOverlay =
  function (_Overlay) {
    _inherits(CustomOverlay, _Overlay);
    function CustomOverlay(instance, component, p) {
      var _this;
      _classCallCheck(this, CustomOverlay);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(CustomOverlay).call(this, instance, component, p));
      _this.instance = instance;
      _this.component = component;
      _defineProperty(_assertThisInitialized(_this), "create", void 0);
      _defineProperty(_assertThisInitialized(_this), "type", CustomOverlay.customType);
      _this.create = p.create;
      return _this;
    }
    _createClass(CustomOverlay, [{
      key: "updateFrom",
      value: function updateFrom(d) {}
    }]);
    return CustomOverlay;
  }(Overlay);
  _defineProperty(CustomOverlay, "customType", "Custom");
  function isCustomOverlay(o) {
    return o.type === CustomOverlay.customType;
  }
  OverlayFactory.register("Custom", CustomOverlay);

  register();
  register$1();
  register$2();
  register$5();
  register$3();
  register$4();
  register$6();

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
  function sizeElement(el, x, y, w, h) {
    if (el) {
      el.style.height = h + "px";
      el.height = h;
      el.style.width = w + "px";
      el.width = w;
      el.style.left = x + "px";
      el.style.top = y + "px";
    }
  }
  function findParent(el, selector, container) {
    var pn = el;
    while (pn != null && pn !== container) {
      if (matchesSelector(pn, selector)) {
        return pn;
      } else {
        pn = pn.parentNode;
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
    return typeof el.className.baseVal === "undefined" ? el.className : el.className.baseVal;
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
  function getClass(el) {
    return _getClassName(el);
  }
  function addClass(el, clazz) {
    if (el != null && clazz != null && clazz.length > 0) {
      if (el.classList) {
        var _el$classList;
        (_el$classList = el.classList).add.apply(_el$classList, _toConsumableArray(fastTrim(clazz).split(/\s+/)));
      } else {
        _classManip(el, clazz);
      }
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
    if (el != null && clazz != null && clazz.length > 0) {
      if (el.classList) {
        var _el$classList2;
        (_el$classList2 = el.classList).remove.apply(_el$classList2, _toConsumableArray(fastTrim(clazz).split(/\s+/)));
      } else {
        _classManip(el, null, clazz);
      }
    }
  }
  function toggleClass(el, clazz) {
    if (el != null && clazz != null && clazz.length > 0) {
      if (el.classList) {
        el.classList.toggle(clazz);
      } else {
        if (this.hasClass(el, clazz)) {
          this.removeClass(el, clazz);
        } else {
          this.addClass(el, clazz);
        }
      }
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
      left: Math.round(left),
      top: Math.round(top)
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
      parts.forEach(function (p) {
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

  function _isInsideParent(instance, _el, pos) {
    var p = _el.parentNode,
        s = instance.getSize(p),
        ss = instance.getSize(_el),
        leftEdge = pos[0],
        rightEdge = leftEdge + ss[0],
        topEdge = pos[1],
        bottomEdge = topEdge + ss[1];
    return rightEdge > 0 && leftEdge < s[0] && bottomEdge > 0 && topEdge < s[1];
  }
  var CLASS_DRAG_SELECTED = "jtk-drag-selected";
  var CLASS_DRAG_ACTIVE = "jtk-drag-active";
  var CLASS_DRAGGED = "jtk-dragged";
  var CLASS_DRAG_HOVER = "jtk-drag-hover";
  var ATTR_NOT_DRAGGABLE = "jtk-not-draggable";
  var EVENT_DRAG_MOVE = "drag:move";
  var EVENT_DRAG_STOP = "drag:stop";
  var EVENT_DRAG_START = "drag:start";
  var EVENT_MOUSEDOWN$1 = "mousedown";
  var EVENT_MOUSEUP$1 = "mouseup";
  var EVENT_REVERT = "revert";
  var EVENT_ZOOM$1 = "zoom";
  var EVENT_CONNECTION_ABORT = "connection:abort";
  var EVENT_CONNECTION_DRAG = "connection:drag";
  var DragManager =
  function () {
    function DragManager(instance) {
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
      _defineProperty(this, "_filtersToAdd", []);
      this.collicat = this.instance.createDragManager({
        zoom: this.instance.currentZoom,
        css: {
          noSelect: this.instance.dragSelectClass,
          delegatedDraggable: "jtk-delegated-draggable",
          droppable: "jtk-droppable",
          draggable: "jtk-draggable",
          drag: "jtk-drag",
          selected: "jtk-drag-selected",
          active: "jtk-drag-active",
          hover: "jtk-drag-hover",
          ghostProxy: "jtk-ghost-proxy"
        },
        revert: function revert(dragEl, pos) {
          var _el = dragEl;
          return _el.parentNode != null && _el[PARENT_GROUP_KEY] && _el[PARENT_GROUP_KEY].revert ? !_isInsideParent(_this.instance, _el, pos) : false;
        }
      });
      this.instance.bind(EVENT_ZOOM$1, function (z) {
        _this.collicat.setZoom(z);
      });
    }
    _createClass(DragManager, [{
      key: "addHandler",
      value: function addHandler(handler, dragOptions) {
        var _this2 = this;
        var o = extend({
          selector: handler.selector
        }, dragOptions || {});
        this.handlers.push(handler);
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
        if (this.drag == null) {
          this.drag = this.collicat.draggable(this.instance.getContainer(), o);
          this._filtersToAdd.forEach(function (filterToAdd) {
            return _this2.drag.addFilter(filterToAdd[0], filterToAdd[1]);
          });
          this.drag.on(EVENT_REVERT, function (el) {
            _this2.instance.revalidate(el);
          });
        } else {
          this.drag.addSelector(o);
        }
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
      key: "reset",
      value: function reset() {
        this.handlers.forEach(function (handler) {
          handler.reset();
        });
        if (this.drag != null) {
          this.collicat.destroyDraggable(this.instance.getContainer());
        }
        delete this.drag;
      }
    }]);
    return DragManager;
  }();

  var ElementDragHandler =
  function () {
    function ElementDragHandler(instance) {
      _classCallCheck(this, ElementDragHandler);
      this.instance = instance;
      _defineProperty(this, "selector", "> [jtk-managed]");
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
          var redrawResult = _this.instance.setElementPosition(_el, pos.left, pos.top);
          _this.instance.fire(EVENT_DRAG_STOP, {
            el: _el,
            e: params.e,
            pos: pos,
            r: redrawResult
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
        _one(dragElement, {
          left: params.finalPos[0],
          top: params.finalPos[1]
        });
        this._dragSelectionOffsets.forEach(function (v, k) {
          if (v[1] !== params.el) {
            var pp = {
              left: params.finalPos[0] + v[0].left,
              top: params.finalPos[1] + v[0].top
            };
            _one(v[1], pp);
          }
        });
        if (this._intersectingGroups.length > 0) {
          var targetGroup = this._intersectingGroups[0].group;
          var intersectingElement = this._intersectingGroups[0].intersectingElement;
          var currentGroup = intersectingElement[PARENT_GROUP_KEY];
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
        this._groupLocations.forEach(function (groupLoc) {
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
        var finalPos = params.finalPos || params.pos;
        var elSize = this.instance.getSize(el);
        var ui = {
          left: finalPos[0],
          top: finalPos[1]
        };
        this._intersectingGroups.length = 0;
        if (this._dragOffset != null) {
          ui.left += this._dragOffset.left;
          ui.top += this._dragOffset.top;
        }
        var _one = function _one(el, bounds, e) {
          var ancestorsOfIntersectingGroups = new Set();
          _this3._groupLocations.forEach(function (groupLoc) {
            if (!ancestorsOfIntersectingGroups.has(groupLoc.group.id) && _this3.instance.geometry.intersects(bounds, groupLoc.r)) {
              if (groupLoc.group !== _this3._currentDragParentGroup) {
                _this3.instance.addClass(groupLoc.el, CLASS_DRAG_HOVER);
              }
              _this3._intersectingGroups.push({
                group: groupLoc.group,
                intersectingElement: params.drag.getDragElement(true),
                d: 0
              });
              _this3.instance.groupManager.getAncestors(groupLoc.group).forEach(function (g) {
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
              left: bounds.x,
              top: bounds.y
            }
          });
        };
        var elBounds = {
          x: ui.left,
          y: ui.top,
          w: elSize[0],
          h: elSize[1]
        };
        _one(el, elBounds, params.e);
        this._dragSelectionOffsets.forEach(function (v, k) {
          var s = _this3._dragSizes.get(k);
          var _b = {
            x: elBounds.x + v[0].left,
            y: elBounds.y + v[0].top,
            w: s[0],
            h: s[1]
          };
          v[1].style.left = _b.x + "px";
          v[1].style.top = _b.y + "px";
          _one(v[1], _b, params.e);
        });
        this._currentDragGroupOffsets.forEach(function (v, k) {
          var s = _this3._currentDragGroupSizes.get(k);
          var _b = {
            x: elBounds.x + v[0].left,
            y: elBounds.y + v[0].top,
            w: s[0],
            h: s[1]
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
        if (el._jsPlumbParentGroup) {
          this._dragOffset = this.instance.getOffset(el.offsetParent);
          this._currentDragParentGroup = el._jsPlumbParentGroup;
        }
        var cont = true;
        var nd = el.getAttribute(ATTR_NOT_DRAGGABLE);
        if (this.instance.elementsDraggable === false || nd != null && nd !== "false") {
          cont = false;
        }
        if (cont) {
          this._groupLocations.length = 0;
          this._intersectingGroups.length = 0;
          this.instance.hoverSuspended = true;
          this._dragSelectionOffsets.clear();
          this._dragSizes.clear();
          this._dragSelection.forEach(function (jel) {
            var id = _this4.instance.getId(jel);
            var off = _this4.instance.getOffset(jel);
            _this4._dragSelectionOffsets.set(id, [{
              left: off.left - elOffset.left,
              top: off.top - elOffset.top
            }, jel]);
            _this4._dragSizes.set(id, _this4.instance.getSize(jel));
          });
          var _one = function _one(_el) {
            if (!_el._isJsPlumbGroup || _this4.instance.allowNestedGroups) {
              var isNotInAGroup = !_el[PARENT_GROUP_KEY];
              var membersAreDroppable = isNotInAGroup || _el[PARENT_GROUP_KEY].dropOverride !== true;
              var isGhostOrNotConstrained = !isNotInAGroup && (_el[PARENT_GROUP_KEY].ghost || _el[PARENT_GROUP_KEY].constrain !== true);
              if (isNotInAGroup || membersAreDroppable && isGhostOrNotConstrained) {
                _this4.instance.groupManager.forEach(function (group) {
                  var elementGroup = _el[GROUP_KEY];
                  if (group.droppable !== false && group.enabled !== false && _el[GROUP_KEY] !== group && !_this4.instance.groupManager.isDescendant(group, elementGroup)) {
                    var groupEl = group.el,
                        s = _this4.instance.getSize(groupEl),
                        o = _this4.instance.getOffset(groupEl),
                        boundingRect = {
                      x: o.left,
                      y: o.top,
                      w: s[0],
                      h: s[1]
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
              e: params.e
            });
          };
          var elId = this.instance.getId(el);
          this._currentDragGroup = this._dragGroupByElementIdMap[elId];
          if (this._currentDragGroup && !this.isActiveDragGroupMember(this._currentDragGroup, el)) {
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
                left: off.left - elOffset.left,
                top: off.top - elOffset.top
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
        this._dragSelection.forEach(function (el) {
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
        var details = ElementDragHandler.decodeDragGroupSpec(this.instance, spec);
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
        els.forEach(function (el) {
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
        els.forEach(function (el) {
          var id = _this8.instance.getId(el);
          var dragGroup = _this8._dragGroupByElementIdMap[id];
          if (dragGroup != null) {
            var s = new Set();
            var p;
            var e = dragGroup.members.values();
            while (!(p = e.next()).done) {
              if (p.value.el !== el) {
                s.add(p.value);
              }
            }
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
        elementIds.forEach(function (id) {
          optional(_this9._dragGroupByElementIdMap[id]).map(function (dragGroup) {
            optional(Array.from(dragGroup.members).find(function (m) {
              return m.elId === id;
            })).map(function (member) {
              member.active = state;
            });
          });
        });
      }
    }, {
      key: "isActiveDragGroupMember",
      value: function isActiveDragGroupMember(dragGroup, el) {
        var details = Array.from(dragGroup.members).find(function (m) {
          return m.el === el;
        });
        if (details !== null) {
          return details.active === true;
        } else {
          return false;
        }
      }
    }], [{
      key: "decodeDragGroupSpec",
      value: function decodeDragGroupSpec(instance, spec) {
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
    }]);
    return ElementDragHandler;
  }();

  var FloatingAnchor =
  function (_Anchor) {
    _inherits(FloatingAnchor, _Anchor);
    function FloatingAnchor(instance, params) {
      var _this;
      _classCallCheck(this, FloatingAnchor);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(FloatingAnchor).call(this, instance, params));
      _this.instance = instance;
      _defineProperty(_assertThisInitialized(_this), "ref", void 0);
      _defineProperty(_assertThisInitialized(_this), "refCanvas", void 0);
      _defineProperty(_assertThisInitialized(_this), "size", void 0);
      _defineProperty(_assertThisInitialized(_this), "xDir", void 0);
      _defineProperty(_assertThisInitialized(_this), "yDir", void 0);
      _defineProperty(_assertThisInitialized(_this), "_lastResult", void 0);
      _this.ref = params.reference;
      _this.refCanvas = params.referenceCanvas;
      _this.size = instance.getSize(_this.refCanvas);
      _this.xDir = 0;
      _this.yDir = 0;
      _this.orientation = null;
      _this._lastResult = null;
      _this.x = 0;
      _this.y = 0;
      _this.isFloating = true;
      return _this;
    }
    _createClass(FloatingAnchor, [{
      key: "compute",
      value: function compute(params) {
        var xy = params.xy;
        this._lastResult = [xy[0] + this.size[0] / 2, xy[1] + this.size[1] / 2, 0, 0];
        return this._lastResult;
      }
    }, {
      key: "getOrientation",
      value: function getOrientation(_endpoint) {
        if (this.orientation) {
          return this.orientation;
        } else {
          var o = this.ref.getOrientation(_endpoint);
          return [Math.abs(o[0]) * this.xDir * -1, Math.abs(o[1]) * this.yDir * -1];
        }
      }
    }, {
      key: "over",
      value: function over(anchor, endpoint) {
        this.orientation = anchor.getOrientation(endpoint);
      }
    }, {
      key: "out",
      value: function out() {
        this.orientation = null;
      }
    }, {
      key: "getCurrentLocation",
      value: function getCurrentLocation(params) {
        return this._lastResult == null ? this.compute(params) : this._lastResult;
      }
    }]);
    return FloatingAnchor;
  }(Anchor);

  function _makeFloatingEndpoint(paintStyle, referenceAnchor, endpoint, referenceCanvas, sourceElement, instance, scope) {
    var floatingAnchor = new FloatingAnchor(instance, {
      reference: referenceAnchor,
      referenceCanvas: referenceCanvas
    });
    var ep = instance.newEndpoint({
      paintStyle: paintStyle,
      endpoint: endpoint,
      anchor: floatingAnchor,
      source: sourceElement,
      scope: scope
    });
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
      _defineProperty(this, "_activeDefinition", void 0);
      _defineProperty(this, "placeholderInfo", {
        id: null,
        element: null
      });
      _defineProperty(this, "floatingIndex", void 0);
      _defineProperty(this, "floatingId", void 0);
      _defineProperty(this, "floatingElement", void 0);
      _defineProperty(this, "floatingEndpoint", void 0);
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
      _defineProperty(this, "selector", ".jtk-endpoint");
      var container = instance.getContainer();
      this.mousedownHandler = this._mousedownHandler.bind(this);
      this.mouseupHandler = this._mouseupHandler.bind(this);
      instance.on(container, EVENT_MOUSEDOWN$1, "[jtk-source]", this.mousedownHandler);
      instance.on(container, EVENT_MOUSEUP$1, "[jtk-source]", this.mouseupHandler);
    }
    _createClass(EndpointDragHandler, [{
      key: "_mousedownHandler",
      value: function _mousedownHandler(e) {
        if (e.which === 3 || e.button === 2) {
          return;
        }
        var targetEl = findParent(e.target || e.srcElement, "[jtk-managed]", this.instance.getContainer());
        if (targetEl == null) {
          return;
        }
        var sourceDef = this._getSourceDefinition(targetEl, e),
            sourceElement = e.currentTarget,
            def;
        if (sourceDef) {
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
          var elxy = BrowserJsPlumbInstance.getPositionOnElement(e, targetEl, this.instance.currentZoom);
          var tempEndpointParams = {};
          extend(tempEndpointParams, def);
          tempEndpointParams.isTemporarySource = true;
          tempEndpointParams.anchor = [elxy[0], elxy[1], 0, 0];
          if (def.scope) {
            tempEndpointParams.scope = def.scope;
          }
          this.ep = this.instance.addEndpoint(targetEl, tempEndpointParams);
          this.ep.deleteOnEmpty = true;
          this._originalAnchor = def.anchor || this.instance.Defaults.anchor;
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
          var payload = {};
          if (def.extract) {
            for (var att in def.extract) {
              var v = targetEl.getAttribute(att);
              if (v) {
                payload[def.extract[att]] = v;
              }
            }
          }
          this.instance.trigger(this.ep.endpoint.canvas, EVENT_MOUSEDOWN$1, e, payload);
        }
      }
    }, {
      key: "_mouseupHandler",
      value: function _mouseupHandler(e) {
        var el = e.currentTarget || e.srcElement;
        if (el._jsPlumbOrphanedEndpoints) {
          each(el._jsPlumbOrphanedEndpoints, this.instance.maybePruneEndpoint.bind(this.instance));
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
        this.instance.appendElement(n, this.instance.getContainer());
        var id = this.instance.getId(n);
        this.instance.setPosition(n, ipco);
        n.style.width = ips[0] + "px";
        n.style.height = ips[1] + "px";
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
        this.instance.off(c, EVENT_MOUSEUP$1, this.mouseupHandler);
        this.instance.off(c, EVENT_MOUSEDOWN$1, this.mousedownHandler);
      }
    }, {
      key: "init",
      value: function init(drag) {}
    }, {
      key: "onStart",
      value: function onStart(p) {
        var _this = this;
        this.currentDropTarget = null;
        this._stopped = false;
        var dragEl = p.drag.getDragElement();
        this.endpointRepresentation = dragEl.jtk.endpoint.endpoint;
        this.ep = dragEl.jtk.endpoint;
        if (!this.ep) {
          return false;
        }
        this.jpc = this.ep.connectorSelector();
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
        var beforeDrag = this.instance.checkCondition(this.jpc == null ? "beforeDrag" : "beforeStartDetach", {
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
        if (_continue === false) {
          this._stopped = true;
          return false;
        }
        for (var i = 0; i < this.ep.connections.length; i++) {
          this.instance.setHover(this.ep, false);
        }
        this.endpointDropTargets.length = 0;
        this.ep.addClass("endpointDrag");
        this.instance.isConnectionBeingDragged = true;
        if (this.jpc && !this.ep.isFull() && this.ep.isSource) {
          this.jpc = null;
        }
        var canvasElement = this.endpointRepresentation.canvas;
        this.instance.setAttributes(canvasElement, {
          "dragId": this.placeholderInfo.id,
          "elId": this.ep.elementId
        });
        var endpointToFloat = this.ep.dragProxy || this.ep.endpoint;
        if (this.ep.dragProxy == null && this.ep.connectionType != null) {
          var aae = this.instance.deriveEndpointAndAnchorSpec(this.ep.connectionType);
          if (aae.endpoints[1]) {
            endpointToFloat = aae.endpoints[1];
          }
        }
        var centerAnchor = makeAnchorFromSpec(this.instance, "Center");
        centerAnchor.isFloating = true;
        this.floatingEndpoint = _makeFloatingEndpoint(this.ep.getPaintStyle(), centerAnchor, endpointToFloat, canvasElement, this.placeholderInfo.element, this.instance, this.ep.scope);
        var _savedAnchor = this.floatingEndpoint.anchor;
        this.floatingEndpoint.deleteOnEmpty = true;
        this.floatingElement = this.floatingEndpoint.endpoint.canvas;
        this.floatingId = this.instance.getId(this.floatingElement);
        var scope = this.ep.scope;
        var isSourceDrag = this.jpc && this.jpc.endpoints[0] === this.ep;
        var boundingRect;
        this.instance.getContainer().querySelectorAll(".jtk-endpoint[jtk-scope-" + this.ep.scope + "]").forEach(function (candidate) {
          if ((_this.jpc != null || candidate !== canvasElement) && candidate !== _this.floatingElement) {
            if (isSourceDrag && candidate.jtk.endpoint.isSource || !isSourceDrag && candidate.jtk.endpoint.isTarget) {
              var o = _this.instance.getOffset(candidate),
                  s = _this.instance.getSize(candidate);
              boundingRect = {
                x: o.left,
                y: o.top,
                w: s[0],
                h: s[1]
              };
              _this.endpointDropTargets.push({
                el: candidate,
                r: boundingRect,
                endpoint: candidate.jtk.endpoint
              });
              _this.instance.addClass(candidate, CLASS_DRAG_ACTIVE);
            }
          }
        });
        var selectors = [];
        if (!isSourceDrag) {
          selectors.push("[jtk-target][jtk-scope-" + this.ep.scope + "]");
        } else {
          selectors.push("[jtk-source][jtk-scope-" + this.ep.scope + "]");
        }
        this.instance.getContainer().querySelectorAll(selectors.join(",")).forEach(function (candidate) {
          var o = _this.instance.getOffset(candidate),
              s = _this.instance.getSize(candidate);
          boundingRect = {
            x: o.left,
            y: o.top,
            w: s[0],
            h: s[1]
          };
          var d = {
            el: candidate,
            r: boundingRect
          };
          var targetDefinitionIdx = isSourceDrag ? -1 : findWithFunction(candidate._jsPlumbTargetDefinitions, function (tdef) {
            return tdef.enabled !== false && (tdef.def.allowLoopback !== false || candidate !== _this.ep.element) && (_this._activeDefinition == null || _this._activeDefinition.def.allowLoopback !== false || candidate !== _this.ep.element);
          });
          var sourceDefinitionIdx = isSourceDrag ? findWithFunction(candidate._jsPlumbSourceDefinitions, function (sdef) {
            return sdef.enabled !== false && (sdef.def.allowLoopback !== false || candidate !== _this.ep.element) && (_this._activeDefinition == null || _this._activeDefinition.def.allowLoopback !== false || candidate !== _this.ep.element);
          }) : -1;
          if (targetDefinitionIdx !== -1) {
            if (candidate._jsPlumbTargetDefinitions[targetDefinitionIdx].def.rank != null) {
              d.rank = candidate._jsPlumbTargetDefinitions[targetDefinitionIdx].def.rank;
            }
            _this.endpointDropTargets.push(d);
            _this.instance.addClass(candidate, CLASS_DRAG_ACTIVE);
          }
          if (sourceDefinitionIdx !== -1) {
            if (candidate._jsPlumbSourceDefinitions[sourceDefinitionIdx].def.rank != null) {
              d.rank = candidate._jsPlumbSourceDefinitions[sourceDefinitionIdx].def.rank;
            }
            _this.endpointDropTargets.push(d);
            _this.instance.addClass(candidate, CLASS_DRAG_ACTIVE);
          }
        });
        this.endpointDropTargets.sort(function (a, b) {
          if (a.el[IS_GROUP_KEY] && !b.el[IS_GROUP_KEY]) {
            return 1;
          } else if (!a.el[IS_GROUP_KEY] && b.el[IS_GROUP_KEY]) {
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
        this.instance.setHover(this.ep, false);
        if (this.jpc == null) {
          this.jpc = this.instance._newConnection({
            sourceEndpoint: this.ep,
            targetEndpoint: this.floatingEndpoint,
            source: this.ep.element,
            target: this.placeholderInfo.element,
            anchors: [this.ep.anchor, this.floatingEndpoint.anchor],
            paintStyle: this.ep.connectorStyle,
            hoverPaintStyle: this.ep.connectorHoverStyle,
            connector: this.ep.connector,
            overlays: this.ep.connectorOverlays,
            type: this.ep.connectionType,
            cssClass: this.ep.connectorClass,
            hoverClass: this.ep.connectorHoverClass,
            scope: scope,
            data: beforeDrag
          });
          this.jpc.pending = true;
          this.jpc.addClass(this.instance.draggingClass);
          this.floatingEndpoint.addClass(this.instance.draggingClass);
          this.floatingEndpoint.anchor = _savedAnchor;
          this.instance.fire(EVENT_CONNECTION_DRAG, this.jpc);
        } else {
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
          var _this$instance;
          var floatingElementSize = this.instance.getSize(this.floatingElement);
          (_this$instance = this.instance).setElementPosition.apply(_this$instance, [this.placeholderInfo.element].concat(_toConsumableArray(params.pos)));
          var boundingRect = {
            x: params.pos[0],
            y: params.pos[1],
            w: floatingElementSize[0],
            h: floatingElementSize[1]
          },
              newDropTarget,
              idx,
              _cont;
          for (var i = 0; i < this.endpointDropTargets.length; i++) {
            if (this.instance.geometry.intersects(boundingRect, this.endpointDropTargets[i].r)) {
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
            this.jpc.endpoints[idx].anchor.out();
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
                newDropTarget.endpoint.endpoint[(bb ? "add" : "remove") + "Class"](this.instance.endpointDropAllowedClass);
                newDropTarget.endpoint.endpoint[(bb ? "remove" : "add") + "Class"](this.instance.endpointDropForbiddenClass);
                this.jpc.endpoints[idx].anchor.over(newDropTarget.endpoint.anchor, newDropTarget.endpoint);
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
        this.instance.getContainer().querySelectorAll(SELECTOR_DRAG_ACTIVE_OR_HOVER).forEach(function (el) {
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
          this.ep.removeClass("endpointDrag");
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
          delete this.jpc.pending;
          if (dropEndpoint != null) {
            this._maybeCleanup(dropEndpoint);
          }
        }
      }
    }, {
      key: "_getSourceDefinition",
      value: function _getSourceDefinition(fromElement, evt, ignoreFilter) {
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
      key: "_getTargetDefinition",
      value: function _getTargetDefinition(fromElement, evt) {
        var targetDef;
        if (fromElement._jsPlumbTargetDefinitions) {
          for (var i = 0; i < fromElement._jsPlumbTargetDefinitions.length; i++) {
            targetDef = fromElement._jsPlumbTargetDefinitions[i];
            if (targetDef.enabled !== false) {
              if (targetDef.def.filter) {
                var r = isString(targetDef.def.filter) ? selectorFilter(evt, fromElement, targetDef.def.filter, this.instance, targetDef.def.filterExclude) : targetDef.def.filter(evt, fromElement);
                if (r !== false) {
                  return targetDef;
                }
              } else {
                return targetDef;
              }
            }
          }
        }
      }
    }, {
      key: "_getDropEndpoint",
      value: function _getDropEndpoint(p, jpc) {
        var dropEndpoint;
        if (this.currentDropTarget.endpoint == null) {
          var targetDefinition = this.floatingIndex == null || this.floatingIndex === 1 ? this._getTargetDefinition(this.currentDropTarget.el, p.e) : null;
          if (targetDefinition == null) {
            targetDefinition = this.floatingIndex == null || this.floatingIndex === 0 ? this._getSourceDefinition(this.currentDropTarget.el, p.e, true) : null;
          }
          if (targetDefinition == null) {
            return null;
          }
          var eps = this.instance.deriveEndpointAndAnchorSpec(jpc.getType().join(" "), true);
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
          if (dropEndpoint.anchor.positionFinder != null) {
            var finalPos = p.finalPos || p.pos;
            var dropPosition = {
              left: finalPos[0],
              top: finalPos[1]
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
        var params = dropEndpoint.getParameters();
        for (var aParam in params) {
          this.jpc.setParameter(aParam, params[aParam]);
        }
        if (this.jpc.suspendedEndpoint) {
          var suspendedElementId = this.jpc.suspendedEndpoint.elementId;
          this.instance.fireMoveEvent({
            index: idx,
            originalSourceId: idx === 0 ? suspendedElementId : this.jpc.sourceId,
            newSourceId: idx === 0 ? dropEndpoint.elementId : this.jpc.sourceId,
            originalTargetId: idx === 1 ? suspendedElementId : this.jpc.targetId,
            newTargetId: idx === 1 ? dropEndpoint.elementId : this.jpc.targetId,
            originalSourceEndpoint: idx === 0 ? this.jpc.suspendedEndpoint : this.jpc.endpoints[0],
            newSourceEndpoint: idx === 0 ? dropEndpoint : this.jpc.endpoints[0],
            originalTargetEndpoint: idx === 1 ? this.jpc.suspendedEndpoint : this.jpc.endpoints[1],
            newTargetEndpoint: idx === 1 ? dropEndpoint : this.jpc.endpoints[1],
            connection: this.jpc
          }, originalEvent);
        }
        if (idx === 1) {
          this.jpc.updateConnectedClass(false);
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
          var newSourceAnchor = makeAnchorFromSpec(this.instance, this._originalAnchor, this.jpc.endpoints[0].elementId);
          this.jpc.endpoints[0].setAnchor(newSourceAnchor);
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
        return jpc.endpoints[0].isFloating() ? 0 : jpc.endpoints[1].isFloating() ? 1 : -1;
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
      _defineProperty(_assertThisInitialized(_this), "selector", "> [jtk-group] [jtk-managed]");
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
        var originalElement = params.drag.getDragElement(true);
        var originalGroup = params.el[PARENT_GROUP_KEY],
            out = _get(_getPrototypeOf(GroupDragHandler.prototype), "onStop", this).call(this, params),
            currentGroup = params.el[PARENT_GROUP_KEY];
        if (currentGroup === originalGroup) {
          this._pruneOrOrphan(params);
        } else {
          if (originalGroup.ghost) {
            var o1 = this.instance.getOffset(currentGroup.getContentArea());
            var o2 = this.instance.getOffset(originalGroup.getContentArea());
            var o = {
              left: o2.left + params.pos[0] - o1.left,
              top: o2.top + params.pos[1] - o1.top
            };
            originalElement.style.left = o.left + "px";
            originalElement.style.top = o.top + "px";
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
            leftEdge = pos[0],
            rightEdge = leftEdge + ss[0],
            topEdge = pos[1],
            bottomEdge = topEdge + ss[1];
        return rightEdge > 0 && leftEdge < s[0] && bottomEdge > 0 && topEdge < s[1];
      }
    }, {
      key: "_pruneOrOrphan",
      value: function _pruneOrOrphan(params) {
        var jel = params.el;
        var orphanedPosition = null;
        if (!this._isInsideParent(jel, params.pos)) {
          var group = params.el[PARENT_GROUP_KEY];
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
      if (l[i] == fn) break;
    }
    if (i < l.length) l.splice(i, 1);
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
    if (e == null) return [0, 0];
    var ts = _touches(e),
        t = _getTouch(ts, 0);
    return [t[prefix + "X"], t[prefix + "Y"]];
  }
  function pageLocation(e) {
    if (e == null) return [0, 0];
    return _genLoc(e, PAGE);
  }
  function _screenLocation(e) {
    return _genLoc(e, SCREEN);
  }
  function _clientLocation(e) {
    return _genLoc(e, CLIENT);
  }
  function _getTouch(touches, idx) {
    return touches.item ? touches.item(idx) : touches[idx];
  }
  function _touches(e) {
    return e.touches && e.touches.length > 0 ? e.touches : e.changedTouches && e.changedTouches.length > 0 ? e.changedTouches : e.targetTouches && e.targetTouches.length > 0 ? e.targetTouches : [e];
  }
  function _touchCount(e) {
    return _touches(e).length;
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
        var target = t;
        var pathInfo = _pi(e, t, obj, children != null);
        if (pathInfo.end != -1) {
          for (var p = 0; p < pathInfo.end; p++) {
            target = pathInfo.path[p];
            for (var i = 0; i < c.length; i++) {
              if (matchesSelector$1(target, c[i], obj)) {
                fn.apply(target, [e, target]);
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
  var SmartClickHandler = function SmartClickHandler(obj, evt, fn, children) {
    if (obj.__taSmartClicks == null) {
      var down = function down(e) {
        obj.__tad = pageLocation(e);
      },
          up = function up(e) {
        obj.__tau = pageLocation(e);
      },
          click = function click(e) {
        if (obj.__tad && obj.__tau && obj.__tad[0] === obj.__tau[0] && obj.__tad[1] === obj.__tau[1]) {
          for (var i = 0; i < obj.__taSmartClicks.length; i++) {
            obj.__taSmartClicks[i].apply(_t(e), [e]);
          }
        }
      };
      DefaultHandler(obj, EVENT_MOUSEDOWN, down, children);
      DefaultHandler(obj, EVENT_MOUSEUP, up, children);
      DefaultHandler(obj, EVENT_CLICK, click, children);
      obj.__taSmartClicks = [];
    }
    obj.__taSmartClicks.push(fn);
    fn.__taUnstore = function () {
      _d(obj.__taSmartClicks, fn);
    };
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
                contextmenu: [],
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
                  var tc = _touchCount(e);
                  for (var eventId in _tapProfiles) {
                    if (_tapProfiles.hasOwnProperty(eventId)) {
                      var p = _tapProfiles[eventId];
                      if (p.touches === tc && (p.taps === 1 || p.taps === tt.taps)) {
                        for (var i = 0; i < tt[eventId].length; i++) {
                          pathInfo = _pi(e, target, obj, tt[eventId][i][1] != null);
                          for (var pLoop = 0; pLoop < pathInfo.end; pLoop++) {
                            currentTarget = pathInfo.path[pLoop];
                            if (tt[eventId][i][1] == null || matchesSelector$1(currentTarget, tt[eventId][i][1], obj)) {
                              tt[eventId][i][0].apply(currentTarget, [e]);
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
              DefaultHandler(obj, "mousedown", down);
              DefaultHandler(obj, "mouseup", up);
            }
            obj.__taTapHandler.downSelectors.push(children);
            obj.__taTapHandler[evt].push([fn, children]);
            fn.__taUnstore = function () {
              _d(obj.__taTapHandler[evt], fn);
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
      _defineProperty(this, "smartClicks", void 0);
      params = params || {};
      this.clickThreshold = params.clickThreshold || 250;
      this.dblClickThreshold = params.dblClickThreshold || 450;
      this.mouseEnterExitHandler = MouseEnterExitHandler.generate();
      this.tapHandler = TapHandler.generate(this.clickThreshold, this.dblClickThreshold);
      this.smartClicks = params.smartClicks;
    }
    _createClass(EventManager, [{
      key: "_doBind",
      value: function _doBind(obj, evt, fn, children) {
        var _this2 = this;
        if (fn == null) return;
        _each(obj, function (_el) {
          if (_this2.smartClicks && evt === EVENT_CLICK) SmartClickHandler(_el, evt, fn, children);else if (evt === EVENT_TAP || evt === EVENT_DBL_TAP || evt === EVENT_CONTEXTMENU) {
            _this2.tapHandler(_el, evt, fn, children);
          } else if (evt === EVENT_MOUSEENTER || evt == EVENT_MOUSEEXIT) _this2.mouseEnterExitHandler(_el, evt, fn, children);else DefaultHandler(_el, evt, fn, children);
        });
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
      value: function trigger(el, event, originalEvent, payload) {
        var originalIsMouse = isMouseDevice && (typeof MouseEvent === "undefined" || originalEvent == null || originalEvent.constructor === MouseEvent);
        var eventToBind = isTouchDevice && !isMouseDevice && touchMap[event] ? touchMap[event] : event,
            bindingAMouseEvent = !(isTouchDevice && !isMouseDevice && touchMap[event]);
        var pl = pageLocation(originalEvent),
            sl = _screenLocation(originalEvent),
            cl = _clientLocation(originalEvent);
        _each(el, function (_el) {
          var evt;
          originalEvent = originalEvent || {
            screenX: sl[0],
            screenY: sl[1],
            clientX: cl[0],
            clientY: cl[1]
          };
          var _decorate = function _decorate(_evt) {
            if (payload) {
              _evt.payload = payload;
            }
          };
          var eventGenerators = {
            "TouchEvent": function TouchEvent(evt) {
              var touchList = _touchAndList(_el, pl[0], pl[1], sl[0], sl[1], cl[0], cl[1]),
                  init = evt.initTouchEvent || evt.initEvent;
              init(eventToBind, true, true, window, null, sl[0], sl[1], cl[0], cl[1], false, false, false, false, touchList, touchList, touchList, 1, 0);
            },
            "MouseEvents": function MouseEvents(evt) {
              evt.initMouseEvent(eventToBind, true, true, window, 0, sl[0], sl[1], cl[0], cl[1], false, false, false, false, 1, _el);
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

  function getOffsetRect(elem) {
    var o = offsetRelativeToRoot(elem);
    return [o.left, o.top];
  }
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
    return [el.offsetLeft, el.offsetTop];
  }
  function _getSize(el) {
    return [el.offsetWidth, el.offsetHeight];
  }
  function _setPosition(el, pos) {
    el.style.left = pos[0] + "px";
    el.style.top = pos[1] + "px";
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
  var DEFAULT_GRID_X = 10;
  var DEFAULT_GRID_Y = 10;
  var TRUE$1 = function TRUE() {
    return true;
  };
  var FALSE$1 = function FALSE() {
    return false;
  };
  var _classes = {
    delegatedDraggable: "katavorio-delegated-draggable",
    draggable: "katavorio-draggable",
    droppable: "katavorio-droppable",
    drag: "katavorio-drag",
    selected: "katavorio-drag-selected",
    active: "katavorio-drag-active",
    hover: "katavorio-drag-hover",
    noSelect: "katavorio-drag-no-select",
    ghostProxy: "katavorio-ghost-proxy",
    clonedDrag: "katavorio-clone-drag"
  };
  var _events = ["stop", "start", "drag", "drop", "over", "out", "beforeStart"];
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
    return [el.parentNode.scrollWidth, el.parentNode.scrollHeight];
  }
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
      _defineProperty(_assertThisInitialized(_this), "_downAt", void 0);
      _defineProperty(_assertThisInitialized(_this), "_posAtDown", void 0);
      _defineProperty(_assertThisInitialized(_this), "_pagePosAtDown", void 0);
      _defineProperty(_assertThisInitialized(_this), "_pageDelta", [0, 0]);
      _defineProperty(_assertThisInitialized(_this), "_moving", void 0);
      _defineProperty(_assertThisInitialized(_this), "_initialScroll", [0, 0]);
      _defineProperty(_assertThisInitialized(_this), "_size", void 0);
      _defineProperty(_assertThisInitialized(_this), "_currentParentPosition", void 0);
      _defineProperty(_assertThisInitialized(_this), "_ghostParentPosition", void 0);
      _defineProperty(_assertThisInitialized(_this), "_dragEl", void 0);
      _defineProperty(_assertThisInitialized(_this), "_multipleDrop", void 0);
      _defineProperty(_assertThisInitialized(_this), "_ghostProxyOffsets", void 0);
      _defineProperty(_assertThisInitialized(_this), "_ghostDx", void 0);
      _defineProperty(_assertThisInitialized(_this), "_ghostDy", void 0);
      _defineProperty(_assertThisInitialized(_this), "_ghostProxyParent", void 0);
      _defineProperty(_assertThisInitialized(_this), "_isConstrained", false);
      _defineProperty(_assertThisInitialized(_this), "_useGhostProxy", void 0);
      _defineProperty(_assertThisInitialized(_this), "_activeSelectorParams", void 0);
      _defineProperty(_assertThisInitialized(_this), "_availableSelectors", []);
      _defineProperty(_assertThisInitialized(_this), "_ghostProxyFunction", void 0);
      _defineProperty(_assertThisInitialized(_this), "_snapThreshold", void 0);
      _defineProperty(_assertThisInitialized(_this), "_grid", void 0);
      _defineProperty(_assertThisInitialized(_this), "_allowNegative", void 0);
      _defineProperty(_assertThisInitialized(_this), "_constrain", void 0);
      _defineProperty(_assertThisInitialized(_this), "_revertFunction", void 0);
      _defineProperty(_assertThisInitialized(_this), "_canDrag", void 0);
      _defineProperty(_assertThisInitialized(_this), "_consumeFilteredEvents", void 0);
      _defineProperty(_assertThisInitialized(_this), "_parent", void 0);
      _defineProperty(_assertThisInitialized(_this), "_ignoreZoom", void 0);
      _defineProperty(_assertThisInitialized(_this), "_filters", {});
      _defineProperty(_assertThisInitialized(_this), "_constrainRect", void 0);
      _defineProperty(_assertThisInitialized(_this), "_matchingDroppables", []);
      _defineProperty(_assertThisInitialized(_this), "_intersectingDroppables", []);
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
      _this._multipleDrop = params.multipleDrop !== false;
      _this._grid = params.grid;
      _this._allowNegative = params.allowNegative;
      _this._revertFunction = params.revert;
      _this._canDrag = params.canDrag || TRUE$1;
      _this._consumeFilteredEvents = params.consumeFilteredEvents;
      _this._parent = params.parent;
      _this._ignoreZoom = params.ignoreZoom === true;
      _this._ghostProxyParent = params.ghostProxyParent;
      if (params.ghostProxy === true) {
        _this._useGhostProxy = TRUE$1;
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
        var draggableId = _this.el.getAttribute("katavorio-draggable");
        if (draggableId == null) {
          draggableId = "" + new Date().getTime();
          _this.el.setAttribute("katavorio-draggable", draggableId);
        }
        _this._availableSelectors.push(params);
      }
      _this._snapThreshold = params.snapThreshold;
      _this._setConstrain(typeof params.constrain === "function" ? params.constrain : params.constrain || params.containment);
      _this.k.eventManager.on(_this.el, "mousedown", _this.downListener);
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
          this.k.eventManager.off(document, "mousemove", this.moveListener);
          this.k.eventManager.off(document, "mouseup", this.upListener);
          removeClass(document.body, _classes.noSelect);
          this.unmark(e);
          this.stop(e);
          this._moving = false;
          if (this.clone) {
            this._dragEl && this._dragEl.parentNode && this._dragEl.parentNode.removeChild(this._dragEl);
            this._dragEl = null;
          } else {
            if (this._revertFunction && this._revertFunction(this._dragEl, _getPosition(this._dragEl)) === true) {
              _setPosition(this._dragEl, this._posAtDown);
              this._dispatch("revert", this._dragEl);
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
                this._dragEl.style.left = _p2[0] + "px";
                this._dragEl.style.top = _p2[1] + "px";
                this._parent.appendChild(this._dragEl);
              } else {
                var b = offsetRelativeToRoot(this._elementToDrag);
                this._dragEl.style.left = b[0] + "px";
                this._dragEl.style.top = b[1] + "px";
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
              this._initialScroll = [this._dragEl.parentNode.scrollLeft, this._dragEl.parentNode.scrollTop];
            }
            this.k.eventManager.on(document, "mousemove", this.moveListener);
            this.k.eventManager.on(document, "mouseup", this.upListener);
            addClass(document.body, _classes.noSelect);
            this._dispatch("beforeStart", {
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
            var dispatchResult = this._dispatch("start", {
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
            var _pos = pageLocation(e),
                dx = _pos[0] - this._downAt[0],
                dy = _pos[1] - this._downAt[1],
                _z = this._ignoreZoom ? 1 : this.k.getZoom();
            if (this._dragEl && this._dragEl.parentNode) {
              dx += this._dragEl.parentNode.scrollLeft - this._initialScroll[0];
              dy += this._dragEl.parentNode.scrollTop - this._initialScroll[1];
            }
            dx /= _z;
            dy /= _z;
            this.moveBy(dx, dy, e);
          }
        }
      }
    }, {
      key: "mark",
      value: function mark(payload) {
        this._posAtDown = _getPosition(this._dragEl);
        this._pagePosAtDown = getOffsetRect(this._dragEl);
        this._pageDelta = [this._pagePosAtDown[0] - this._posAtDown[0], this._pagePosAtDown[1] - this._posAtDown[1]];
        this._size = _getSize(this._dragEl);
        addClass(this._dragEl, this.k.css.drag);
        var cs;
        cs = getConstrainingRectangle(this._dragEl);
        this._constrainRect = {
          w: cs[0],
          h: cs[1]
        };
        this._ghostDx = 0;
        this._ghostDy = 0;
      }
    }, {
      key: "unmark",
      value: function unmark(e) {
        if (this._isConstrained && this._useGhostProxy(this._elementToDrag, this._dragEl)) {
          this._ghostProxyOffsets = [this._dragEl.offsetLeft - this._ghostDx, this._dragEl.offsetTop - this._ghostDy];
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
        var desiredLoc = this.toGrid([this._posAtDown[0] + dx, this._posAtDown[1] + dy]),
            cPos = this._doConstrain(desiredLoc, this._dragEl, this._constrainRect, this._size);
        if (this._useGhostProxy(this.el, this._dragEl)) {
          if (desiredLoc[0] !== cPos[0] || desiredLoc[1] !== cPos[1]) {
            if (!this._isConstrained) {
              var gp = this._ghostProxyFunction(this._elementToDrag);
              addClass(gp, _classes.ghostProxy);
              if (this._ghostProxyParent) {
                this._ghostProxyParent.appendChild(gp);
                this._currentParentPosition = getOffsetRect(this._elementToDrag.parentNode);
                this._ghostParentPosition = getOffsetRect(this._ghostProxyParent);
                this._ghostDx = this._currentParentPosition[0] - this._ghostParentPosition[0];
                this._ghostDy = this._currentParentPosition[1] - this._ghostParentPosition[1];
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
        var rect = {
          x: cPos[0],
          y: cPos[1],
          w: this._size[0],
          h: this._size[1]
        },
            pageRect = {
          x: rect.x + this._pageDelta[0],
          y: rect.y + this._pageDelta[1],
          w: rect.w,
          h: rect.h
        };
        _setPosition(this._dragEl, [cPos[0] + this._ghostDx, cPos[1] + this._ghostDy]);
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
              sel = [],
              dPos = _getPosition(this._dragEl);
          if (sel.length > 0) {
            for (var i = 0; i < sel.length; i++) {
              var _p3 = _getPosition(sel[i].el);
              positions.push([sel[i].el, {
                left: _p3[0],
                top: _p3[1]
              }, sel[i]]);
            }
          } else {
            positions.push([this._dragEl, {
              left: dPos[0],
              top: dPos[1]
            }, this]);
          }
          this._dispatch("stop", {
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
      key: "notifyStart",
      value: function notifyStart(e) {
        this._dispatch("start", {
          el: this.el,
          pos: _getPosition(this._dragEl),
          e: e,
          drag: this
        });
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
      key: "_snap",
      value: function _snap(pos, gridX, gridY, thresholdX, thresholdY) {
        var _dx = Math.floor(pos[0] / gridX),
            _dxl = gridX * _dx,
            _dxt = _dxl + gridX,
            _x = Math.abs(pos[0] - _dxl) <= thresholdX ? _dxl : Math.abs(_dxt - pos[0]) <= thresholdX ? _dxt : pos[0];
        var _dy = Math.floor(pos[1] / gridY),
            _dyl = gridY * _dy,
            _dyt = _dyl + gridY,
            _y = Math.abs(pos[1] - _dyl) <= thresholdY ? _dyl : Math.abs(_dyt - pos[1]) <= thresholdY ? _dyt : pos[1];
        return [_x, _y];
      }
    }, {
      key: "resolveGrid",
      value: function resolveGrid() {
        var out = [this._grid, this._snapThreshold ? this._snapThreshold : DEFAULT_GRID_X / 2, this._snapThreshold ? this._snapThreshold : DEFAULT_GRID_Y / 2];
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
          return this._snap(pos, grid[0], grid[1], tx, ty);
        }
      }
    }, {
      key: "setUseGhostProxy",
      value: function setUseGhostProxy(val) {
        this._useGhostProxy = val ? TRUE$1 : FALSE$1;
      }
    }, {
      key: "_negativeFilter",
      value: function _negativeFilter(pos) {
        return this._allowNegative === false ? [Math.max(0, pos[0]), Math.max(0, pos[1])] : pos;
      }
    }, {
      key: "_setConstrain",
      value: function _setConstrain(value) {
        var _this2 = this;
        this._constrain = typeof value === "function" ? value : value ? function (pos, dragEl, _constrainRect, _size) {
          return _this2._negativeFilter([Math.max(0, Math.min(_constrainRect.w - _size[0], pos[0])), Math.max(0, Math.min(_constrainRect.h - _size[1], pos[1]))]);
        } : function (pos) {
          return _this2._negativeFilter(pos);
        };
      }
    }, {
      key: "setConstrain",
      value: function setConstrain(value) {
        this._setConstrain(value);
      }
    }, {
      key: "_doConstrain",
      value: function _doConstrain(pos, dragEl, _constrainRect, _size) {
        if (this._activeSelectorParams != null && this._activeSelectorParams.constrain && typeof this._activeSelectorParams.constrain === "function") {
          return this._activeSelectorParams.constrain(pos, dragEl, _constrainRect, _size);
        } else {
          return this._constrain(pos, dragEl, _constrainRect, _size);
        }
      }
    }, {
      key: "setRevert",
      value: function setRevert(fn) {
        this._revertFunction = fn;
      }
    }, {
      key: "_assignId",
      value: function _assignId(obj) {
        if (typeof obj === "function") {
          obj._katavorioId = uuid();
          return obj._katavorioId;
        } else {
          return obj;
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
        var _this3 = this;
        if (f) {
          var key = this._assignId(f);
          this._filters[key] = [function (e) {
            var t = e.srcElement || e.target;
            var m;
            if (IS.aString(f)) {
              m = matchesSelector(t, f, _this3.el);
            } else if (typeof f === "function") {
              m = f(e, _this3.el);
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
        this.k.eventManager.off(this.el, "mousedown", this.downListener);
        this.k.eventManager.off(document, "mousemove", this.moveListener);
        this.k.eventManager.off(document, "mouseup", this.upListener);
        this.downListener = null;
        this.upListener = null;
        this.moveListener = null;
      }
    }]);
    return Drag;
  }(Base);
  var DEFAULT_INPUT_FILTER_SELECTOR = "input,textarea,select,button,option";
  var Collicat =
  function () {
    function Collicat(options) {
      _classCallCheck(this, Collicat);
      _defineProperty(this, "eventManager", void 0);
      _defineProperty(this, "zoom", 1);
      _defineProperty(this, "css", {});
      _defineProperty(this, "inputFilterSelector", void 0);
      _defineProperty(this, "constrain", void 0);
      _defineProperty(this, "revert", void 0);
      options = options || {};
      this.inputFilterSelector = options.inputFilterSelector || DEFAULT_INPUT_FILTER_SELECTOR;
      this.eventManager = new EventManager();
      this.zoom = options.zoom || 1;
      var _c = options.css || {};
      extend(this.css, _c);
      this.constrain = options.constrain;
      this.revert = options.revert;
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
        if (p.constrain == null && this.constrain != null) {
          p.constrain = this.constrain;
        }
        if (p.revert == null && this.revert != null) {
          p.revert = this.revert;
        }
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
          var _p4 = this._prepareParams(params);
          var d = new Drag(el, _p4, this);
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
        while (parent != null && parent !== container) {
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
          this._proxyConnection(el, c, index, this.instance.getId(this.el), SupportedEdge.top);
        } else if (el.offsetTop + el.offsetHeight > this.el.scrollTop + this.domElement.offsetHeight) {
          this._proxyConnection(el, c, index, this.instance.getId(this.el), SupportedEdge.bottom);
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
              _this2._proxyConnection(children[i], c, 0, elId, SupportedEdge.top);
            });
            _this2.instance.select({
              target: children[i]
            }).each(function (c) {
              _this2._proxyConnection(children[i], c, 1, elId, SupportedEdge.top);
            });
          }
          else if (children[i].offsetTop + children[i].offsetHeight > _this2.el.scrollTop + _this2.domElement.offsetHeight) {
              children[i]._jsPlumbProxies = children[i]._jsPlumbProxies || [];
              _this2.instance.select({
                source: children[i]
              }).each(function (c) {
                _this2._proxyConnection(children[i], c, 0, elId, SupportedEdge.bottom);
              });
              _this2.instance.select({
                target: children[i]
              }).each(function (c) {
                _this2._proxyConnection(children[i], c, 1, elId, SupportedEdge.bottom);
              });
            } else if (children[i]._jsPlumbProxies) {
              for (var j = 0; j < children[i]._jsPlumbProxies.length; j++) {
                _this2.instance.unproxyConnection(children[i]._jsPlumbProxies[j][0], children[i]._jsPlumbProxies[j][1], elId);
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
      value: function _proxyConnection(el, conn, index, elId, edge) {
        var _this3 = this;
        this.instance.proxyConnection(conn, index, this.domElement, elId, function () {
          return _this3.deriveEndpoint(edge, index, conn.endpoints[index], conn);
        }, function () {
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
              this.instance.unproxyConnection(children[i]._jsPlumbProxies[j][0], children[i]._jsPlumbProxies[j][1], this.elId);
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
        return createElement("div", {}, o.instance.overlayClass + " " + (o.cssClass ? o.cssClass : ""));
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
          o.instance.appendElement(o.canvas, o.instance.getContainer());
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
          o.cachedDimensions = [1, 1];
        }
        return o.cachedDimensions;
      }
    }]);
    return HTMLElementOverlay;
  }();

  var SVGElementOverlay =
  function () {
    function SVGElementOverlay() {
      _classCallCheck(this, SVGElementOverlay);
    }
    _createClass(SVGElementOverlay, null, [{
      key: "ensurePath",
      value: function ensurePath(o) {
        if (o.path == null) {
          o.path = _node("path", {});
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
  }();

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
          if (useDivWrapper) {
            sizeElement(connector.canvas, xy[0], xy[1], wh[0], wh[1]);
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
          c.instance.appendElement(c.canvas, c.instance.getContainer());
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
            ep.instance.setAttribute(canvas, "jtk-scope-" + scopes[i], "true");
          }
          if (!ep.instance._suspendDrawing) {
            sizeElement(canvas, 0, 0, 1, 1);
          }
          ep.instance.appendElement(canvas, ep.instance.getContainer());
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

  var endpointMap$1 = {};
  function registerEndpointRenderer(name, fns) {
    endpointMap$1[name] = fns;
  }
  function _genLoc$1(prefix, e) {
    if (e == null) {
      return [0, 0];
    }
    var ts = _touches$1(e),
        t = _getTouch$1(ts, 0);
    return [t[prefix + "X"], t[prefix + "Y"]];
  }
  var _pageLocation = _genLoc$1.bind(null, "page");
  function _getTouch$1(touches, idx) {
    return touches.item ? touches.item(idx) : touches[idx];
  }
  function _touches$1(e) {
    var _e = e;
    return _e.touches && _e.touches.length > 0 ? _e.touches : _e.changedTouches && _e.changedTouches.length > 0 ? _e.changedTouches : _e.targetTouches && _e.targetTouches.length > 0 ? _e.targetTouches : [_e];
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
    function BrowserJsPlumbInstance(_instanceIndex, defaults, helpers) {
      var _this;
      _classCallCheck(this, BrowserJsPlumbInstance);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(BrowserJsPlumbInstance).call(this, _instanceIndex, defaults, helpers));
      _this._instanceIndex = _instanceIndex;
      _defineProperty(_assertThisInitialized(_this), "dragManager", void 0);
      _defineProperty(_assertThisInitialized(_this), "_connectorClick", void 0);
      _defineProperty(_assertThisInitialized(_this), "_connectorDblClick", void 0);
      _defineProperty(_assertThisInitialized(_this), "_endpointClick", void 0);
      _defineProperty(_assertThisInitialized(_this), "_endpointDblClick", void 0);
      _defineProperty(_assertThisInitialized(_this), "_overlayClick", void 0);
      _defineProperty(_assertThisInitialized(_this), "_overlayDblClick", void 0);
      _defineProperty(_assertThisInitialized(_this), "_connectorMouseover", void 0);
      _defineProperty(_assertThisInitialized(_this), "_connectorMouseout", void 0);
      _defineProperty(_assertThisInitialized(_this), "_endpointMouseover", void 0);
      _defineProperty(_assertThisInitialized(_this), "_endpointMouseout", void 0);
      _defineProperty(_assertThisInitialized(_this), "_overlayMouseover", void 0);
      _defineProperty(_assertThisInitialized(_this), "_overlayMouseout", void 0);
      _defineProperty(_assertThisInitialized(_this), "_elementClick", void 0);
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
      _this.dragManager = new DragManager(_assertThisInitialized(_this));
      _this.listManager = new JsPlumbListManager(_assertThisInitialized(_this));
      _this.dragManager.addHandler(new EndpointDragHandler(_assertThisInitialized(_this)));
      var groupDragOptions = {
        constrain: function constrain(desiredLoc, dragEl, constrainRect, size) {
          var x = desiredLoc[0],
              y = desiredLoc[1];
          if (dragEl[PARENT_GROUP_KEY] && dragEl[PARENT_GROUP_KEY].constrain) {
            x = Math.max(desiredLoc[0], 0);
            y = Math.max(desiredLoc[1], 0);
            x = Math.min(x, constrainRect.w - size[0]);
            y = Math.min(y, constrainRect.h - size[1]);
          }
          return [x, y];
        }
      };
      _this.dragManager.addHandler(new GroupDragHandler(_assertThisInitialized(_this)), groupDragOptions);
      _this.elementDragHandler = new ElementDragHandler(_assertThisInitialized(_this));
      _this.dragManager.addHandler(_this.elementDragHandler, defaults && defaults.dragOptions);
      var _connClick = function _connClick(event, e) {
        if (!e.defaultPrevented) {
          var connectorElement = findParent(getEventSource(e), SELECTOR_CONNECTOR, this.getContainer());
          this.fire(event, connectorElement.jtk.connector.connection, e);
        }
      };
      _this._connectorClick = _connClick.bind(_assertThisInitialized(_this), EVENT_CLICK);
      _this._connectorDblClick = _connClick.bind(_assertThisInitialized(_this), EVENT_DBL_CLICK);
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
      key: "removeElement",
      value: function removeElement(element) {
        element.parentNode && element.parentNode.removeChild(element);
      }
    }, {
      key: "appendElement",
      value: function appendElement(el, parent) {
        if (parent) {
          parent.appendChild(el);
        }
      }
    }, {
      key: "getChildElements",
      value: function getChildElements(el) {
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
        if (callback == null) {
          this.eventManager.on(el, event, callbackOrSelector);
        } else {
          this.eventManager.on(el, event, callbackOrSelector, callback);
        }
        return this;
      }
    }, {
      key: "off",
      value: function off(el, event, callback) {
        this.eventManager.off(el, event, callback);
        return this;
      }
    }, {
      key: "trigger",
      value: function trigger(el, event, originalEvent, payload) {
        this.eventManager.trigger(el, event, originalEvent, payload);
      }
    }, {
      key: "_getOffsetRelativeToRoot",
      value: function _getOffsetRelativeToRoot(el) {
        return offsetRelativeToRoot(el);
      }
    }, {
      key: "_getOffset",
      value: function _getOffset(el) {
        var jel = el;
        var container = this.getContainer();
        var out = {
          left: jel.offsetLeft,
          top: jel.offsetTop
        },
            op = el !== container && jel.offsetParent !== container ? jel.offsetParent : null,
            _maybeAdjustScroll = function _maybeAdjustScroll(offsetParent) {
          if (offsetParent != null && offsetParent !== document.body && (offsetParent.scrollTop > 0 || offsetParent.scrollLeft > 0)) {
            out.left -= offsetParent.scrollLeft;
            out.top -= offsetParent.scrollTop;
          }
        };
        while (op != null) {
          out.left += op.offsetLeft;
          out.top += op.offsetTop;
          _maybeAdjustScroll(op);
          op = op.offsetParent === container ? null : op.offsetParent;
        }
        if (container != null && (container.scrollTop > 0 || container.scrollLeft > 0)) {
          var pp = jel.offsetParent != null ? this.getStyle(jel.offsetParent, PROPERTY_POSITION) : STATIC,
              p = this.getStyle(jel, PROPERTY_POSITION);
          if (p !== ABSOLUTE && p !== FIXED && pp !== ABSOLUTE && pp !== FIXED) {
            out.left -= container.scrollLeft;
            out.top -= container.scrollTop;
          }
        }
        return out;
      }
    }, {
      key: "_getSize",
      value: function _getSize(el) {
        return [el.offsetWidth, el.offsetHeight];
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
            return nodeList.childNodes;
          }
          sel = document.querySelectorAll(ctx);
        } else {
          sel = ctx.querySelectorAll(spec);
        }
        return sel;
      }
    }, {
      key: "setPosition",
      value: function setPosition(el, p) {
        var jel = el;
        jel.style.left = p.left + "px";
        jel.style.top = p.top + "px";
      }
    }, {
      key: "setDraggable",
      value: function setDraggable(element, draggable) {
        if (draggable) {
          this.removeAttribute(element, ATTRIBUTE_NOT_DRAGGABLE);
        } else {
          this.setAttribute(element, ATTRIBUTE_NOT_DRAGGABLE, TRUE);
        }
      }
    }, {
      key: "isDraggable",
      value: function isDraggable(el) {
        var d = this.getAttribute(el, ATTRIBUTE_NOT_DRAGGABLE);
        return d == null || d === FALSE;
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
        this.eventManager.on(currentContainer, EVENT_CLICK, SELECTOR_CONNECTOR, this._connectorClick);
        this.eventManager.on(currentContainer, EVENT_DBL_CLICK, SELECTOR_CONNECTOR, this._connectorDblClick);
        this.eventManager.on(currentContainer, EVENT_CLICK, SELECTOR_ENDPOINT, this._endpointClick);
        this.eventManager.on(currentContainer, EVENT_DBL_CLICK, SELECTOR_ENDPOINT, this._endpointDblClick);
        this.eventManager.on(currentContainer, EVENT_CLICK, SELECTOR_MANAGED_ELEMENT, this._elementClick);
        this.eventManager.on(currentContainer, EVENT_MOUSEOVER, SELECTOR_CONNECTOR, this._connectorMouseover);
        this.eventManager.on(currentContainer, EVENT_MOUSEOUT, SELECTOR_CONNECTOR, this._connectorMouseout);
        this.eventManager.on(currentContainer, EVENT_MOUSEOVER, SELECTOR_ENDPOINT, this._endpointMouseover);
        this.eventManager.on(currentContainer, EVENT_MOUSEOUT, SELECTOR_ENDPOINT, this._endpointMouseout);
        this.eventManager.on(currentContainer, EVENT_MOUSEOVER, SELECTOR_OVERLAY, this._overlayMouseover);
        this.eventManager.on(currentContainer, EVENT_MOUSEOUT, SELECTOR_OVERLAY, this._overlayMouseout);
        this.eventManager.on(currentContainer, EVENT_MOUSEOVER, SELECTOR_MANAGED_ELEMENT, this._elementMouseenter);
        this.eventManager.on(currentContainer, EVENT_MOUSEOUT, SELECTOR_MANAGED_ELEMENT, this._elementMouseexit);
        this.eventManager.on(currentContainer, EVENT_MOUSEMOVE, SELECTOR_MANAGED_ELEMENT, this._elementMousemove);
      }
    }, {
      key: "_detachEventDelegates",
      value: function _detachEventDelegates() {
        var currentContainer = this.getContainer();
        if (currentContainer) {
          this.eventManager.off(currentContainer, EVENT_CLICK, this._connectorClick);
          this.eventManager.off(currentContainer, EVENT_DBL_CLICK, this._connectorDblClick);
          this.eventManager.off(currentContainer, EVENT_CLICK, this._endpointClick);
          this.eventManager.off(currentContainer, EVENT_DBL_CLICK, this._endpointDblClick);
          this.eventManager.off(currentContainer, EVENT_CLICK, this._overlayClick);
          this.eventManager.off(currentContainer, EVENT_DBL_CLICK, this._overlayDblClick);
          this.eventManager.off(currentContainer, EVENT_CLICK, this._elementClick);
          this.eventManager.off(currentContainer, EVENT_MOUSEOVER, this._connectorMouseover);
          this.eventManager.off(currentContainer, EVENT_MOUSEOUT, this._connectorMouseout);
          this.eventManager.off(currentContainer, EVENT_MOUSEOVER, this._endpointMouseover);
          this.eventManager.off(currentContainer, EVENT_MOUSEOUT, this._endpointMouseout);
          this.eventManager.off(currentContainer, EVENT_MOUSEOVER, this._overlayMouseover);
          this.eventManager.off(currentContainer, EVENT_MOUSEOUT, this._overlayMouseout);
          this.eventManager.off(currentContainer, EVENT_MOUSEENTER, this._elementMouseenter);
          this.eventManager.off(currentContainer, EVENT_MOUSEEXIT, this._elementMouseexit);
          this.eventManager.off(currentContainer, EVENT_MOUSEMOVE, this._elementMousemove);
        }
      }
    }, {
      key: "setContainer",
      value: function setContainer(newContainer) {
        this._detachEventDelegates();
        if (this.dragManager != null) {
          this.dragManager.reset();
        }
        this.setAttribute(newContainer, ATTRIBUTE_CONTAINER, uuid().replace("-", ""));
        var currentContainer = this.getContainer();
        if (currentContainer != null) {
          currentContainer.removeAttribute(ATTRIBUTE_CONTAINER);
          var children = Array.from(currentContainer.childNodes).filter(function (cn) {
            var cl = cn.classList;
            return cl && (cl.contains(CLASS_CONNECTOR) || cl.contains(CLASS_ENDPOINT) || cl.contains(CLASS_OVERLAY)) || cn.getAttribute && cn.getAttribute(ATTRIBUTE_MANAGED) != null;
          });
          children.forEach(function (el) {
            newContainer.appendChild(el);
          });
        }
        _get(_getPrototypeOf(BrowserJsPlumbInstance.prototype), "setContainer", this).call(this, newContainer);
        if (this.eventManager != null) {
          this._attachEventDelegates();
        }
        if (this.dragManager != null) {
          this.dragManager.addHandler(new EndpointDragHandler(this));
          this.dragManager.addHandler(new GroupDragHandler(this));
          this.elementDragHandler = new ElementDragHandler(this);
          this.dragManager.addHandler(this.elementDragHandler);
        }
      }
    }, {
      key: "reset",
      value: function reset(silently) {
        _get(_getPrototypeOf(BrowserJsPlumbInstance.prototype), "reset", this).call(this, silently);
        var container = this.getContainer();
        var els = container.querySelectorAll([SELECTOR_MANAGED_ELEMENT, SELECTOR_ENDPOINT, SELECTOR_CONNECTOR, SELECTOR_OVERLAY].join(","));
        els.forEach(function (el) {
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
        var _this2 = this;
        for (var _len = arguments.length, el = new Array(_len), _key = 0; _key < _len; _key++) {
          el[_key] = arguments[_key];
        }
        el.forEach(function (_el) {
          return _this2.elementDragHandler.addToDragSelection(_el);
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
        var _this3 = this;
        for (var _len2 = arguments.length, el = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          el[_key2] = arguments[_key2];
        }
        el.forEach(function (_el) {
          return _this3.elementDragHandler.removeFromDragSelection(_el);
        });
      }
    }, {
      key: "toggleDragSelection",
      value: function toggleDragSelection() {
        var _this4 = this;
        for (var _len3 = arguments.length, el = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          el[_key3] = arguments[_key3];
        }
        el.forEach(function (_el) {
          return _this4.elementDragHandler.toggleDragSelection(_el);
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
      key: "createDragManager",
      value: function createDragManager(options) {
        return new Collicat(options);
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
        } else if (isArrowOverlay(o) || isDiamondOverlay(o) || isPlainArrowOverlay(o)) {
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
        } else if (isArrowOverlay(o) || isDiamondOverlay(o) || isPlainArrowOverlay(o)) {
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
        } else if (isArrowOverlay(o) || isDiamondOverlay(o) || isPlainArrowOverlay(o)) {
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
        } else if (isArrowOverlay(o) || isDiamondOverlay(o) || isPlainArrowOverlay(o)) {
          s(o.path);
        }
      }
    }, {
      key: "reattachOverlay",
      value: function reattachOverlay(o, c) {
        if (isLabelOverlay(o)) {
          o.instance.appendElement(getLabelElement(o), this.getContainer());
        } else if (isCustomOverlay(o)) {
          o.instance.appendElement(getCustomElement(o), this.getContainer());
        } else if (isArrowOverlay(o) || isDiamondOverlay(o) || isPlainArrowOverlay(o)) {
          this.appendElement(SVGElementOverlay.ensurePath(o), c.connector.canvas);
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
        } else if (isArrowOverlay(o) || isDiamondOverlay(o) || isPlainArrowOverlay(o)) {
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
        if (o.type === LabelOverlay.labelType || o.type === CustomOverlay.customType) {
          var td = HTMLElementOverlay._getDimensions(o);
          if (td != null && td.length === 2) {
            var cxy = {
              x: 0,
              y: 0
            };
            if (absolutePosition) {
              cxy = {
                x: absolutePosition[0],
                y: absolutePosition[1]
              };
            } else if (component instanceof EndpointRepresentation) {
              var locToUse = o.location.constructor === Array ? o.location : o.endpointLocation || [o.location, o.location];
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
            var minx = cxy.x - td[0] / 2,
                miny = cxy.y - td[1] / 2;
            return {
              component: o,
              d: {
                minx: minx,
                miny: miny,
                td: td,
                cxy: cxy
              },
              minX: minx,
              maxX: minx + td[0],
              minY: miny,
              maxY: miny + td[1]
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
            if (this.hoverClass != null) {
              this[method](canvas, this.hoverClass);
            }
          }
          if (connector.connection.hoverPaintStyle != null) {
            connector.connection.paintStyleInUse = h ? connector.connection.hoverPaintStyle : connector.connection.paintStyle;
            if (!this._suspendDrawing) {
              this.paintConnection(connector.connection, connector.connection.paintStyleInUse);
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
        var renderer = endpointMap$1[ep.endpoint.getType()];
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
            if (this.hoverClass != null) {
              this[method](canvas, this.hoverClass);
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
        if (connection != null) {
          this.setEndpointHover(connection.endpoints[0], false, true);
          this.setEndpointHover(connection.endpoints[1], false, true);
          return _get(_getPrototypeOf(BrowserJsPlumbInstance.prototype), "deleteConnection", this).call(this, connection, params);
        } else {
          return false;
        }
      }
    }], [{
      key: "getPositionOnElement",
      value: function getPositionOnElement(evt, el, zoom) {
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
            cl = _pageLocation(evt),
            w = box.width || jel.offsetWidth * zoom,
            h = box.height || jel.offsetHeight * zoom,
            x = (cl[0] - left) / w,
            y = (cl[1] - top) / h;
        return [x, y];
      }
    }]);
    return BrowserJsPlumbInstance;
  }(JsPlumbInstance);

  var register$7 = function register() {
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

  var register$8 = function register() {
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
  var register$9 = function register() {
    registerEndpointRenderer("Blank", {
      makeNode: function makeNode(ep, style) {
        return _node("rect", BLANK_ATTRIBUTES);
      },
      updateNode: function updateNode(ep, node) {
        _attr(node, BLANK_ATTRIBUTES);
      }
    });
  };

  register$7();
  register$9();
  register$8();
  var _jsPlumbInstanceIndex = 0;
  function getInstanceIndex() {
    var i = _jsPlumbInstanceIndex + 1;
    _jsPlumbInstanceIndex++;
    return i;
  }
  function newInstance(defaults, helpers) {
    return new BrowserJsPlumbInstance(getInstanceIndex(), defaults, helpers);
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

  exports.BrowserJsPlumbInstance = BrowserJsPlumbInstance;
  exports.Collicat = Collicat;
  exports.Drag = Drag;
  exports.EVENT_DRAG_MOVE = EVENT_DRAG_MOVE;
  exports.EVENT_DRAG_START = EVENT_DRAG_START;
  exports.EVENT_DRAG_STOP = EVENT_DRAG_STOP;
  exports.EventManager = EventManager;
  exports.addClass = addClass;
  exports.consume = consume;
  exports.createElement = createElement;
  exports.createElementNS = createElementNS;
  exports.findParent = findParent;
  exports.getClass = getClass;
  exports.getEventSource = getEventSource;
  exports.hasClass = hasClass;
  exports.matchesSelector = matchesSelector;
  exports.newInstance = newInstance;
  exports.offsetRelativeToRoot = offsetRelativeToRoot;
  exports.pageLocation = pageLocation;
  exports.ready = ready;
  exports.registerEndpointRenderer = registerEndpointRenderer;
  exports.removeClass = removeClass;
  exports.sizeElement = sizeElement;
  exports.toggleClass = toggleClass;

  Object.defineProperty(exports, '__esModule', { value: true });

})));

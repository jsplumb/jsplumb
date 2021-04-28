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

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
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
    key: "getParams",
    value: function getParams() {
      return {
        radius: this.radius
      };
    }
  }, {
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
      return DotEndpoint.type;
    }
  }]);
  return DotEndpoint;
}(EndpointRepresentation);
_defineProperty(DotEndpoint, "type", "Dot");

var BlankEndpoint =
function (_EndpointRepresentati) {
  _inherits(BlankEndpoint, _EndpointRepresentati);
  function BlankEndpoint(endpoint, params) {
    _classCallCheck(this, BlankEndpoint);
    return _possibleConstructorReturn(this, _getPrototypeOf(BlankEndpoint).call(this, endpoint));
  }
  _createClass(BlankEndpoint, [{
    key: "getParams",
    value: function getParams() {
      return {};
    }
  }, {
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
      return BlankEndpoint.type;
    }
  }]);
  return BlankEndpoint;
}(EndpointRepresentation);
_defineProperty(BlankEndpoint, "type", "Blank");

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
    key: "getParams",
    value: function getParams() {
      return {
        width: this.width,
        height: this.height
      };
    }
  }, {
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
      return RectangleEndpoint.type;
    }
  }]);
  return RectangleEndpoint;
}(EndpointRepresentation);
_defineProperty(RectangleEndpoint, "type", "Rectangle");

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
function isNull(s) {
  return s == null;
}
function isObject(o) {
  return o == null ? false : Object.prototype.toString.call(o) === "[object Object]";
}
function isDate(o) {
  return Object.prototype.toString.call(o) === "[object Date]";
}
function isFunction(o) {
  return Object.prototype.toString.call(o) === "[object Function]";
}
function isNamedFunction(o) {
  return isFunction(o) && o.name != null && o.name.length > 0;
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
function replace(inObj, path, value) {
  if (inObj == null) {
    return;
  }
  var q = inObj,
      t = q;
  path.replace(/([^\.])+/g, function (term, lc, pos, str) {
    var array = term.match(/([^\[0-9]+){1}(\[)([0-9+])/),
        last = pos + term.length >= str.length,
        _getArray = function _getArray() {
      return t[array[1]] || function () {
        t[array[1]] = [];
        return t[array[1]];
      }();
    };
    if (last) {
      if (array) {
        _getArray()[array[3]] = value;
      } else {
        t[term] = value;
      }
    } else {
      if (array) {
        var a = _getArray();
        t = a[array[3]] || function () {
          a[array[3]] = {};
          return a[array[3]];
        }();
      } else {
        t = t[term] || function () {
          t[term] = {};
          return t[term];
        }();
      }
    }
    return "";
  });
  return inObj;
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
function forEach(a, f) {
  if (a) {
    for (var i = 0; i < a.length; i++) {
      f(a[i]);
    }
  } else {
    return null;
  }
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
function findAllWithFunction(a, f) {
  var o = [];
  if (a) {
    for (var i = 0; i < a.length; i++) {
      if (f(a[i])) {
        o.push(i);
      }
    }
  }
  return o;
}
function getWithFunction(a, f) {
  var idx = findWithFunction(a, f);
  return idx === -1 ? null : a[idx];
}
function getAllWithFunction(a, f) {
  var indexes = findAllWithFunction(a, f);
  return indexes.map(function (i) {
    return a[i];
  });
}
function getFromSetWithFunction(s, f) {
  var out = null;
  s.forEach(function (t) {
    if (f(t)) {
      out = t;
    }
  });
  return out;
}
function setToArray(s) {
  var a = [];
  s.forEach(function (t) {
    a.push(t);
  });
  return a;
}
function removeWithFunction(a, f) {
  var idx = findWithFunction(a, f);
  if (idx > -1) {
    a.splice(idx, 1);
  }
  return idx !== -1;
}
function fromArray(a) {
  if (Array.fromArray != null) {
    return Array.from(a);
  } else {
    var arr = [];
    Array.prototype.push.apply(arr, a);
    return arr;
  }
}
function remove(l, v) {
  var idx = l.indexOf(v);
  if (idx > -1) {
    l.splice(idx, 1);
  }
  return idx !== -1;
}
function addWithFunction(list, item, hashFunction) {
  if (findWithFunction(list, hashFunction) === -1) {
    list.push(item);
  }
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
function addToList(map, key, value, insertAtStart) {
  var l = map.get(key);
  if (l == null) {
    l = [];
    map.set(key, l);
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
  var radial = {
    x: point.x - center.x,
    y: point.y - center.y
  },
      cr = Math.cos(rotation / 360 * Math.PI * 2),
      sr = Math.sin(rotation / 360 * Math.PI * 2);
  return {
    x: radial.x * cr - radial.y * sr + center.x,
    y: radial.y * cr + radial.x * sr + center.y,
    cr: cr,
    sr: sr
  };
}
function rotateAnchorOrientation(orientation, rotation) {
  var r = rotatePoint({
    x: orientation[0],
    y: orientation[1]
  }, {
    x: 0,
    y: 0
  }, rotation);
  return [Math.round(r.x), Math.round(r.y)];
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
function map(obj, fn) {
  var o = [];
  for (var _i2 = 0; _i2 < obj.length; _i2++) {
    o.push(fn(obj[_i2]));
  }
  return o;
}
function mergeWithParents(type, map, parentAttribute) {
  parentAttribute = parentAttribute || "parent";
  var _def = function _def(id) {
    return id ? map[id] : null;
  };
  var _parent = function _parent(def) {
    return def ? _def(def[parentAttribute]) : null;
  };
  var _one = function _one(parent, def) {
    if (parent == null) {
      return def;
    } else {
      var overrides = ["anchor", "anchors", "cssClass", "connector", "paintStyle", "hoverPaintStyle", "endpoint", "endpoints"];
      if (def.mergeStrategy === "override") {
        Array.prototype.push.apply(overrides, ["events", "overlays"]);
      }
      var _d = merge(parent, def, [], overrides);
      return _one(_parent(parent), _d);
    }
  };
  var _getDef = function _getDef(t) {
    if (t == null) {
      return {};
    }
    if (typeof t === "string") {
      return _def(t);
    } else if (t.length) {
      var done = false,
          _i3 = 0,
          _dd;
      while (!done && _i3 < t.length) {
        _dd = _getDef(t[_i3]);
        if (_dd) {
          done = true;
        } else {
          _i3++;
        }
      }
      return _dd;
    }
  };
  var d = _getDef(type);
  if (d) {
    return _one(_parent(d), d);
  } else {
    return {};
  }
}
var logEnabled = true;
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
function isAssignableFrom(object, cls) {
  var proto = object.__proto__;
  while (proto != null) {
    if (proto instanceof cls) {
      return true;
    } else {
      proto = proto.__proto__;
    }
  }
  return false;
}
function insertSorted(value, array, comparator, sortDescending) {
  if (array.length === 0) {
    array.push(value);
  } else {
    var flip = sortDescending ? -1 : 1;
    var min = 0;
    var max = array.length;
    var index = Math.floor((min + max) / 2);
    while (max > min) {
      var c = comparator(value, array[index]) * flip;
      if (c < 0) {
        max = index;
      } else {
        min = index + 1;
      }
      index = Math.floor((min + max) / 2);
    }
    array.splice(index, 0, value);
  }
}

var segmentMultipliers = [null, [1, -1], [1, 1], [-1, 1], [-1, -1]];
var inverseSegmentMultipliers = [null, [-1, -1], [-1, 1], [1, 1], [1, -1]];
var TWO_PI = 2 * Math.PI;
function pointXYFromArray(a) {
  return {
    x: a[0],
    y: a[1]
  };
}
function gradient(p1, p2) {
  if (p2.x === p1.x) return p2.y > p1.y ? Infinity : -Infinity;else if (p2.y === p1.y) return p2.x > p1.x ? 0 : -0;else return (p2.y - p1.y) / (p2.x - p1.x);
}
function normal(p1, p2) {
  return -1 / gradient(p1, p2);
}
function lineLength(p1, p2) {
  return Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2));
}
function quadrant(p1, p2) {
  if (p2.x > p1.x) {
    return p2.y > p1.y ? 2 : 1;
  } else if (p2.x == p1.x) {
    return p2.y > p1.y ? 2 : 1;
  } else {
    return p2.y > p1.y ? 3 : 4;
  }
}
function theta(p1, p2) {
  var m = gradient(p1, p2),
      t = Math.atan(m),
      s = quadrant(p1, p2);
  if (s == 4 || s == 3) t += Math.PI;
  if (t < 0) t += 2 * Math.PI;
  return t;
}
function intersects(r1, r2) {
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
function encloses(r1, r2, allowSharedEdges) {
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
function pointOnLine(fromPoint, toPoint, distance) {
  var m = gradient(fromPoint, toPoint),
      s = quadrant(fromPoint, toPoint),
      segmentMultiplier = distance > 0 ? segmentMultipliers[s] : inverseSegmentMultipliers[s],
      theta = Math.atan(m),
      y = Math.abs(distance * Math.sin(theta)) * segmentMultiplier[1],
      x = Math.abs(distance * Math.cos(theta)) * segmentMultiplier[0];
  return {
    x: fromPoint.x + x,
    y: fromPoint.y + y
  };
}
function perpendicularLineTo(fromPoint, toPoint, length) {
  var m = gradient(fromPoint, toPoint),
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
    _defineProperty(this, "hoverClass", void 0);
    _defineProperty(this, "geometry", void 0);
    this.stub = params.stub || this.getDefaultStubs();
    this.sourceStub = isArray(this.stub) ? this.stub[0] : this.stub;
    this.targetStub = isArray(this.stub) ? this.stub[1] : this.stub;
    this.gap = params.gap || 0;
    this.sourceGap = isArray(this.gap) ? this.gap[0] : this.gap;
    this.targetGap = isArray(this.gap) ? this.gap[1] : this.gap;
    this.maxStub = Math.max(this.sourceStub, this.targetStub);
    this.cssClass = params.cssClass || "";
    this.hoverClass = params.hoverClass || "";
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
      var segment = quadrant(pointXYFromArray(params.sourcePos), pointXYFromArray(params.targetPos)),
          swapX = params.targetPos[0] < params.sourcePos[0],
          swapY = params.targetPos[1] < params.sourcePos[1],
          lw = params.strokeWidth || 1,
          so = this.instance.router.getEndpointOrientation(params.sourceEndpoint),
          to = this.instance.router.getEndpointOrientation(params.targetEndpoint),
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
      this.m = gradient({
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
        return pointOnLine({
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
      return pointOnLine(p, farAwayPoint, distance);
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
      var fractionInSegment = lineLength({
        x: out.x,
        y: out.y
      }, {
        x: this.x1,
        y: this.y1
      });
      out.d = lineLength({
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
      var m2 = Math.abs(gradient({
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
            out.push({
              x: _x1,
              y: this.y1
            });
          }
        } else if (m2 === 0 && m1 === Infinity) {
          if (this._pointLiesBetween(_y1, this.y1, this.y2) && this._pointLiesBetween(this.x1, _x1, _x2)) {
            out.push({
              x: this.x1,
              y: _y1
            });
          }
        } else {
          var X, Y;
          if (m2 === Infinity) {
            X = _x1;
            if (this._pointLiesBetween(X, this.x1, this.x2)) {
              Y = m1 * _x1 + b;
              if (this._pointLiesBetween(Y, _y1, _y2)) {
                out.push({
                  x: X,
                  y: Y
                });
              }
            }
          } else if (m2 === 0) {
            Y = _y1;
            if (this._pointLiesBetween(Y, this.y1, this.y2)) {
              X = (_y1 - b) / m1;
              if (this._pointLiesBetween(X, _x1, _x2)) {
                out.push({
                  x: X,
                  y: Y
                });
              }
            }
          } else {
            X = (b2 - b) / (m1 - m2);
            Y = m1 * X + b;
            if (this._pointLiesBetween(X, this.x1, this.x2) && this._pointLiesBetween(Y, this.y1, this.y2)) {
              out.push({
                x: X,
                y: Y
              });
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
    _defineProperty(_assertThisInitialized(_this), "type", StraightConnector.type);
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
_defineProperty(StraightConnector, "type", "Straight");

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
      return theta({
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
      var m = normal({
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
    _defineProperty(_assertThisInitialized(_this), "type", FlowchartConnector.type);
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
            "x": "h",
            "y": "w"
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
_defineProperty(FlowchartConnector, "type", "Flowchart");

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
function gradientAtPointAlongPathFrom(curve, location, distance) {
  var p = pointAlongPath(curve, location, distance);
  if (p.location > 1) p.location = 1;
  if (p.location < 0) p.location = 0;
  return gradientAtPoint(curve, p.location);
}
function perpendicularToPathAt(curve, location, length, distance) {
  distance = distance == null ? 0 : distance;
  var p = pointAlongPath(curve, location, distance),
      m = gradientAtPoint(curve, p.location),
      _theta2 = Math.atan(-1 / m),
      y = length / 2 * Math.sin(_theta2),
      x = length / 2 * Math.cos(_theta2);
  return [{
    x: p.point.x + x,
    y: p.point.y + y
  }, {
    x: p.point.x - x,
    y: p.point.y - y
  }];
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
          x = {
        x: coeffs[0][0] * t3 + coeffs[0][1] * t2 + coeffs[0][2] * _t + coeffs[0][3],
        y: coeffs[1][0] * t3 + coeffs[1][1] * t2 + coeffs[1][2] * _t + coeffs[1][3]
      };
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
function boxIntersection(x, y, w, h, curve) {
  var i = [];
  i.push.apply(i, lineIntersection(x, y, x + w, y, curve));
  i.push.apply(i, lineIntersection(x + w, y, x + w, y + h, curve));
  i.push.apply(i, lineIntersection(x + w, y + h, x, y + h, curve));
  i.push.apply(i, lineIntersection(x, y + h, x, y, curve));
  return i;
}
function boundingBoxIntersection(boundingBox, curve) {
  var i = [];
  i.push.apply(i, lineIntersection(boundingBox.x, boundingBox.y, boundingBox.x + boundingBox.w, boundingBox.y, curve));
  i.push.apply(i, lineIntersection(boundingBox.x + boundingBox.w, boundingBox.y, boundingBox.x + boundingBox.w, boundingBox.y + boundingBox.h, curve));
  i.push.apply(i, lineIntersection(boundingBox.x + boundingBox.w, boundingBox.y + boundingBox.h, boundingBox.x, boundingBox.y + boundingBox.h, curve));
  i.push.apply(i, lineIntersection(boundingBox.x, boundingBox.y + boundingBox.h, boundingBox.x, boundingBox.y, curve));
  return i;
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

var BezierConnector =
function (_AbstractBezierConnec) {
  _inherits(BezierConnector, _AbstractBezierConnec);
  function BezierConnector(instance, connection, params) {
    var _this;
    _classCallCheck(this, BezierConnector);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(BezierConnector).call(this, instance, connection, params));
    _this.connection = connection;
    _defineProperty(_assertThisInitialized(_this), "type", BezierConnector.type);
    _defineProperty(_assertThisInitialized(_this), "majorAnchor", void 0);
    _defineProperty(_assertThisInitialized(_this), "minorAnchor", void 0);
    params = params || {};
    _this.majorAnchor = params.curviness || 150;
    _this.minorAnchor = 10;
    return _this;
  }
  _createClass(BezierConnector, [{
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
  return BezierConnector;
}(AbstractBezierConnector);
_defineProperty(BezierConnector, "type", "Bezier");

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
var StateMachineConnector =
function (_AbstractBezierConnec) {
  _inherits(StateMachineConnector, _AbstractBezierConnec);
  function StateMachineConnector(instance, connection, params) {
    var _this;
    _classCallCheck(this, StateMachineConnector);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(StateMachineConnector).call(this, instance, connection, params));
    _this.connection = connection;
    _defineProperty(_assertThisInitialized(_this), "type", StateMachineConnector.type);
    _defineProperty(_assertThisInitialized(_this), "_controlPoint", void 0);
    _defineProperty(_assertThisInitialized(_this), "proximityLimit", void 0);
    _this.curviness = params.curviness || 10;
    _this.margin = params.margin || 5;
    _this.proximityLimit = params.proximityLimit || 80;
    _this.clockwise = params.orientation && params.orientation === "clockwise";
    return _this;
  }
  _createClass(StateMachineConnector, [{
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
  return StateMachineConnector;
}(AbstractBezierConnector);
_defineProperty(StateMachineConnector, "type", "StateMachine");

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
  },
  clone: function clone(epr) {
    return EndpointFactory.get(epr.endpoint, epr.getType(), epr.getParams());
  }
};

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
function att() {
  for (var _len3 = arguments.length, attName = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    attName[_key3] = arguments[_key3];
  }
  return attName.map(function (an) {
    return "[" + an + "]";
  }).join(",");
}
var SOURCE_DEFINITION_LIST = "_jsPlumbSourceDefinitions";
var TARGET_DEFINITION_LIST = "_jsPlumbTargetDefinitions";
var DEFAULT = "default";
var WILDCARD = "*";
var SOURCE = "source";
var TARGET = "target";
var BLOCK = "block";
var NONE = "none";
var SOURCE_INDEX = 0;
var TARGET_INDEX = 1;
var TRUE = "true";
var FALSE = "false";
var UNDEFINED = "undefined";
var ABSOLUTE = "absolute";
var FIXED = "fixed";
var STATIC = "static";
var ATTRIBUTE_CONTAINER = "data-jtk-container";
var ATTRIBUTE_GROUP = "data-jtk-group";
var ATTRIBUTE_GROUP_CONTENT = "data-jtk-group-content";
var ATTRIBUTE_MANAGED = "data-jtk-managed";
var ATTRIBUTE_NOT_DRAGGABLE = "data-jtk-not-draggable";
var ATTRIBUTE_SOURCE = "data-jtk-source";
var ATTRIBUTE_TABINDEX = "tabindex";
var ATTRIBUTE_TARGET = "data-jtk-target";
var ATTRIBUTE_SCOPE = "data-jtk-scope";
var ATTRIBUTE_SCOPE_PREFIX = ATTRIBUTE_SCOPE + "-";
var CHECK_CONDITION = "checkCondition";
var CHECK_DROP_ALLOWED = "checkDropAllowed";
var CLASS_CONNECTOR = "jtk-connector";
var CLASS_CONNECTOR_OUTLINE = "jtk-connector-outline";
var CLASS_CONNECTED = "jtk-connected";
var CLASS_ENDPOINT = "jtk-endpoint";
var CLASS_ENDPOINT_CONNECTED = "jtk-endpoint-connected";
var CLASS_ENDPOINT_FULL = "jtk-endpoint-full";
var CLASS_ENDPOINT_DROP_ALLOWED = "jtk-endpoint-drop-allowed";
var CLASS_ENDPOINT_DROP_FORBIDDEN = "jtk-endpoint-drop-forbidden";
var CLASS_ENDPOINT_ANCHOR_PREFIX = "jtk-endpoint-anchor";
var CLASS_GROUP_COLLAPSED = "jtk-group-collapsed";
var CLASS_GROUP_EXPANDED = "jtk-group-expanded";
var CLASS_OVERLAY = "jtk-overlay";
var CMD_ORPHAN_ALL = "orphanAll";
var CMD_HIDE = "hide";
var CMD_REMOVE_ALL = "removeAll";
var CMD_SHOW = "show";
var EVENT_CLICK = "click";
var EVENT_ANCHOR_CHANGED = "anchor:changed";
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
var EVENT_ELEMENT_TAP = "elementTap";
var EVENT_ELEMENT_DBL_TAP = "elementDblTap";
var EVENT_ELEMENT_MOUSE_MOVE = "elementMousemove";
var EVENT_ELEMENT_MOUSE_OUT = "elementMouseout";
var EVENT_ELEMENT_MOUSE_OVER = "elementMouseover";
var EVENT_ENDPOINT_CLICK = "endpointClick";
var EVENT_ENDPOINT_DBL_CLICK = "endpointDblClick";
var EVENT_ENDPOINT_TAP = "endpointTap";
var EVENT_ENDPOINT_DBL_TAP = "endpointDblTap";
var EVENT_ENDPOINT_MOUSEOUT = "endpointMouseOut";
var EVENT_ENDPOINT_MOUSEOVER = "endpointMouseOver";
var EVENT_ENDPOINT_REPLACED = "endpoint:replaced";
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
var EVENT_GROUP_ADDED = "group:add";
var EVENT_GROUP_COLLAPSE = "group:collapse";
var EVENT_GROUP_EXPAND = "group:expand";
var EVENT_GROUP_MEMBER_ADDED = "group:addMember";
var EVENT_GROUP_MEMBER_REMOVED = "group:removeMember";
var EVENT_GROUP_REMOVED = "group:remove";
var EVENT_MAX_CONNECTIONS = "maxConnections";
var EVENT_NESTED_GROUP_ADDED = "nestedGroupAdded";
var EVENT_NESTED_GROUP_REMOVED = "nestedGroupRemoved";
var EVENT_TAP = "tap";
var EVENT_UNMANAGE_ELEMENT = "unmanageElement";
var EVENT_UPDATE = "update";
var EVENT_ZOOM = "zoom";
var IS_DETACH_ALLOWED = "isDetachAllowed";
var INTERCEPT_BEFORE_DRAG = "beforeDrag";
var INTERCEPT_BEFORE_DROP = "beforeDrop";
var INTERCEPT_BEFORE_DETACH = "beforeDetach";
var INTERCEPT_BEFORE_START_DETACH = "beforeStartDetach";
var PROPERTY_POSITION = "position";
var SELECTOR_CONNECTOR = cls(CLASS_CONNECTOR);
var SELECTOR_ENDPOINT = cls(CLASS_ENDPOINT);
var SELECTOR_GROUP = att(ATTRIBUTE_GROUP);
var SELECTOR_GROUP_CONTAINER = att(ATTRIBUTE_GROUP_CONTENT);
var SELECTOR_MANAGED_ELEMENT = att(ATTRIBUTE_MANAGED);
var SELECTOR_OVERLAY = cls(CLASS_OVERLAY);
var SELECTOR_JTK_SOURCE = att(ATTRIBUTE_SOURCE);
var SELECTOR_JTK_TARGET = att(ATTRIBUTE_TARGET);

function pointSubtract(p1, p2) {
  return {
    x: p1.x - p2.x,
    y: p1.y - p2.y
  };
}

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
          o = merge(o, _t, [CSS_CLASS], setToArray(overrides));
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
    _defineProperty(_assertThisInitialized(_this), "deleted", void 0);
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
    _this._defaultType = {
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
      this.mergeParameters(t.parameters);
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
    key: "mergeParameters",
    value: function mergeParameters(p) {
      if (p != null) {
        extend(this.parameters, p);
      }
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

function isFullOverlaySpec(o) {
  return o.type != null && o.options != null;
}
function convertToFullOverlaySpec(spec) {
  var o = null;
  if (isString(spec)) {
    o = {
      type: spec,
      options: {}
    };
  } else {
    o = spec;
  }
  o.options.id = o.options.id || uuid();
  return o;
}
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
      this.fire(EVENT_CLICK, {
        e: e,
        overlay: this
      });
      var eventName = this.component instanceof Connection ? EVENT_CLICK : EVENT_ENDPOINT_CLICK;
      this._postComponentEvent(eventName, e);
    }
  }, {
    key: "dblclick",
    value: function dblclick(e) {
      this.fire(EVENT_DBL_CLICK, {
        e: e,
        overlay: this
      });
      var eventName = this.component instanceof Connection ? EVENT_DBL_CLICK : EVENT_ENDPOINT_DBL_CLICK;
      this._postComponentEvent(eventName, e);
    }
  }, {
    key: "tap",
    value: function tap(e) {
      this.fire(EVENT_TAP, {
        e: e,
        overlay: this
      });
      var eventName = this.component instanceof Connection ? EVENT_TAP : EVENT_ENDPOINT_TAP;
      this._postComponentEvent(eventName, e);
    }
  }, {
    key: "dbltap",
    value: function dbltap(e) {
      this.fire(EVENT_DBL_TAP, {
        e: e,
        overlay: this
      });
      var eventName = this.component instanceof Connection ? EVENT_DBL_TAP : EVENT_ENDPOINT_DBL_TAP;
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
    _defineProperty(_assertThisInitialized(_this), "type", LabelOverlay.type);
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
      return {
        w: 1,
        h: 1
      };
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
_defineProperty(LabelOverlay, "type", "Label");
function isLabelOverlay(o) {
  return o.type === LabelOverlay.type;
}
OverlayFactory.register("Label", LabelOverlay);

var _internalLabelOverlayId = "__label";
var TYPE_ITEM_OVERLAY = "overlay";
var LOCATION_ATTRIBUTE = "labelLocation";
var ACTION_ADD = "add";
var ACTION_REMOVE = "remove";
function _makeLabelOverlay(component, params) {
  var _params = {
    cssClass: params.cssClass,
    id: _internalLabelOverlayId,
    component: component
  },
      mergedParams = extend(_params, params);
  return new LabelOverlay(component.instance, component, mergedParams);
}
function _processOverlay(component, o) {
  var _newOverlay = null;
  if (isString(o)) {
    _newOverlay = OverlayFactory.get(component.instance, o, component, {});
  } else if (o.type != null && o.options != null) {
    var oa = o;
    var p = extend({}, oa.options);
    _newOverlay = OverlayFactory.get(component.instance, oa.type, component, p);
  } else {
    _newOverlay = o;
  }
  _newOverlay.id = _newOverlay.id || uuid();
  component.cacheTypeItem(TYPE_ITEM_OVERLAY, _newOverlay, _newOverlay.id);
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
    var o = params.overlays || [],
        oo = {};
    var defaultOverlayKey = _this.getDefaultOverlayKey();
    if (defaultOverlayKey) {
      var defaultOverlays = _this.instance.Defaults[defaultOverlayKey];
      if (defaultOverlays) {
        o.push.apply(o, _toConsumableArray(defaultOverlays));
      }
      for (var i = 0; i < o.length; i++) {
        var fo = convertToFullOverlaySpec(o[i]);
        oo[fo.options.id] = fo;
      }
    }
    _this._defaultType.overlays = oo;
    if (params.label) {
      _this.getDefaultType().overlays[_internalLabelOverlayId] = {
        type: LabelOverlay.type,
        options: {
          label: params.label,
          location: params.labelLocation || _this.defaultLabelLocation,
          id: _internalLabelOverlayId
        }
      };
    }
    return _this;
  }
  _createClass(OverlayCapableComponent, [{
    key: "addOverlay",
    value: function addOverlay(overlay) {
      var o = _processOverlay(this, overlay);
      if (this.getData && o.type === LabelOverlay.type && !isString(overlay)) {
        var d = this.getData(),
            p = overlay.options;
        if (d) {
          var locationAttribute = p.labelLocationAttribute || LOCATION_ATTRIBUTE;
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
        var params = isString(l) || isFunction(l) ? {
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
      if (v) {
        this.showOverlays();
      } else {
        this.hideOverlays();
      }
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
          if (action === ACTION_ADD) {
            this.instance.addOverlayClass(this.overlays[i], clazz);
          } else if (action === ACTION_REMOVE) {
            this.instance.removeOverlayClass(this.overlays[i], clazz);
          }
        }
      }
    }
  }, {
    key: "addClass",
    value: function addClass(clazz, dontUpdateOverlays) {
      _get(_getPrototypeOf(OverlayCapableComponent.prototype), "addClass", this).call(this, clazz);
      this._clazzManip(ACTION_ADD, clazz, dontUpdateOverlays);
    }
  }, {
    key: "removeClass",
    value: function removeClass(clazz, dontUpdateOverlays) {
      _get(_getPrototypeOf(OverlayCapableComponent.prototype), "removeClass", this).call(this, clazz);
      this._clazzManip(ACTION_REMOVE, clazz, dontUpdateOverlays);
    }
  }, {
    key: "applyType",
    value: function applyType(t, typeMap) {
      _get(_getPrototypeOf(OverlayCapableComponent.prototype), "applyType", this).call(this, t, typeMap);
      if (t.overlays) {
        var keep = {},
            i;
        for (i in t.overlays) {
          var existing = this.overlays[t.overlays[i].options.id];
          if (existing) {
            existing.updateFrom(t.overlays[i].options);
            keep[t.overlays[i].options.id] = true;
            this.instance.reattachOverlay(existing, this);
          } else {
            var c = this.getCachedTypeItem("overlay", t.overlays[i].options.id);
            if (c != null) {
              this.instance.reattachOverlay(c, this);
              c.setVisible(true);
              c.updateFrom(t.overlays[i].options);
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
    key: "equals",
    value: function equals(anchor) {
      if (!anchor) {
        return false;
      }
      var ao = this.instance.router.getAnchorOrientation(anchor),
          o = this.instance.router.getAnchorOrientation(this);
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
  }]);
  return Anchor;
}(EventGenerator);

function _distance(anchor, cx, cy, xy, wh, rotation, targetRotation) {
  var ax = xy.x + anchor.x * wh.w,
      ay = xy.y + anchor.y * wh.h,
      acx = xy.x + wh.w / 2,
      acy = xy.y + wh.h / 2;
  if (rotation != null && rotation.length > 0) {
    var rotated = anchor.instance._applyRotations([ax, ay, 0, 0], rotation);
    ax = rotated.x;
    ay = rotated.y;
  }
  return Math.sqrt(Math.pow(cx - ax, 2) + Math.pow(cy - ay, 2)) + Math.sqrt(Math.pow(acx - ax, 2) + Math.pow(acy - ay, 2));
}
var DEFAULT_ANCHOR_SELECTOR = function DEFAULT_ANCHOR_SELECTOR(xy, wh, txy, twh, rotation, targetRotation, anchors) {
  var cx = txy.x + twh.w / 2,
      cy = txy.y + twh.h / 2;
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
      var idx = findWithFunction(this.anchors, function (a) {
        return a.x === coords.x && a.y === coords.y;
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
    _defineProperty(_assertThisInitialized(_this), "type", ContinuousAnchor.type);
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
    key: "getCssClass",
    value: function getCssClass() {
      return this.cssClass;
    }
  }]);
  return ContinuousAnchor;
}(Anchor);
_defineProperty(ContinuousAnchor, "type", "Continuous");

var X_AXIS_FACES = ["left", "right"];
var Y_AXIS_FACES = ["top", "bottom"];
var AnchorLocations;
(function (AnchorLocations) {
  AnchorLocations["Assign"] = "Assign";
  AnchorLocations["AutoDefault"] = "AutoDefault";
  AnchorLocations["Bottom"] = "Bottom";
  AnchorLocations["BottomLeft"] = "BottomLeft";
  AnchorLocations["BottomRight"] = "BottomRight";
  AnchorLocations["Center"] = "Center";
  AnchorLocations["Continuous"] = "Continuous";
  AnchorLocations["ContinuousBottom"] = "ContinuousBottom";
  AnchorLocations["ContinuousLeft"] = "ContinuousLeft";
  AnchorLocations["ContinuousRight"] = "ContinuousRight";
  AnchorLocations["ContinuousTop"] = "ContinuousTop";
  AnchorLocations["ContinuousLeftRight"] = "ContinuousLeftRight";
  AnchorLocations["ContinuousTopBottom"] = "ContinuousTopBottom";
  AnchorLocations["Left"] = "Left";
  AnchorLocations["Perimeter"] = "Perimeter";
  AnchorLocations["Right"] = "Right";
  AnchorLocations["Top"] = "Top";
  AnchorLocations["TopLeft"] = "TopLeft";
  AnchorLocations["TopRight"] = "TopRight";
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
  if (isString(spec)) {
    return getNamedAnchor(instance, spec, null, elementId);
  } else if (isArray(spec)) {
    if (isPrimitiveAnchorSpec(spec)) {
      return getAnchorWithValues(instance, spec[0], spec[1], [spec[2], spec[3]], [spec[4] || 0, spec[5] || 0], elementId, spec[6]);
    } else {
      return new DynamicAnchor(instance, {
        anchors: spec,
        elementId: elementId
      });
    }
  } else {
    var sa = spec;
    return getNamedAnchor(instance, sa.type, sa.options, elementId);
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
_curryAnchor(0.5, 0, 0, -1, AnchorLocations.Top);
_curryAnchor(0.5, 1, 0, 1, AnchorLocations.Bottom);
_curryAnchor(0, 0.5, -1, 0, AnchorLocations.Left);
_curryAnchor(1, 0.5, 1, 0, AnchorLocations.Right);
_curryAnchor(0.5, 0.5, 0, 0, AnchorLocations.Center);
_curryAnchor(1, 0, 0, -1, AnchorLocations.TopRight);
_curryAnchor(1, 1, 0, 1, AnchorLocations.BottomRight);
_curryAnchor(0, 0, 0, -1, AnchorLocations.TopLeft);
_curryAnchor(0, 1, 0, 1, AnchorLocations.BottomLeft);
var DEFAULT_DYNAMIC_ANCHORS = [AnchorLocations.Top, AnchorLocations.Right, AnchorLocations.Bottom, AnchorLocations.Left];
anchorMap[AnchorLocations.AutoDefault] = function (instance, params) {
  var a = new DynamicAnchor(instance, {
    anchors: DEFAULT_DYNAMIC_ANCHORS.map(function (da) {
      return getNamedAnchor(instance, da, params);
    })
  });
  a.type = AnchorLocations.AutoDefault;
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
anchorMap[AnchorLocations.Perimeter] = function (instance, params) {
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
_curryContinuousAnchor(AnchorLocations.Continuous);
_curryContinuousAnchor(AnchorLocations.ContinuousLeft, ["left"]);
_curryContinuousAnchor(AnchorLocations.ContinuousTop, ["top"]);
_curryContinuousAnchor(AnchorLocations.ContinuousBottom, ["bottom"]);
_curryContinuousAnchor(AnchorLocations.ContinuousRight, ["right"]);
_curryContinuousAnchor(AnchorLocations.ContinuousLeft, ["left"]);
_curryContinuousAnchor(AnchorLocations.ContinuousTop, ["top"]);
_curryContinuousAnchor(AnchorLocations.ContinuousBottom, ["bottom"]);
_curryContinuousAnchor(AnchorLocations.ContinuousLeftRight, ["left", "right"]);
_curryContinuousAnchor(AnchorLocations.ContinuousTopBottom, ["top", "bottom"]);

var TYPE_ITEM_ANCHORS = "anchors";
var TYPE_ITEM_CONNECTOR = "connector";
function prepareEndpoint(conn, existing, index, anchor, element, elementId, endpoint) {
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
    var u = conn.uuids ? conn.uuids[index] : null;
    anchor = anchor != null ? anchor : conn.instance.Defaults.anchors != null ? conn.instance.Defaults.anchors[index] : conn.instance.Defaults.anchor;
    e = conn.instance._internal_newEndpoint({
      paintStyle: es,
      hoverPaintStyle: ehs,
      endpoint: ep,
      connections: [conn],
      uuid: u,
      element: element,
      scope: conn.scope,
      anchor: anchor,
      reattachConnections: conn.reattach || conn.instance.Defaults.reattachConnections,
      connectionsDetachable: conn.detachable || conn.instance.Defaults.connectionsDetachable
    });
    if (existing == null) {
      e.deleteOnEmpty = true;
    }
    conn.endpoints[index] = e;
  }
  return e;
}
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
    var sourceAnchor = params.anchors ? params.anchors[0] : params.anchor;
    var targetAnchor = params.anchors ? params.anchors[1] : params.anchor;
    instance.manage(_this.source);
    instance.manage(_this.target);
    _this.visible = true;
    _this.params = {
      cssClass: params.cssClass,
      hoverClass: params.hoverClass,
      "pointer-events": params["pointer-events"],
      overlays: params.overlays
    };
    _this.lastPaintedAt = null;
    if (params.type) {
      params.endpoints = params.endpoints || _this.instance._deriveEndpointAndAnchorSpec(params.type).endpoints;
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
    var eS = _this.makeEndpoint(true, _this.source, _this.sourceId, sourceAnchor, params.sourceEndpoint),
        eT = _this.makeEndpoint(false, _this.target, _this.targetId, targetAnchor, params.targetEndpoint);
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
      _this.instance.paintEndpoint(_this.endpoints[0], {
        timestamp: initialTimestamp
      });
      _this.instance.paintEndpoint(_this.endpoints[1], {
        timestamp: initialTimestamp
      });
    }
    _this.cost = params.cost || _this.endpoints[0].connectionCost;
    _this.directed = params.directed;
    if (params.directed == null) {
      _this.directed = _this.endpoints[0].connectionsDirected;
    }
    var _p = extend({}, _this.endpoints[1].parameters);
    extend(_p, _this.endpoints[0].parameters);
    extend(_p, _this.parameters);
    _this.parameters = _p;
    _this.paintStyleInUse = _this.getPaintStyle() || {};
    _this.setConnector(_this.endpoints[0].connector || _this.endpoints[1].connector || params.connector || _this.instance.Defaults.connector, true);
    var data = params.data == null || !IS.anObject(params.data) ? {} : params.data;
    _this.setData(data);
    var _types = ["default", _this.endpoints[0].connectionType, _this.endpoints[1].connectionType, params.type].join(" ");
    if (/[^\s]/.test(_types)) {
      _this.addType(_types, params.data);
    }
    return _this;
  }
  _createClass(Connection, [{
    key: "makeEndpoint",
    value: function makeEndpoint(isSource, el, elId, anchor, ep) {
      elId = elId || this.instance.getId(el);
      return prepareEndpoint(this, ep, isSource ? 0 : 1, anchor, el);
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
        _connector = this.getCachedTypeItem(TYPE_ITEM_CONNECTOR, typeMap.connector);
        if (_connector == null) {
          _connector = this.prepareConnector(t.connector, typeMap.connector);
          this.cacheTypeItem(TYPE_ITEM_CONNECTOR, _connector, typeMap.connector);
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
      this.endpoints = null;
      this.source = null;
      this.target = null;
      this.instance.destroyConnection(this);
      this.connector = null;
      this.deleted = true;
      _get(_getPrototypeOf(Connection.prototype), "destroy", this).call(this, force);
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
        hoverClass: this.params.hoverClass,
        "pointer-events": this.params["pointer-events"]
      },
          connector;
      if (isString(connectorSpec)) {
        connector = this.makeConnector(connectorSpec, connectorArgs);
      } else {
        var co = connectorSpec;
        connector = this.makeConnector(co.type, merge(co.options, connectorArgs));
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
          this.cacheTypeItem(TYPE_ITEM_CONNECTOR, connector, typeId);
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
          _new = prepareEndpoint(this, null, idx, null, current.element, elId, endpointDef);
      this.endpoints[idx] = _new;
      ebe.splice(_idx, 1, _new);
      current.detachFromConnection(this);
      this.instance.deleteEndpoint(current);
      this.instance.fire(EVENT_ENDPOINT_REPLACED, {
        previous: current,
        current: _new
      });
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
    _defineProperty(_assertThisInitialized(_this), "proxiedBy", void 0);
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
      connector: params.connector
    });
    _this.enabled = !(params.enabled === false);
    _this.visible = true;
    _this.element = params.element;
    _this.uuid = params.uuid;
    _this.portId = params.portId;
    _this.elementId = params.elementId;
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
    _this.isSource = params.isSource || false;
    _this.isTemporarySource = params.isTemporarySource || false;
    _this.isTarget = params.isTarget || false;
    _this.connections = params.connections || [];
    _this.scope = params.scope || instance.defaultScope;
    _this.timestamp = null;
    _this.reattachConnections = params.reattachConnections || instance.Defaults.reattachConnections;
    _this.connectionsDetachable = instance.Defaults.connectionsDetachable;
    if (params.connectionsDetachable === false) {
      _this.connectionsDetachable = false;
    }
    _this.dragAllowedWhenFull = params.dragAllowedWhenFull !== false;
    if (params.onMaxConnections) {
      _this.bind(EVENT_MAX_CONNECTIONS, params.onMaxConnections);
    }
    var ep = params.endpoint || params.existingEndpoint || instance.Defaults.endpoint;
    _this.setEndpoint(ep);
    if (params.preparedAnchor != null) {
      _this.setPreparedAnchor(params.preparedAnchor);
    } else {
      var anchorParamsToUse = params.anchor ? params.anchor : params.anchors ? params.anchors : instance.Defaults.anchor || "Top";
      _this.setAnchor(anchorParamsToUse);
    }
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
      a.bind(EVENT_ANCHOR_CHANGED, function (currentAnchor) {
        _this2.fire(EVENT_ANCHOR_CHANGED, {
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
      var wasEmpty = this.connections.length === 0;
      this.connections.push(conn);
      if (wasEmpty) {
        this.addClass(this.instance.endpointConnectedClass);
      }
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
    value: function detachFrom(otherEndpoint) {
      var c = [];
      for (var i = 0; i < this.connections.length; i++) {
        if (this.connections[i].endpoints[1] === otherEndpoint || this.connections[i].endpoints[0] === otherEndpoint) {
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
      if (v) {
        this.showOverlays();
      } else {
        this.hideOverlays();
      }
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
    value: function isConnectedTo(otherEndpoint) {
      var found = false;
      if (otherEndpoint) {
        for (var i = 0; i < this.connections.length; i++) {
          if (this.connections[i].endpoints[1] === otherEndpoint || this.connections[i].endpoints[0] === otherEndpoint) {
            found = true;
            break;
          }
        }
      }
      return found;
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
      var endpointArgs = {
        cssClass: this.cssClass,
        endpoint: this
      };
      var endpoint;
      if (isAssignableFrom(ep, EndpointRepresentation)) {
        var epr = ep;
        endpoint = EndpointFactory.clone(epr);
      } else if (isString(ep)) {
        endpoint = EndpointFactory.get(this, ep, endpointArgs);
      } else {
        var fep = ep;
        endpointArgs = merge(fep.options, endpointArgs);
        endpoint = EndpointFactory.get(this, fep.type, endpointArgs);
      }
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
    _defineProperty(_assertThisInitialized(_this), "manager", void 0);
    _defineProperty(_assertThisInitialized(_this), "id", void 0);
    _defineProperty(_assertThisInitialized(_this), "elId", void 0);
    var jel = _this.el;
    jel._isJsPlumbGroup = true;
    jel._jsPlumbGroup = _assertThisInitialized(_this);
    _this.elId = instance.getId(el);
    _this.revert = options.revert !== false;
    _this.droppable = options.droppable !== false;
    _this.ghost = options.ghost === true;
    _this.enabled = options.enabled !== false;
    _this.orphan = options.orphan === true;
    _this.prune = _this.orphan !== true && options.prune === true;
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
      return this.anchor || ContinuousAnchor.type;
    }
  }, {
    key: "getEndpoint",
    value: function getEndpoint(conn, endpointIndex) {
      return this.endpoint || {
        type: DotEndpoint.type,
        options: {
          radius: 10
        }
      };
    }
  }, {
    key: "add",
    value: function add(_el, doNotFireEvent) {
      var dragArea = this.getContentArea();
      var __el = _el;
      if (__el._jsPlumbParentGroup != null) {
        if (__el._jsPlumbParentGroup === this) {
          return;
        } else {
          __el._jsPlumbParentGroup.remove(_el, true, doNotFireEvent, false);
        }
      }
      __el._jsPlumbParentGroup = this;
      this.children.push(new UINode(this.instance, _el));
      this.instance._appendElement(__el, dragArea);
      this.manager._updateConnectionsForGroup(this);
    }
  }, {
    key: "resolveNode",
    value: function resolveNode(el) {
      return el == null ? null : getWithFunction(this.children, function (u) {
        return u.el === el;
      });
    }
  }, {
    key: "remove",
    value: function remove(el, manipulateDOM, doNotFireEvent, doNotUpdateConnections, targetGroup) {
      var uiNode = this.resolveNode(el);
      if (uiNode != null) {
        this._doRemove(uiNode, manipulateDOM, doNotFireEvent, doNotUpdateConnections, targetGroup);
      }
    }
  }, {
    key: "_doRemove",
    value: function _doRemove(child, manipulateDOM, doNotFireEvent, doNotUpdateConnections, targetGroup) {
      var __el = child.el;
      delete __el._jsPlumbParentGroup;
      removeWithFunction(this.children, function (e) {
        return e === child;
      });
      if (manipulateDOM) {
        try {
          this.getContentArea().removeChild(__el);
        } catch (e) {
          log("Could not remove element from Group " + e);
        }
      }
      if (!doNotFireEvent) {
        var p = {
          group: this,
          el: __el
        };
        if (targetGroup) {
          p.targetGroup = targetGroup;
        }
        this.instance.fire(EVENT_GROUP_MEMBER_REMOVED, p);
      }
      if (!doNotUpdateConnections) {
        this.manager._updateConnectionsForGroup(this);
      }
    }
  }, {
    key: "removeAll",
    value: function removeAll(manipulateDOM, doNotFireEvent) {
      for (var i = 0, l = this.children.length; i < l; i++) {
        var child = this.children[0];
        this._doRemove(child, manipulateDOM, doNotFireEvent, true);
        this.instance.unmanage(child.el, true);
      }
      this.children.length = 0;
      this.manager._updateConnectionsForGroup(this);
    }
  }, {
    key: "orphanAll",
    value: function orphanAll() {
      var orphanedPositions = {};
      for (var i = 0; i < this.children.length; i++) {
        var newPosition = this.manager.orphan(this.children[i].el);
        orphanedPositions[newPosition[0]] = newPosition[1];
      }
      this.children.length = 0;
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
        var groupElId = this.instance.getId(group.el);
        var entry = this.instance.getManagedElements()[groupElId];
        entry.group = this.elId;
        var elpos = this.instance.getOffsetRelativeToRoot(group.el);
        var cpos = this.collapsed ? this.instance.getOffsetRelativeToRoot(this.el) : this.instance.getOffsetRelativeToRoot(this.getContentArea());
        group.el._jsPlumbParentGroup = this;
        this.children.push(group);
        this.instance._appendElement(group.el, this.getContentArea());
        group.group = this;
        var newPosition = {
          x: elpos.x - cpos.x,
          y: elpos.y - cpos.y
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
        var jel = group.el;
        var d = this.getContentArea();
        if (d === jel.parentNode) {
          d.removeChild(group.el);
        }
        var groupElId = this.instance.getId(group.el);
        var entry = this.instance.getManagedElements()[groupElId];
        if (entry) {
          delete entry.group;
        }
        this.children = this.children.filter(function (cg) {
          return cg.id !== group.id;
        });
        delete group.group;
        delete jel._jsPlumbParentGroup;
        this.instance.fire(EVENT_NESTED_GROUP_REMOVED, {
          parent: this,
          child: group
        });
      }
    }
  }, {
    key: "getGroups",
    value: function getGroups() {
      return this.children.filter(function (cg) {
        return cg.constructor === UIGroup;
      });
    }
  }, {
    key: "getNodes",
    value: function getNodes() {
      return this.children.filter(function (cg) {
        return cg.constructor === UINode;
      });
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
      var originalElement = p.originalEndpoint.element,
          originalGroup = _this.getGroupFor(originalElement),
          newEndpoint = p.connection.endpoints[p.index],
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
      var jel = params.el;
      if (this.groupMap[params.id] != null) {
        throw new Error("cannot create Group [" + params.id + "]; a Group with that ID exists");
      }
      if (jel._isJsPlumbGroup != null) {
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
      forEach(actualGroup.children, function (uiNode) {
        var entry = _this2.instance.getManagedElements()[_this2.instance.getId(uiNode.el)];
        if (entry) {
          delete entry.group;
        }
      });
      if (deleteMembers) {
        forEach(actualGroup.getGroups(), function (cg) {
          return _this2.removeGroup(cg, deleteMembers, manipulateView);
        });
        actualGroup.removeAll(manipulateView, doNotFireEvent);
      } else {
        if (actualGroup.group) {
          forEach(actualGroup.children, function (c) {
            return actualGroup.group.add(c.el);
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
          pos.x += groupPos.x;
          pos.y += groupPos.y;
          group.group.getContentArea().appendChild(el);
        } else {
          this.instance._appendElement(el, this.instance.getContainer());
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
      var members = group.children.slice().map(function (cn) {
        return cn.el;
      });
      var childMembers = [];
      forEach(members, function (member) {
        Array.prototype.push.apply(childMembers, _this3.instance.getSelector(member, SELECTOR_MANAGED_ELEMENT));
      });
      Array.prototype.push.apply(members, childMembers);
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
      if (otherEl._jsPlumbParentGroup && !otherEl._jsPlumbParentGroup.proxied && otherEl._jsPlumbParentGroup.collapsed) {
        return false;
      }
      var es = conn.endpoints[0].element,
          esg = es._jsPlumbParentGroup,
          esgcp = esg != null ? esg.collapseParent || esg : null,
          et = conn.endpoints[1].element,
          etg = et._jsPlumbParentGroup,
          etgcp = etg != null ? etg.collapseParent || etg : null;
      if (esgcp == null || etgcp == null || esgcp.id !== etgcp.id) {
        var groupEl = group.el,
            groupElId = this.instance.getId(groupEl);
        this.instance.proxyConnection(conn, index, groupEl,
        function (conn, index) {
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
      this.instance.unproxyConnection(c, index);
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
          forEach(actualGroup.getGroups(), function (cg) {
            _this4.cascadeCollapse(actualGroup, cg, collapsedConnectionIds);
          });
        }
        this.instance.revalidate(groupEl);
        this.repaintGroup(actualGroup);
        this.instance.fire(EVENT_GROUP_COLLAPSE, {
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
      forEach(targetGroup.getGroups(), function (cg) {
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
              forEach(group.connections.internal, function (c) {
                return c.setVisible(false);
              });
              forEach(group.getGroups(), _expandNestedGroup);
            } else {
              _this6.expandGroup(group, doNotFireEvent);
            }
          };
          forEach(actualGroup.getGroups(), _expandNestedGroup);
        }
        this.instance.revalidate(groupEl);
        this.repaintGroup(actualGroup);
        if (!doNotFireEvent) {
          this.instance.fire(EVENT_GROUP_EXPAND, {
            group: actualGroup
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
      this.repaintGroup(targetGroup);
      this.instance.fire(EVENT_GROUP_EXPAND, {
        group: targetGroup
      });
      forEach(targetGroup.getGroups(), function (cg) {
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
        this.instance.revalidate(m[i].el);
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
          var jel = el;
          var isGroup = jel._isJsPlumbGroup != null,
              droppingGroup = jel._jsPlumbGroup;
          var currentGroup = jel._jsPlumbParentGroup;
          if (currentGroup !== actualGroup) {
            var entry = _this8.instance.manage(el);
            var elpos = _this8.instance.getOffset(el);
            var cpos = actualGroup.collapsed ? _this8.instance.getOffsetRelativeToRoot(groupEl) : _this8.instance.getOffset(actualGroup.getContentArea());
            entry.group = actualGroup.elId;
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
                if (c.endpoints[oidx].element._jsPlumbGroup === actualGroup) {
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
              x: elpos.x - cpos.x,
              y: elpos.y - cpos.y
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
        forEach(el, _one);
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
          var entry = _this9.instance.getManagedElements()[_this9.instance.getId(_el)];
          if (entry) {
            delete entry.group;
          }
        };
        for (var _len2 = arguments.length, el = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          el[_key2 - 2] = arguments[_key2];
        }
        forEach(el, _one);
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
        var childGroups = g.getGroups();
        d.push.apply(d, _toConsumableArray(childGroups));
        forEach(childGroups, _one);
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
      var rotated = rotatePoint({
        x: x,
        y: y
      }, element.c, element.r);
      x = rotated.x;
      y = rotated.y;
    }
    a.push({
      x: x,
      y: y,
      xLoc: xp,
      yLoc: yp,
      c: connections[i].c
    });
  }
  return a;
}
function rightAndBottomSort(a, b) {
  return b.theta - a.theta;
}
function leftAndTopSort(a, b) {
  var p1 = a.theta < 0 ? -Math.PI - a.theta : Math.PI - a.theta,
      p2 = b.theta < 0 ? -Math.PI - b.theta : Math.PI - b.theta;
  return p1 - p2;
}
var edgeSortFunctions = {
  "top": leftAndTopSort,
  "right": rightAndBottomSort,
  "bottom": rightAndBottomSort,
  "left": leftAndTopSort
};
function floatingAnchorCompute(anchor, params) {
  var xy = params.xy;
  anchor._lastResult = [xy.x + anchor.size.w / 2, xy.y + anchor.size.h / 2, 0, 0];
  return anchor._lastResult;
}
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
      _this._removeEndpointFromAnchorLists(p.sourceEndpoint);
      _this._removeEndpointFromAnchorLists(p.targetEndpoint);
    });
    instance.bind(EVENT_INTERNAL_ENDPOINT_UNREGISTERED, function (ep) {
      _this._removeEndpointFromAnchorLists(ep);
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
      params = params || {};
      return endpoint.anchor.lastReturnValue == null || params.timestamp != null && endpoint.anchor.timestamp !== params.timestamp ? this.computeAnchorLocation(endpoint.anchor, params) : endpoint.anchor.lastReturnValue;
    }
  }, {
    key: "computeAnchorLocation",
    value: function computeAnchorLocation(anchor, params) {
      if (anchor.isContinuous) {
        anchor.lastReturnValue = this.continuousAnchorLocations[params.element.id] || [0, 0, 0, 0];
      } else if (anchor.isDynamic) {
        anchor.lastReturnValue = this.dynamicAnchorCompute(anchor, params);
      } else if (anchor.isFloating) {
        anchor.lastReturnValue = floatingAnchorCompute(anchor, params);
      } else {
        anchor.lastReturnValue = this.defaultAnchorCompute(anchor, params);
      }
      return anchor.lastReturnValue;
    }
  }, {
    key: "defaultAnchorCompute",
    value: function defaultAnchorCompute(anchor, params) {
      var xy = params.xy,
          wh = params.wh,
          timestamp = params.timestamp;
      if (timestamp && timestamp === anchor.timestamp) {
        return anchor.lastReturnValue;
      }
      var candidate = [xy.x + anchor.x * wh.w + anchor.offsets[0], xy.y + anchor.y * wh.h + anchor.offsets[1], anchor.x, anchor.y];
      var rotation = params.rotation;
      if (rotation != null && rotation.length > 0) {
        var o = anchor._unrotatedOrientation.slice(),
            s = candidate.slice(),
            current = {
          x: s[0],
          y: s[1],
          cr: 0,
          sr: 0
        };
        forEach(rotation, function (r) {
          current = rotatePoint(current, r.c, r.r);
          var _o = [Math.round(o[0] * current.cr - o[1] * current.sr), Math.round(o[1] * current.cr + o[0] * current.sr)];
          o = _o.slice();
        });
        anchor.orientation[0] = o[0];
        anchor.orientation[1] = o[1];
        anchor.lastReturnValue = [current.x, current.y, anchor.x, anchor.y];
      } else {
        anchor.orientation[0] = anchor._unrotatedOrientation[0];
        anchor.orientation[1] = anchor._unrotatedOrientation[1];
        anchor.lastReturnValue = candidate;
      }
      anchor.timestamp = timestamp;
      return anchor.lastReturnValue;
    }
  }, {
    key: "dynamicAnchorCompute",
    value: function dynamicAnchorCompute(anchor, params) {
      var xy = params.xy,
          wh = params.wh,
          txy = params.txy,
          twh = params.twh;
      anchor.timestamp = params.timestamp;
      if (anchor.isLocked() || txy == null || twh == null) {
        anchor.lastReturnValue = this.computeAnchorLocation(anchor._curAnchor, params);
        return anchor.lastReturnValue;
      } else {
        params.timestamp = null;
      }
      anchor._curAnchor = anchor._anchorSelector(xy, wh, txy, twh, params.rotation, params.tRotation, anchor.anchors);
      anchor.x = anchor._curAnchor.x;
      anchor.y = anchor._curAnchor.y;
      if (anchor._curAnchor !== anchor._lastAnchor) {
        anchor.fire(EVENT_ANCHOR_CHANGED, anchor._curAnchor);
      }
      anchor._lastAnchor = anchor._curAnchor;
      anchor.lastReturnValue = this.defaultAnchorCompute(anchor._curAnchor, params);
      return anchor.lastReturnValue;
    }
  }, {
    key: "getEndpointOrientation",
    value: function getEndpointOrientation(endpoint) {
      return this.getAnchorOrientation(endpoint.anchor, endpoint);
    }
  }, {
    key: "getAnchorOrientation",
    value: function getAnchorOrientation(anchor, endpoint) {
      if (anchor.isContinuous) {
        return this.continuousAnchorOrientations[endpoint.id] || [0, 0];
      } else if (anchor.isDynamic) {
        return anchor._curAnchor != null ? anchor._curAnchor.orientation : [0, 0];
      } else if (anchor.isFloating) {
        if (anchor.orientation) {
          return anchor.orientation;
        } else {
          var o = this.getAnchorOrientation(anchor.ref, endpoint);
          return [Math.abs(o[0]) * anchor.xDir * -1, Math.abs(o[1]) * anchor.yDir * -1];
        }
      } else {
        return anchor.orientation;
      }
    }
  }, {
    key: "computePath",
    value: function computePath(connection, timestamp) {
      var sourceInfo = this.instance.viewport.getPosition(connection.sourceId),
          targetInfo = this.instance.viewport.getPosition(connection.targetId),
          sE = connection.endpoints[0],
          tE = connection.endpoints[1];
      var sAnchorP = this.getEndpointLocation(sE, {
        xy: sourceInfo,
        wh: sourceInfo,
        element: sE,
        timestamp: timestamp,
        rotation: this.instance._getRotations(connection.sourceId)
      }),
          tAnchorP = this.getEndpointLocation(tE, {
        xy: targetInfo,
        wh: targetInfo,
        element: tE,
        timestamp: timestamp,
        rotation: this.instance._getRotations(connection.targetId)
      });
      connection.connector.resetBounds();
      connection.connector.compute({
        sourcePos: sAnchorP,
        targetPos: tAnchorP,
        sourceOrientation: this.getEndpointOrientation(sE),
        targetOrientation: this.getEndpointOrientation(tE),
        sourceEndpoint: connection.endpoints[0],
        targetEndpoint: connection.endpoints[1],
        strokeWidth: connection.paintStyleInUse.strokeWidth,
        sourceInfo: sourceInfo,
        targetInfo: targetInfo
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
            _this2.continuousAnchorLocations[endpoint.id] = [anchorPos.x, anchorPos.y, anchorPos.xLoc, anchorPos.yLoc];
            _this2.continuousAnchorOrientations[endpoint.id] = orientation;
          };
          for (var i = 0; i < anchors.length; i++) {
            var c = anchors[i].c,
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
    key: "_removeEndpointFromAnchorLists",
    value: function _removeEndpointFromAnchorLists(endpoint) {
      var listsForElement = this.anchorLists[endpoint.elementId];
      var total = 0;
      (function (list, eId) {
        if (list) {
          var f = function f(e) {
            return e.epId === eId;
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
      delete this.continuousAnchorLocations[endpoint.id];
      delete this.continuousAnchorOrientations[endpoint.id];
    }
  }, {
    key: "_updateAnchorList",
    value: function _updateAnchorList(lists, theta, order, conn, aBoolean, otherElId, idx, reverse, edgeId, connsToPaint, endpointsToPaint) {
      var endpoint = conn.endpoints[idx],
          endpointId = endpoint.id,
          oIdx = [1, 0][idx],
          values = {
        theta: theta,
        order: order,
        c: conn,
        b: aBoolean,
        elId: otherElId,
        epId: endpointId
      },
          listToAddTo = lists[edgeId],
          listToRemoveFrom = endpoint._continuousAnchorEdge ? lists[endpoint._continuousAnchorEdge] : null,
          candidate;
      if (listToRemoveFrom) {
        var rIdx = findWithFunction(listToRemoveFrom, function (e) {
          return e.epId === endpointId;
        });
        if (rIdx !== -1) {
          listToRemoveFrom.splice(rIdx, 1);
          for (var i = 0; i < listToRemoveFrom.length; i++) {
            candidate = listToRemoveFrom[i].c;
            connsToPaint.add(candidate);
            endpointsToPaint.add(listToRemoveFrom[i].c.endpoints[idx]);
            endpointsToPaint.add(listToRemoveFrom[i].c.endpoints[oIdx]);
          }
        }
      }
      for (var _i = 0; _i < listToAddTo.length; _i++) {
        candidate = listToAddTo[_i].c;
        connsToPaint.add(candidate);
        endpointsToPaint.add(listToAddTo[_i].c.endpoints[idx]);
        endpointsToPaint.add(listToAddTo[_i].c.endpoints[oIdx]);
      }
      {
        var insertIdx = reverse ?  0 : listToAddTo.length;
        listToAddTo.splice(insertIdx, 0, values);
      }
      endpoint._continuousAnchorEdge = edgeId;
    }
  }, {
    key: "redraw",
    value: function redraw(elementId, timestamp, offsetToUI) {
      var _this3 = this;
      var connectionsToPaint = new Set(),
          endpointsToPaint = new Set(),
          anchorsToUpdate = new Set();
      if (!this.instance._suspendDrawing) {
        var ep = this.instance.endpointsByElement[elementId] || [];
        timestamp = timestamp || uuid();
        var orientationCache = {};
        forEach(ep, function (anEndpoint) {
          endpointsToPaint.add(anEndpoint);
          if (anEndpoint.connections.length === 0) {
            if (anEndpoint.anchor.isContinuous) {
              if (!_this3.anchorLists[elementId]) {
                _this3.anchorLists[elementId] = {
                  top: [],
                  right: [],
                  bottom: [],
                  left: []
                };
              }
              _this3._updateAnchorList(_this3.anchorLists[elementId], -Math.PI / 2, 0, {
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
                if (sourceContinuous && !_this3.anchorLists[sourceId]) {
                  _this3.anchorLists[sourceId] = {
                    top: [],
                    right: [],
                    bottom: [],
                    left: []
                  };
                }
                if (targetContinuous && !_this3.anchorLists[targetId]) {
                  _this3.anchorLists[targetId] = {
                    top: [],
                    right: [],
                    bottom: [],
                    left: []
                  };
                }
                var td = _this3.instance.viewport.getPosition(targetId),
                    sd = _this3.instance.viewport.getPosition(sourceId);
                if (targetId === sourceId && (sourceContinuous || targetContinuous)) {
                  _this3._updateAnchorList(_this3.anchorLists[sourceId], -Math.PI / 2, 0, conn, false, targetId, 0, false, "top", connectionsToPaint, endpointsToPaint);
                  _this3._updateAnchorList(_this3.anchorLists[targetId], -Math.PI / 2, 0, conn, false, sourceId, 1, false, "top", connectionsToPaint, endpointsToPaint);
                } else {
                  var sourceRotation = _this3.instance._getRotations(sourceId);
                  var targetRotation = _this3.instance._getRotations(targetId);
                  if (!o) {
                    o = _this3.calculateOrientation(sourceId, targetId, sd, td, conn.endpoints[0].anchor, conn.endpoints[1].anchor, sourceRotation, targetRotation);
                    orientationCache[oKey] = o;
                  }
                  if (sourceContinuous) {
                    _this3._updateAnchorList(_this3.anchorLists[sourceId], o.theta, 0, conn, false, targetId, 0, false, o.a[0], connectionsToPaint, endpointsToPaint);
                  }
                  if (targetContinuous) {
                    _this3._updateAnchorList(_this3.anchorLists[targetId], o.theta2, -1, conn, true, sourceId, 1, true, o.a[1], connectionsToPaint, endpointsToPaint);
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
                  _this3.instance.paintEndpoint(otherEndpoint, {
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
        });
        anchorsToUpdate.forEach(function (anchor) {
          _this3.placeAnchors(_this3.instance, anchor, _this3.anchorLists[anchor]);
        });
        endpointsToPaint.forEach(function (ep) {
          var cd = _this3.instance.viewport.getPosition(ep.elementId);
          _this3.instance.paintEndpoint(ep, {
            timestamp: timestamp,
            offset: cd
          });
        });
        connectionsToPaint.forEach(function (c) {
          _this3.instance.paintConnection(c, {
            timestamp: timestamp
          });
        });
      }
      return {
        c: connectionsToPaint,
        e: endpointsToPaint
      };
    }
  }, {
    key: "calculateOrientation",
    value: function calculateOrientation(sourceId, targetId, sd, td, sourceAnchor, targetAnchor, sourceRotation, targetRotation) {
      var _this4 = this;
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
      var theta = Math.atan2(td.c.y - sd.c.y, td.c.x - sd.c.x),
          theta2 = Math.atan2(sd.c.y - td.c.y, sd.c.x - td.c.x);
      var candidates = [],
          midpoints = {};
      (function (types, dim) {
        for (var i = 0; i < types.length; i++) {
          midpoints[types[i]] = {
            "left": {
              x: dim[i][0].x,
              y: dim[i][0].c.y
            },
            "right": {
              x: dim[i][0].x + dim[i][0].w,
              y: dim[i][0].c.y
            },
            "top": {
              x: dim[i][0].c.x,
              y: dim[i][0].y
            },
            "bottom": {
              x: dim[i][0].c.x,
              y: dim[i][0].y + dim[i][0].h
            }
          };
          if (dim[i][1] != null && dim[i][1].length > 0) {
            for (var axis in midpoints[types[i]]) {
              midpoints[types[i]][axis] = _this4.instance._applyRotationsXY(midpoints[types[i]][axis], dim[i][1]);
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
            dist: lineLength(midpoints.source[FACES[sf]], midpoints.target[FACES[tf]])
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
      forEach(this.entries, function (e) {
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
        return c.parameters[name] = value;
      });
      return this;
    }
  }, {
    key: "setParameters",
    value: function setParameters(p) {
      this.each(function (c) {
        return c.parameters = p;
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

var Transaction = function Transaction() {
  _classCallCheck(this, Transaction);
  _defineProperty(this, "affectedElements", new Set());
};
function EMPTY_POSITION() {
  return {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    r: 0,
    c: {
      x: 0,
      y: 0
    },
    x2: 0,
    y2: 0,
    t: {
      x: 0,
      y: 0,
      c: {
        x: 0,
        y: 0
      },
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
  var center = {
    x: x + w / 2,
    y: y + h / 2
  },
      cr = Math.cos(r / 360 * Math.PI * 2),
      sr = Math.sin(r / 360 * Math.PI * 2),
      _point = function _point(x, y) {
    return {
      x: center.x + Math.round((x - center.x) * cr - (y - center.y) * sr),
      y: center.y + Math.round((y - center.y) * cr - (x - center.x) * sr)
    };
  };
  var p1 = _point(x, y),
      p2 = _point(x + w, y),
      p3 = _point(x + w, y + h),
      p4 = _point(x, y + h),
      c = _point(x + w / 2, y + h / 2);
  var xmin = Math.min(p1.x, p2.x, p3.x, p4.x),
      xmax = Math.max(p1.x, p2.x, p3.x, p4.x),
      ymin = Math.min(p1.y, p2.y, p3.y, p4.y),
      ymax = Math.max(p1.y, p2.y, p3.y, p4.y);
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
var entryComparator = function entryComparator(value, arrayEntry) {
  var c = 0;
  if (arrayEntry[1] > value[1]) {
    c = -1;
  } else if (arrayEntry[1] < value[1]) {
    c = 1;
  }
  return c;
};
var reverseEntryComparator = function reverseEntryComparator(value, arrayEntry) {
  return entryComparator(value, arrayEntry) * -1;
};
var Viewport =
function (_EventGenerator) {
  _inherits(Viewport, _EventGenerator);
  function Viewport(instance) {
    var _this;
    _classCallCheck(this, Viewport);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(Viewport).call(this));
    _this.instance = instance;
    _defineProperty(_assertThisInitialized(_this), "_currentTransaction", null);
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
      var idx = findWithFunction(array, function (entry) {
        return entry[0] === id;
      });
      if (idx > -1) {
        array.splice(idx, 1);
      }
    }
  }, {
    key: "_updateElementIndex",
    value: function _updateElementIndex(id, value, array, sortDescending) {
      insertSorted([id, value], array, entryComparator, sortDescending);
    }
  }, {
    key: "_updateBounds",
    value: function _updateBounds(id, updatedElement, doNotRecalculateBounds) {
      if (updatedElement != null) {
        this._clearElementIndex(id, this._sortedElements.xmin);
        this._clearElementIndex(id, this._sortedElements.xmax);
        this._clearElementIndex(id, this._sortedElements.ymin);
        this._clearElementIndex(id, this._sortedElements.ymax);
        this._updateElementIndex(id, updatedElement.t.x, this._sortedElements.xmin, false);
        this._updateElementIndex(id, updatedElement.t.x + updatedElement.t.w, this._sortedElements.xmax, true);
        this._updateElementIndex(id, updatedElement.t.y, this._sortedElements.ymin, false);
        this._updateElementIndex(id, updatedElement.t.y + updatedElement.t.h, this._sortedElements.ymax, true);
        if (doNotRecalculateBounds !== true) {
          this._recalculateBounds();
        }
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
    key: "recomputeBounds",
    value: function recomputeBounds() {
      var _this2 = this;
      this._sortedElements.xmin.length = 0;
      this._sortedElements.xmax.length = 0;
      this._sortedElements.ymin.length = 0;
      this._sortedElements.ymax.length = 0;
      this._elementMap.forEach(function (vp, id) {
        _this2._sortedElements.xmin.push([id, vp.t.x]);
        _this2._sortedElements.xmax.push([id, vp.t.x + vp.t.w]);
        _this2._sortedElements.ymin.push([id, vp.t.y]);
        _this2._sortedElements.ymax.push([id, vp.t.y + vp.t.h]);
      });
      this._sortedElements.xmin.sort(entryComparator);
      this._sortedElements.ymin.sort(entryComparator);
      this._sortedElements.xmax.sort(reverseEntryComparator);
      this._sortedElements.ymax.sort(reverseEntryComparator);
      this._recalculateBounds();
    }
  }, {
    key: "_finaliseUpdate",
    value: function _finaliseUpdate(id, e, doNotRecalculateBounds) {
      e.t = rotate(e.x, e.y, e.w, e.h, e.r);
      this._transformedElementMap.set(id, e.t);
      if (doNotRecalculateBounds !== true) {
        this._updateBounds(id, e, doNotRecalculateBounds);
      }
    }
  }, {
    key: "shouldFireEvent",
    value: function shouldFireEvent(event, value, originalEvent) {
      return true;
    }
  }, {
    key: "startTransaction",
    value: function startTransaction() {
      if (this._currentTransaction != null) {
        throw new Error("Viewport: cannot start transaction; a transaction is currently active.");
      }
      this._currentTransaction = new Transaction();
    }
  }, {
    key: "endTransaction",
    value: function endTransaction() {
      var _this3 = this;
      if (this._currentTransaction != null) {
        this._currentTransaction.affectedElements.forEach(function (id) {
          var entry = _this3.getPosition(id);
          _this3._finaliseUpdate(id, entry, true);
        });
        this.recomputeBounds();
        this._currentTransaction = null;
      }
    }
  }, {
    key: "updateElements",
    value: function updateElements(entries) {
      var _this4 = this;
      forEach(entries, function (e) {
        return _this4.updateElement(e.id, e.x, e.y, e.width, e.height, e.rotation);
      });
    }
  }, {
    key: "updateElement",
    value: function updateElement(id, x, y, width, height, rotation, doNotRecalculateBounds) {
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
      e.c.x = e.x + e.w / 2;
      e.c.y = e.y + e.h / 2;
      e.x2 = e.x + e.w;
      e.y2 = e.y + e.h;
      if (this._currentTransaction == null) {
        this._finaliseUpdate(id, e, doNotRecalculateBounds);
      } else {
        this._currentTransaction.affectedElements.add(id);
      }
      return e;
    }
  }, {
    key: "refreshElement",
    value: function refreshElement(elId, doNotRecalculateBounds) {
      var me = this.instance.getManagedElements();
      var s = me[elId] ? me[elId].el : null;
      if (s != null) {
        var size = this.getSize(s);
        var offset = this.getOffset(s);
        return this.updateElement(elId, offset.x, offset.y, size.w, size.h, null, doNotRecalculateBounds);
      } else {
        return null;
      }
    }
  }, {
    key: "getSize",
    value: function getSize(el) {
      return this.instance.getSize(el);
    }
  }, {
    key: "getOffset",
    value: function getOffset(el) {
      return this.instance.getOffset(el);
    }
  }, {
    key: "registerElement",
    value: function registerElement(id, doNotRecalculateBounds) {
      return this.updateElement(id, 0, 0, 0, 0, 0, doNotRecalculateBounds);
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
  }]);
  return Viewport;
}(EventGenerator);

var ConnectionDragSelector =
function () {
  function ConnectionDragSelector(selector, def) {
    var exclude = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    _classCallCheck(this, ConnectionDragSelector);
    this.selector = selector;
    this.def = def;
    this.exclude = exclude;
  }
  _createClass(ConnectionDragSelector, [{
    key: "setEnabled",
    value: function setEnabled(enabled) {
      this.def.enabled = enabled;
    }
  }, {
    key: "isEnabled",
    value: function isEnabled() {
      return this.def.enabled !== false;
    }
  }]);
  return ConnectionDragSelector;
}();
var SourceSelector =
function (_ConnectionDragSelect) {
  _inherits(SourceSelector, _ConnectionDragSelect);
  function SourceSelector(selector, def, exclude) {
    var _this;
    _classCallCheck(this, SourceSelector);
    _this = _possibleConstructorReturn(this, _getPrototypeOf(SourceSelector).call(this, selector, def, exclude));
    _this.def = def;
    return _this;
  }
  return SourceSelector;
}(ConnectionDragSelector);
var TargetSelector =
function (_ConnectionDragSelect2) {
  _inherits(TargetSelector, _ConnectionDragSelect2);
  function TargetSelector(selector, def, exclude) {
    var _this2;
    _classCallCheck(this, TargetSelector);
    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(TargetSelector).call(this, selector, def, exclude));
    _this2.def = def;
    return _this2;
  }
  return TargetSelector;
}(ConnectionDragSelector);

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
function addManagedEndpoint(managedElement, ep) {
  if (managedElement != null) {
    managedElement.endpoints.push(ep);
  }
}
function removeManagedEndpoint(managedElement, endpoint) {
  if (managedElement != null) {
    removeWithFunction(managedElement.endpoints, function (ep) {
      return ep === endpoint;
    });
  }
}
function addManagedConnection(connection, sourceEl, targetEl) {
  if (sourceEl != null) {
    sourceEl.connections.push(connection);
    if (sourceEl.connections.length === 1) {
      connection.instance.addClass(connection.source, connection.instance.connectedClass);
    }
  }
  if (targetEl != null) {
    if (sourceEl == null || connection.sourceId !== connection.targetId) {
      targetEl.connections.push(connection);
      if (targetEl.connections.length === 1) {
        connection.instance.addClass(connection.target, connection.instance.connectedClass);
      }
    }
  }
}
function removeManagedConnection(connection, sourceEl, targetEl) {
  if (sourceEl != null) {
    var sourceCount = sourceEl.connections.length;
    removeWithFunction(sourceEl.connections, function (_c) {
      return connection.id === _c.id;
    });
    if (sourceCount > 0 && sourceEl.connections.length === 0) {
      connection.instance.removeClass(connection.source, connection.instance.connectedClass);
    }
  }
  if (targetEl != null) {
    var targetCount = targetEl.connections.length;
    if (sourceEl == null || connection.sourceId !== connection.targetId) {
      removeWithFunction(targetEl.connections, function (_c) {
        return connection.id === _c.id;
      });
    }
    if (targetCount > 0 && targetEl.connections.length === 0) {
      connection.instance.removeClass(connection.target, connection.instance.connectedClass);
    }
  }
}
var ID_ATTRIBUTE = ATTRIBUTE_MANAGED;
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
  function JsPlumbInstance(_instanceIndex, defaults) {
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
    _defineProperty(_assertThisInitialized(_this), "connectorClass", CLASS_CONNECTOR);
    _defineProperty(_assertThisInitialized(_this), "connectorOutlineClass", CLASS_CONNECTOR_OUTLINE);
    _defineProperty(_assertThisInitialized(_this), "connectedClass", CLASS_CONNECTED);
    _defineProperty(_assertThisInitialized(_this), "endpointClass", CLASS_ENDPOINT);
    _defineProperty(_assertThisInitialized(_this), "endpointConnectedClass", CLASS_ENDPOINT_CONNECTED);
    _defineProperty(_assertThisInitialized(_this), "endpointFullClass", CLASS_ENDPOINT_FULL);
    _defineProperty(_assertThisInitialized(_this), "endpointDropAllowedClass", CLASS_ENDPOINT_DROP_ALLOWED);
    _defineProperty(_assertThisInitialized(_this), "endpointDropForbiddenClass", CLASS_ENDPOINT_DROP_FORBIDDEN);
    _defineProperty(_assertThisInitialized(_this), "endpointAnchorClassPrefix", CLASS_ENDPOINT_ANCHOR_PREFIX);
    _defineProperty(_assertThisInitialized(_this), "overlayClass", CLASS_OVERLAY);
    _defineProperty(_assertThisInitialized(_this), "connections", []);
    _defineProperty(_assertThisInitialized(_this), "endpointsByElement", {});
    _defineProperty(_assertThisInitialized(_this), "endpointsByUUID", new Map());
    _defineProperty(_assertThisInitialized(_this), "sourceSelectors", []);
    _defineProperty(_assertThisInitialized(_this), "targetSelectors", []);
    _defineProperty(_assertThisInitialized(_this), "allowNestedGroups", void 0);
    _defineProperty(_assertThisInitialized(_this), "_curIdStamp", 1);
    _defineProperty(_assertThisInitialized(_this), "viewport", new Viewport(_assertThisInitialized(_this)));
    _defineProperty(_assertThisInitialized(_this), "router", void 0);
    _defineProperty(_assertThisInitialized(_this), "groupManager", void 0);
    _defineProperty(_assertThisInitialized(_this), "_connectionTypes", new Map());
    _defineProperty(_assertThisInitialized(_this), "_endpointTypes", new Map());
    _defineProperty(_assertThisInitialized(_this), "_container", void 0);
    _defineProperty(_assertThisInitialized(_this), "_managedElements", {});
    _defineProperty(_assertThisInitialized(_this), "DEFAULT_SCOPE", void 0);
    _defineProperty(_assertThisInitialized(_this), "_zoom", 1);
    _this.Defaults = {
      anchor: AnchorLocations.Bottom,
      anchors: [null, null],
      connectionsDetachable: true,
      connectionOverlays: [],
      connector: BezierConnector.type,
      container: null,
      endpoint: DotEndpoint.type,
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
        originalEndpoint: oldEndpoint,
        originalSourceId: idx === 0 ? cId : c.sourceId,
        newSourceId: c.sourceId,
        originalTargetId: idx === 1 ? cId : c.targetId,
        newTargetId: c.targetId,
        connection: c,
        newEndpoint: oldEndpoint
      };
      if (el instanceof Endpoint) {
        ep = el;
        ep.addConnection(c);
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
        evtParams.newEndpoint = ep;
        oldEndpoint.detachFromConnection(c);
        c.endpoints[idx] = ep;
        c[_st.el] = ep.element;
        c[_st.elId] = ep.elementId;
        evtParams[idx === 0 ? "newSourceId" : "newTargetId"] = ep.elementId;
        this.fireMoveEvent(evtParams);
        this.paintConnection(c);
      }
      return evtParams;
    }
  }, {
    key: "setSource",
    value: function setSource(connection, el) {
      removeManagedConnection(connection, this._managedElements[connection.sourceId]);
      var p = this._set(connection, el, 0);
      addManagedConnection(connection, this._managedElements[p.newSourceId]);
    }
  }, {
    key: "setTarget",
    value: function setTarget(connection, el) {
      removeManagedConnection(connection, this._managedElements[connection.targetId]);
      var p = this._set(connection, el, 1);
      addManagedConnection(connection, this._managedElements[p.newTargetId]);
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
        this.viewport.recomputeBounds();
      }
      if (repaintAfterwards) {
        this.repaintEverything();
      }
      return curVal;
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
      var elId = params.elId;
      if (params.recalc) {
        return this.viewport.refreshElement(elId);
      } else {
        return this.viewport.getPosition(elId);
      }
    }
  }, {
    key: "deleteConnection",
    value: function deleteConnection(connection, params) {
      if (connection != null && connection.deleted !== true) {
        params = params || {};
        if (params.force || functionChain(true, false, [[connection.endpoints[0], IS_DETACH_ALLOWED, [connection]], [connection.endpoints[1], IS_DETACH_ALLOWED, [connection]], [connection, IS_DETACH_ALLOWED, [connection]], [this, CHECK_CONDITION, [INTERCEPT_BEFORE_DETACH, connection]]])) {
          removeManagedConnection(connection, this._managedElements[connection.sourceId], this._managedElements[connection.targetId]);
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
      var id = this.getId(el),
          m = this._managedElements[id];
      if (m) {
        var l = m.connections.length;
        for (var i = 0; i < l; i++) {
          this.deleteConnection(m.connections[0], params);
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
      var nl = isString(elements) ? this.getSelector(this.getContainer(), elements) : elements;
      for (var i = 0; i < nl.length; i++) {
        this.manage(nl[i], null, recalc);
      }
    }
  }, {
    key: "manage",
    value: function manage(element, internalId, _recalc) {
      if (this.getAttribute(element, ID_ATTRIBUTE) == null) {
        internalId = internalId || uuid();
        this.setAttribute(element, ID_ATTRIBUTE, internalId);
      }
      var elId = this.getId(element);
      if (!this._managedElements[elId]) {
        var obj = {
          el: element,
          endpoints: [],
          connections: [],
          rotation: 0
        };
        this._managedElements[elId] = obj;
        if (this._suspendDrawing) {
          obj.viewportElement = this.viewport.registerElement(elId, true);
        } else {
          obj.viewportElement = this.updateOffset({
            elId: elId,
            recalc: true
          });
        }
        this.fire(EVENT_MANAGE_ELEMENT, {
          el: element
        });
      } else {
        if (_recalc) {
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
    key: "getManagedElement",
    value: function getManagedElement(id) {
      return this._managedElements[id] ? this._managedElements[id].el : null;
    }
  }, {
    key: "unmanage",
    value: function unmanage(el, removeElement) {
      var _this3 = this;
      var affectedElements = [];
      this.removeAllEndpoints(el, true, affectedElements);
      var _one = function _one(_el) {
        var id = _this3.getId(_el);
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
          _this3._removeElement(_el);
        }
      };
      for (var ae = 1; ae < affectedElements.length; ae++) {
        _one(affectedElements[ae]);
      }
      _one(el);
    }
  }, {
    key: "rotate",
    value: function rotate(element, rotation, _doNotRepaint) {
      var elementId = this.getId(element);
      if (this._managedElements[elementId]) {
        this._managedElements[elementId].rotation = rotation;
        this.viewport.rotateElement(elementId, rotation);
        if (_doNotRepaint !== true) {
          return this.revalidate(element);
        }
      }
      return {
        c: new Set(),
        e: new Set()
      };
    }
  }, {
    key: "_getRotation",
    value: function _getRotation(elementId) {
      var entry = this._managedElements[elementId];
      if (entry != null) {
        return entry.rotation || 0;
      } else {
        return 0;
      }
    }
  }, {
    key: "_getRotations",
    value: function _getRotations(elementId) {
      var _this4 = this;
      var rotations = [];
      var entry = this._managedElements[elementId];
      var _oneLevel = function _oneLevel(e) {
        if (e.group != null) {
          var gEntry = _this4._managedElements[e.group];
          if (gEntry != null) {
            rotations.push({
              r: gEntry.viewportElement.r,
              c: gEntry.viewportElement.c
            });
            _oneLevel(gEntry);
          }
        }
      };
      if (entry != null) {
        rotations.push({
          r: entry.viewportElement.r || 0,
          c: entry.viewportElement.c
        });
        _oneLevel(entry);
      }
      return rotations;
    }
  }, {
    key: "_applyRotations",
    value: function _applyRotations(point, rotations) {
      var sl = point.slice();
      var current = {
        x: sl[0],
        y: sl[1],
        cr: 0,
        sr: 0
      };
      forEach(rotations, function (rotation) {
        current = rotatePoint(current, rotation.c, rotation.r);
      });
      return current;
    }
  }, {
    key: "_applyRotationsXY",
    value: function _applyRotationsXY(point, rotations) {
      forEach(rotations, function (rotation) {
        point = rotatePoint(point, rotation.c, rotation.r);
      });
      return point;
    }
  }, {
    key: "_internal_newEndpoint",
    value: function _internal_newEndpoint(params, id) {
      var _p = extend({}, params);
      _p.elementId = id || this.getId(_p.element);
      var ep = new Endpoint(this, _p);
      ep.id = "ep_" + this._idstamp();
      var managedElement = this.manage(_p.element);
      addManagedEndpoint(managedElement, ep);
      if (params.uuid) {
        this.endpointsByUUID.set(params.uuid, ep);
      }
      return ep;
    }
  }, {
    key: "_deriveEndpointAndAnchorSpec",
    value: function _deriveEndpointAndAnchorSpec(type, dontPrependDefault) {
      var bits = ((dontPrependDefault ? "" : "default ") + type).split(/[\s]/),
          eps = null,
          ep = null,
          a = null,
          as = null;
      for (var i = 0; i < bits.length; i++) {
        var _t = this.getConnectionType(bits[i]);
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
      return this.repaint(el);
    }
  }, {
    key: "repaintEverything",
    value: function repaintEverything() {
      var timestamp = uuid(),
          elId;
      for (elId in this._managedElements) {
        this.viewport.refreshElement(elId, true);
      }
      this.viewport.recomputeBounds();
      for (elId in this._managedElements) {
        this.repaint(this._managedElements[elId].el, timestamp, true);
      }
      return this;
    }
  }, {
    key: "setElementPosition",
    value: function setElementPosition(el, x, y) {
      var id = this.getId(el);
      this.viewport.setPosition(id, x, y);
      return this.repaint(el);
    }
  }, {
    key: "repaint",
    value: function repaint(el, timestamp, offsetsWereJustCalculated) {
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
          var repaintEls = this._getAssociatedElements(el);
          if (timestamp == null) {
            timestamp = uuid();
          }
          if (!offsetsWereJustCalculated) {
            for (var i = 0; i < repaintEls.length; i++) {
              this.updateOffset({
                elId: this.getId(repaintEls[i]),
                recalc: true,
                timestamp: timestamp
              });
            }
          }
          _mergeRedraw(this.router.redraw(id, timestamp, null));
          if (repaintEls.length > 0) {
            for (var j = 0; j < repaintEls.length; j++) {
              _mergeRedraw(this.router.redraw(this.getId(repaintEls[j]), timestamp, null));
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
      removeManagedEndpoint(this._managedElements[endpoint.elementId], endpoint);
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
    key: "_maybePruneEndpoint",
    value: function _maybePruneEndpoint(endpoint) {
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
      var _this5 = this;
      var endpoint = typeof object === "string" ? this.endpointsByUUID.get(object) : object;
      if (endpoint) {
        var proxy = endpoint.proxiedBy;
        var connectionsToDelete = endpoint.connections.slice();
        forEach(connectionsToDelete, function (connection) {
          endpoint.detachFromConnection(connection, null, true);
        });
        this.unregisterEndpoint(endpoint);
        endpoint.destroy(true);
        forEach(connectionsToDelete, function (connection) {
          _this5.deleteConnection(connection, {
            force: true,
            endpointToIgnore: endpoint
          });
        });
        if (proxy != null) {
          this.deleteEndpoint(proxy);
        }
      }
      return this;
    }
  }, {
    key: "addEndpoint",
    value: function addEndpoint(el, params, referenceParams) {
      referenceParams = referenceParams || {};
      var p = extend({}, referenceParams);
      extend(p, params || {});
      p.endpoint = p.endpoint || this.Defaults.endpoint;
      p.paintStyle = p.paintStyle || this.Defaults.endpointStyle;
      var _p = extend({
        element: el
      }, p);
      var id = this.getId(_p.element);
      this.manage(el, id, !this._suspendDrawing);
      var e = this._internal_newEndpoint(_p, id);
      addToDictionary(this.endpointsByElement, id, e);
      if (!this._suspendDrawing) {
        this.paintEndpoint(e, {
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
    value: function reset() {
      var _this6 = this;
      this.silently(function () {
        _this6.endpointsByElement = {};
        _this6._managedElements = {};
        _this6.endpointsByUUID.clear();
        _this6.viewport.reset();
        _this6.router.reset();
        _this6.groupManager.reset();
        _this6._connectionTypes.clear();
        _this6._endpointTypes.clear();
        _this6.connections.length = 0;
        _this6.sourceSelectors.length = 0;
        _this6.targetSelectors.length = 0;
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.reset();
      this.unbind();
    }
  }, {
    key: "getEndpoints",
    value: function getEndpoints(el) {
      return this.endpointsByElement[this.getId(el)] || [];
    }
  }, {
    key: "getEndpoint",
    value: function getEndpoint(uuid) {
      return this.endpointsByUUID.get(uuid);
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
      var _this7 = this;
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
        return _this7.addEndpoint(el, params);
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
      addManagedConnection(c, this._managedElements[c.sourceId], this._managedElements[c.targetId]);
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
      this.repaint(jpc.source);
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
      var _this8 = this;
      affectedElements = affectedElements || [];
      var _one = function _one(_el) {
        var id = _this8.getId(_el),
            ebe = _this8.endpointsByElement[id],
            i,
            ii;
        if (ebe) {
          affectedElements.push(_el);
          for (i = 0, ii = ebe.length; i < ii; i++) {
            _this8.deleteEndpoint(ebe[i]);
          }
        }
        delete _this8.endpointsByElement[id];
        if (recurse) {
          _this8._getChildElements(_el).map(_one);
        }
      };
      _one(el);
      return this;
    }
  }, {
    key: "_setEnabled",
    value: function _setEnabled(type, el, state, toggle, connectionType) {
      var _this9 = this;
      var originalState = [],
          newState,
          os;
      var jel = el;
      connectionType = connectionType || DEFAULT;
      var defs = type === SOURCE ? jel._jsPlumbSourceDefinitions : jel._jsPlumbTargetDefinitions;
      if (defs) {
        forEach(defs, function (def) {
          if (def.def.connectionType == null || def.def.connectionType === connectionType) {
            os = def.enabled;
            originalState.push(os);
            newState = toggle ? !os : state;
            def.enabled = newState;
            var cls = ["jtk", type, "disabled"].join("-");
            if (newState) {
              _this9.removeClass(el, cls);
            } else {
              _this9.addClass(el, cls);
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
          var _idx = connectionType == null ? 0 : findWithFunction(eldefs, function (d) {
            return d.def.connectionType === connectionType;
          });
          if (_idx >= 0) {
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
          this.removeAttribute(el, "data-jtk-" + type);
        } else {
          var _t2 = [];
          forEach(el[key], function (def) {
            if (connectionType !== def.def.connectionType) {
              _t2.push(def);
            }
          });
          if (_t2.length > 0) {
            el[key] = _t2;
          } else {
            delete el[key];
            this.removeAttribute(el, "data-jtk-" + type);
          }
        }
      }
    }
  }, {
    key: "_unmakeEvery",
    value: function _unmakeEvery(type, key, connectionType) {
      var els = this.getSelector(this.getContainer(), "[data-jtk-" + type + "]");
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
        this.setAttribute(el, ATTRIBUTE_SCOPE_PREFIX + scopes[i], "");
      }
    }
  }, {
    key: "_createSourceDefinition",
    value: function _createSourceDefinition(params, referenceParams) {
      var p = extend({}, referenceParams);
      extend(p, params);
      p.connectionType = p.connectionType || DEFAULT;
      var aae = this._deriveEndpointAndAnchorSpec(p.connectionType);
      p.endpoint = p.endpoint || aae.endpoints[0];
      p.anchor = p.anchor || aae.anchors[0];
      var maxConnections = p.maxConnections || -1;
      var _def = {
        def: extend({}, p),
        uniqueEndpoint: p.uniqueEndpoint,
        maxConnections: maxConnections,
        enabled: true,
        endpoint: null
      };
      return _def;
    }
  }, {
    key: "makeSource",
    value: function makeSource(el, params, referenceParams) {
      var jel = el;
      var p = extend(extend({}, params), referenceParams || {});
      var _def = this._createSourceDefinition(params, referenceParams);
      this.manage(el);
      this.setAttribute(el, ATTRIBUTE_SOURCE, "");
      this._writeScopeAttribute(el, p.scope || this.Defaults.scope);
      this.setAttribute(el, [ATTRIBUTE_SOURCE, p.connectionType].join("-"), "");
      jel._jsPlumbSourceDefinitions = jel._jsPlumbSourceDefinitions || [];
      if (p.createEndpoint) {
        _def.uniqueEndpoint = true;
        _def.endpoint = this.addEndpoint(el, _def.def);
        _def.endpoint.deleteOnEmpty = false;
      }
      jel._jsPlumbSourceDefinitions.push(_def);
      return this;
    }
  }, {
    key: "addSourceSelector",
    value: function addSourceSelector(selector, params) {
      var exclude = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var _def = this._createSourceDefinition(params);
      var sel = new SourceSelector(selector, _def, exclude);
      this.sourceSelectors.push(sel);
      return sel;
    }
  }, {
    key: "removeSourceSelector",
    value: function removeSourceSelector(selector) {
      removeWithFunction(this.sourceSelectors, function (s) {
        return s === selector;
      });
    }
  }, {
    key: "removeTargetSelector",
    value: function removeTargetSelector(selector) {
      removeWithFunction(this.targetSelectors, function (s) {
        return s === selector;
      });
    }
  }, {
    key: "addTargetSelector",
    value: function addTargetSelector(selector, params) {
      var exclude = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var _def = this._createTargetDefinition(params);
      var sel = new TargetSelector(selector, _def, exclude);
      this.targetSelectors.push(sel);
      return sel;
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
        forEach(el[defKey], function (def) {
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
    key: "_createTargetDefinition",
    value: function _createTargetDefinition(params, referenceParams) {
      var p = extend({}, referenceParams);
      extend(p, params);
      p.connectionType = p.connectionType || DEFAULT;
      var maxConnections = p.maxConnections || -1;
      var _def = {
        def: extend({}, p),
        uniqueEndpoint: p.uniqueEndpoint,
        maxConnections: maxConnections,
        enabled: true,
        endpoint: null
      };
      return _def;
    }
  }, {
    key: "makeTarget",
    value: function makeTarget(el, params, referenceParams) {
      var p = extend(extend({}, params), referenceParams || {});
      var jel = el;
      var _def = this._createTargetDefinition(params, referenceParams);
      this.manage(el);
      this.setAttribute(el, ATTRIBUTE_TARGET, "");
      this._writeScopeAttribute(el, p.scope || this.Defaults.scope);
      this.setAttribute(el, [ATTRIBUTE_TARGET, p.connectionType].join("-"), "");
      jel._jsPlumbTargetDefinitions = jel._jsPlumbTargetDefinitions || [];
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
          var fo = convertToFullOverlaySpec(type.overlays[i]);
          to[fo.options.id] = fo;
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
          var fo = convertToFullOverlaySpec(type.overlays[i]);
          to[fo.options.id] = fo;
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
      return typeDescriptor === "connection" ? this.getConnectionType(id) : this.getEndpointType(id);
    }
  }, {
    key: "getConnectionType",
    value: function getConnectionType(id) {
      return this._connectionTypes.get(id);
    }
  }, {
    key: "getEndpointType",
    value: function getEndpointType(id) {
      return this._endpointTypes.get(id);
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
    value: function proxyConnection(connection, index, proxyEl, endpointGenerator, anchorGenerator) {
      var alreadyProxied = connection.proxies[index] != null,
          proxyEp,
          originalElementId = alreadyProxied ? connection.proxies[index].originalEp.elementId : connection.endpoints[index].elementId,
          originalEndpoint = alreadyProxied ? connection.proxies[index].originalEp : connection.endpoints[index],
          proxyElId = this.getId(proxyEl);
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
      originalEndpoint.proxiedBy = proxyEp;
      originalEndpoint.setVisible(false);
      connection.setVisible(true);
      this.revalidate(proxyEl);
    }
  }, {
    key: "unproxyConnection",
    value: function unproxyConnection(connection, index) {
      if (connection.proxies == null || connection.proxies[index] == null) {
        return;
      }
      var originalElement = connection.proxies[index].originalEp.element,
          originalElementId = connection.proxies[index].originalEp.elementId,
          proxyElId = connection.proxies[index].ep.elementId;
      connection.endpoints[index] = connection.proxies[index].originalEp;
      delete connection.proxies[index].originalEp.proxiedBy;
      this.sourceOrTargetChanged(proxyElId, originalElementId, connection, originalElement, index);
      connection.proxies[index].ep.detachFromConnection(connection, null);
      connection.proxies[index].originalEp.addConnection(connection);
      if (connection.isVisible()) {
        connection.proxies[index].originalEp.setVisible(true);
      }
      connection.proxies[index] = null;
      if (findWithFunction(connection.proxies, function (p) {
        return p != null;
      }) === -1) {
        connection.proxies.length = 0;
      }
    }
  }, {
    key: "sourceOrTargetChanged",
    value: function sourceOrTargetChanged(originalId, newId, connection, newElement, index) {
      if (originalId !== newId) {
        if (index === 0) {
          connection.sourceId = newId;
          connection.source = newElement;
        } else if (index === 1) {
          connection.targetId = newId;
          connection.target = newElement;
        }
        removeManagedConnection(connection, this._managedElements[originalId]);
        addManagedConnection(connection, this._managedElements[newId]);
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
      return this.groupManager.removeGroup(group, deleteMembers, manipulateView, doNotFireEvent);
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
          _this10 = this;
      for (var _len2 = arguments.length, el = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        el[_key2 - 1] = arguments[_key2];
      }
      (_this$groupManager2 = this.groupManager).removeFromGroup.apply(_this$groupManager2, [group, false].concat(el));
      forEach(el, function (_el) {
        _this10._appendElement(_el, _this10.getContainer());
        _this10.updateOffset({
          recalc: true,
          elId: _this10.getId(_el)
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
          x: params.offset.x,
          y: params.offset.y
        } : {
          x: info.x,
          y: info.y
        };
        if (xy != null) {
          var ap = params.anchorLoc;
          if (ap == null) {
            var anchorParams = {
              xy: xy,
              wh: info,
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
              anchorParams.txy = oInfo;
              anchorParams.twh = oInfo;
              anchorParams.tElement = _c3.endpoints[oIdx];
              anchorParams.tRotation = this._getRotations(oId);
            } else if (endpoint.connections.length > 0) {
              anchorParams.connection = endpoint.connections[0];
            }
            anchorParams.rotation = this._getRotations(endpoint.elementId);
            ap = this.router.computeAnchorLocation(endpoint.anchor, anchorParams);
          }
          endpoint.endpoint.compute(ap, this.router.getEndpointOrientation(endpoint), endpoint.paintStyleInUse);
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
    _defineProperty(_assertThisInitialized(_this), "location", void 0);
    _defineProperty(_assertThisInitialized(_this), "paintStyle", void 0);
    _defineProperty(_assertThisInitialized(_this), "type", ArrowOverlay.type);
    _defineProperty(_assertThisInitialized(_this), "cachedDimensions", void 0);
    p = p || {};
    _this.width = p.width || DEFAULT_WIDTH;
    _this.length = p.length || DEFAULT_LENGTH;
    _this.direction = (p.direction || 1) < 0 ? -1 : 1;
    _this.foldback = p.foldback || 0.623;
    _this.paintStyle = p.paintStyle || {
      "strokeWidth": 1
    };
    _this.location = p.location == null ? _this.location : isArray(p.location) ? p.location[0] : p.location;
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
          txy = pointOnLine(hxy, mid, this.length);
        } else if (this.location === 1) {
          hxy = connector.pointOnPath(this.location);
          mid = connector.pointAlongPathFrom(this.location, -this.length);
          txy = pointOnLine(hxy, mid, this.length);
          if (this.direction === -1) {
            var _ = txy;
            txy = hxy;
            hxy = _;
          }
        } else if (this.location === 0) {
          txy = connector.pointOnPath(this.location);
          mid = connector.pointAlongPathFrom(this.location, this.length);
          hxy = pointOnLine(txy, mid, this.length);
          if (this.direction === -1) {
            var __ = txy;
            txy = hxy;
            hxy = __;
          }
        } else {
          hxy = connector.pointAlongPathFrom(this.location, this.direction * this.length / 2);
          mid = connector.pointOnPath(this.location);
          txy = pointOnLine(hxy, mid, this.length);
        }
        tail = perpendicularLineTo(hxy, txy, this.width);
        cxy = pointOnLine(hxy, txy, this.foldback * this.length);
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
_defineProperty(ArrowOverlay, "type", "Arrow");
function isArrowOverlay(o) {
  return o.type === ArrowOverlay.type;
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
    _defineProperty(_assertThisInitialized(_this), "type", PlainArrowOverlay.type);
    _this.foldback = 1;
    return _this;
  }
  return PlainArrowOverlay;
}(ArrowOverlay);
_defineProperty(PlainArrowOverlay, "type", "PlainArrow");
function isPlainArrowOverlay(o) {
  return o.type === PlainArrowOverlay.type;
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
    _defineProperty(_assertThisInitialized(_this), "type", DiamondOverlay.type);
    _this.length = _this.length / 2;
    _this.foldback = 2;
    return _this;
  }
  return DiamondOverlay;
}(ArrowOverlay);
_defineProperty(DiamondOverlay, "type", "Diamond");
function isDiamondOverlay(o) {
  return o.type === DiamondOverlay.type;
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
    _defineProperty(_assertThisInitialized(_this), "type", CustomOverlay.type);
    _this.create = p.create;
    return _this;
  }
  _createClass(CustomOverlay, [{
    key: "updateFrom",
    value: function updateFrom(d) {}
  }]);
  return CustomOverlay;
}(Overlay);
_defineProperty(CustomOverlay, "type", "Custom");
function isCustomOverlay(o) {
  return o.type === CustomOverlay.type;
}
OverlayFactory.register("Custom", CustomOverlay);

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
      this._lastResult = [xy[0] + this.size.w / 2, xy[1] + this.size.h / 2, 0, 0];
      return this._lastResult;
    }
  }, {
    key: "getOrientation",
    value: function getOrientation(_endpoint) {
      if (this.orientation) {
        return this.orientation;
      } else {
        var o = this.instance.router.getAnchorOrientation(this.ref, _endpoint);
        return [Math.abs(o[0]) * this.xDir * -1, Math.abs(o[1]) * this.yDir * -1];
      }
    }
  }, {
    key: "over",
    value: function over(anchor, endpoint) {
      this.orientation = this.instance.router.getAnchorOrientation(anchor, endpoint);
    }
  }, {
    key: "out",
    value: function out() {
      this.orientation = null;
    }
  }]);
  return FloatingAnchor;
}(Anchor);

EndpointFactory.register(DotEndpoint.type, DotEndpoint);
EndpointFactory.register(BlankEndpoint.type, BlankEndpoint);
EndpointFactory.register(RectangleEndpoint.type, RectangleEndpoint);
Connectors.register(BezierConnector.type, BezierConnector);
Connectors.register(StraightConnector.type, StraightConnector);
Connectors.register(FlowchartConnector.type, FlowchartConnector);
Connectors.register(StateMachineConnector.type, StateMachineConnector);

export { ABSOLUTE, ATTRIBUTE_CONTAINER, ATTRIBUTE_GROUP, ATTRIBUTE_GROUP_CONTENT, ATTRIBUTE_MANAGED, ATTRIBUTE_NOT_DRAGGABLE, ATTRIBUTE_SCOPE, ATTRIBUTE_SCOPE_PREFIX, ATTRIBUTE_SOURCE, ATTRIBUTE_TABINDEX, ATTRIBUTE_TARGET, AbstractConnector, AbstractSegment, Anchor, AnchorLocations, Anchors, ArcSegment, ArrowOverlay, BLOCK, BezierConnector, BezierSegment, BlankEndpoint, CHECK_CONDITION, CHECK_DROP_ALLOWED, CLASS_CONNECTED, CLASS_CONNECTOR, CLASS_CONNECTOR_OUTLINE, CLASS_ENDPOINT, CLASS_ENDPOINT_ANCHOR_PREFIX, CLASS_ENDPOINT_CONNECTED, CLASS_ENDPOINT_DROP_ALLOWED, CLASS_ENDPOINT_DROP_FORBIDDEN, CLASS_ENDPOINT_FULL, CLASS_GROUP_COLLAPSED, CLASS_GROUP_EXPANDED, CLASS_OVERLAY, CMD_HIDE, CMD_ORPHAN_ALL, CMD_REMOVE_ALL, CMD_SHOW, Component, Connection, ConnectionDragSelector, ConnectionSelection, Connectors, ContinuousAnchor, CustomOverlay, DEFAULT, DefaultRouter, DiamondOverlay, DotEndpoint, DynamicAnchor, EMPTY_BOUNDS, EVENT_ANCHOR_CHANGED, EVENT_CLICK, EVENT_CONNECTION, EVENT_CONNECTION_DETACHED, EVENT_CONNECTION_MOUSEOUT, EVENT_CONNECTION_MOUSEOVER, EVENT_CONNECTION_MOVED, EVENT_CONTAINER_CHANGE, EVENT_CONTEXTMENU, EVENT_DBL_CLICK, EVENT_DBL_TAP, EVENT_ELEMENT_CLICK, EVENT_ELEMENT_DBL_CLICK, EVENT_ELEMENT_DBL_TAP, EVENT_ELEMENT_MOUSE_MOVE, EVENT_ELEMENT_MOUSE_OUT, EVENT_ELEMENT_MOUSE_OVER, EVENT_ELEMENT_TAP, EVENT_ENDPOINT_CLICK, EVENT_ENDPOINT_DBL_CLICK, EVENT_ENDPOINT_DBL_TAP, EVENT_ENDPOINT_MOUSEOUT, EVENT_ENDPOINT_MOUSEOVER, EVENT_ENDPOINT_REPLACED, EVENT_ENDPOINT_TAP, EVENT_FOCUS, EVENT_GROUP_ADDED, EVENT_GROUP_COLLAPSE, EVENT_GROUP_EXPAND, EVENT_GROUP_MEMBER_ADDED, EVENT_GROUP_MEMBER_REMOVED, EVENT_GROUP_REMOVED, EVENT_INTERNAL_CONNECTION_DETACHED, EVENT_INTERNAL_ENDPOINT_UNREGISTERED, EVENT_MANAGE_ELEMENT, EVENT_MAX_CONNECTIONS, EVENT_MOUSEDOWN, EVENT_MOUSEENTER, EVENT_MOUSEEXIT, EVENT_MOUSEMOVE, EVENT_MOUSEOUT, EVENT_MOUSEOVER, EVENT_MOUSEUP, EVENT_NESTED_GROUP_ADDED, EVENT_NESTED_GROUP_REMOVED, EVENT_TAP, EVENT_UNMANAGE_ELEMENT, EVENT_UPDATE, EVENT_ZOOM, Endpoint, EndpointFactory, EndpointRepresentation, EndpointSelection, EventGenerator, FALSE, FIXED, FloatingAnchor, FlowchartConnector, GroupManager, INTERCEPT_BEFORE_DETACH, INTERCEPT_BEFORE_DRAG, INTERCEPT_BEFORE_DROP, INTERCEPT_BEFORE_START_DETACH, IS, IS_DETACH_ALLOWED, JsPlumbInstance, LabelOverlay, NONE, OptimisticEventGenerator, Overlay, OverlayCapableComponent, OverlayFactory, PROPERTY_POSITION, PlainArrowOverlay, RectangleEndpoint, SELECTOR_CONNECTOR, SELECTOR_ENDPOINT, SELECTOR_GROUP, SELECTOR_GROUP_CONTAINER, SELECTOR_JTK_SOURCE, SELECTOR_JTK_TARGET, SELECTOR_MANAGED_ELEMENT, SELECTOR_OVERLAY, SOURCE, SOURCE_DEFINITION_LIST, SOURCE_INDEX, STATIC, SourceSelector, StateMachineConnector, StraightConnector, StraightSegment, TARGET, TARGET_DEFINITION_LIST, TARGET_INDEX, TRUE, TWO_PI, TargetSelector, UIGroup, UINode, UNDEFINED, Viewport, WILDCARD, X_AXIS_FACES, Y_AXIS_FACES, _mergeOverrides, _removeTypeCssHelper, _updateHoverStyle, addToDictionary, addToList, addWithFunction, att, boundingBoxIntersection, boxIntersection, classList, clone, cls, computeBezierLength, convertToFullOverlaySpec, dist, distanceFromCurve, each, encloses, extend, fastTrim, filterList, findAllWithFunction, findWithFunction, forEach, fromArray, functionChain, getAllWithFunction, getFromSetWithFunction, getWithFunction, getsert, gradient, gradientAtPoint, gradientAtPointAlongPathFrom, insertSorted, intersects, isArray, isArrowOverlay, isAssignableFrom, isBoolean, isCustomOverlay, isDate, isDiamondOverlay, isEmpty, isFullOverlaySpec, isFunction, isLabelOverlay, isNamedFunction, isNull, isNumber, isObject, isPlainArrowOverlay, isPoint, isString, lineIntersection, lineLength, locationAlongCurveFrom, log, logEnabled, makeAnchorFromSpec, map, merge, mergeWithParents, nearestPointOnCurve, normal, optional, perpendicularLineTo, perpendicularToPathAt, pointAlongCurveFrom, pointAlongPath, pointOnCurve, pointOnLine, pointSubtract, pointXYFromArray, populate, quadrant, remove, removeWithFunction, replace, rotateAnchorOrientation, rotatePoint, setToArray, sortHelper, suggest, theta, uuid, wrap };

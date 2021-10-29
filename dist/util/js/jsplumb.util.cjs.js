'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
function isNumber(n) {
  return Object.prototype.toString.call(n) === "[object Number]";
}
function isString(s) {
  return typeof s === "string";
}
function isBoolean(s) {
  return typeof s === "boolean";
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
function clone(a) {
  if (isString(a)) {
    return "" + a;
  } else if (isBoolean(a)) {
    return !!a;
  } else if (isDate(a)) {
    return new Date(a.getTime());
  } else if (isFunction(a)) {
    return a;
  } else if (Array.isArray(a)) {
    var _b = [];
    for (var i = 0; i < a.length; i++) {
      _b.push(clone(a[i]));
    }
    return _b;
  } else if (isObject(a)) {
    var c = {};
    for (var j in a) {
      c[j] = clone(a[j]);
    }
    return c;
  } else {
    return a;
  }
}
function filterNull(obj) {
  var o = {};
  for (var k in obj) {
    if (obj[k] != null) {
      o[k] = obj[k];
    }
  }
  return o;
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
    } else if (cMap[i]) {
      ar = [];
      ar.push.apply(ar, Array.isArray(c[i]) ? c[i] : [c[i]]);
      ar.push(b[i]);
      c[i] = ar;
    } else if (isString(b[i]) || isBoolean(b[i]) || isFunction(b[i]) || isNumber(b[i])) {
      c[i] = b[i];
    } else {
      if (Array.isArray(b[i])) {
        ar = [];
        if (Array.isArray(c[i])) {
          ar.push.apply(ar, c[i]);
        }
        ar.push.apply(ar, b[i]);
        c[i] = ar;
      } else if (isObject(b[i])) {
        if (!isObject(c[i])) {
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
function _areEqual(a, b) {
  if (a != null && b == null) {
    return false;
  } else {
    if ((a == null || isString(a) || isBoolean(a) || isNumber(a)) && a !== b) {
      return false;
    } else {
      if (Array.isArray(a)) {
        if (!Array.isArray(b)) {
          return false;
        } else {
          if (!arraysEqual(a, b)) {
            return false;
          }
        }
      } else if (isObject(a)) {
        if (!isObject(a)) {
          return false;
        } else {
          if (!objectsEqual(a, b)) {
            return false;
          }
        }
      }
    }
  }
  return true;
}
function arraysEqual(a, b) {
  if (a == null && b == null) {
    return true;
  } else if (a == null && b != null) {
    return false;
  } else if (a != null && b == null) {
    return false;
  }
  if (a.length !== b.length) {
    return false;
  } else {
    for (var i = 0; i < a.length; i++) {
      if (!_areEqual(a[i], b[i])) {
        return false;
      }
    }
  }
  return true;
}
function objectsEqual(a, b) {
  if (a == null && b == null) {
    return true;
  } else if (a == null && b != null) {
    return false;
  } else if (a != null && b == null) {
    return false;
  }
  for (var key in a) {
    var va = a[key],
        vb = b[key];
    if (!_areEqual(va, vb)) {
      return false;
    }
  }
  return true;
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
        var _a2 = _getArray();
        t = _a2[array[3]] || function () {
          _a2[array[3]] = {};
          return _a2[array[3]];
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
      } else if (Array.isArray(d)) {
        var r = [];
        for (var i = 0; i < d.length; i++) {
          r.push(_one(d[i]));
        }
        return r;
      } else if (isObject(d)) {
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
function findAllWithFunction(a, predicate) {
  var o = [];
  if (a) {
    for (var i = 0; i < a.length; i++) {
      if (predicate(a[i])) {
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
var logEnabled = true;
function log() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  if (typeof console !== "undefined") {
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

var EventGenerator = function () {
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
var OptimisticEventGenerator = function (_EventGenerator) {
  _inherits(OptimisticEventGenerator, _EventGenerator);
  var _super = _createSuper(OptimisticEventGenerator);
  function OptimisticEventGenerator() {
    _classCallCheck(this, OptimisticEventGenerator);
    return _super.apply(this, arguments);
  }
  _createClass(OptimisticEventGenerator, [{
    key: "shouldFireEvent",
    value: function shouldFireEvent(event, value, originalEvent) {
      return true;
    }
  }]);
  return OptimisticEventGenerator;
}(EventGenerator);

var segmentMultipliers = [null, [1, -1], [1, 1], [-1, 1], [-1, -1]];
var inverseSegmentMultipliers = [null, [-1, -1], [-1, 1], [1, 1], [1, -1]];
var TWO_PI = 2 * Math.PI;
function add(p1, p2) {
  return {
    x: p1.x + p2.x,
    y: p1.y + p2.y
  };
}
function subtract(p1, p2) {
  return {
    x: p1.x - p2.x,
    y: p1.y - p2.y
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
function toABC(line) {
  var A = line[1].y - line[0].y;
  var B = line[0].x - line[1].x;
  return {
    A: A,
    B: B,
    C: A * line[0].x + B * line[0].y
  };
}
function lineIntersection(l1, l2) {
  var abc1 = toABC(l1),
      abc2 = toABC(l2),
      det = abc1.A * abc2.B - abc2.A * abc1.B;
  if (det == 0) {
    return null;
  } else {
    var candidate = {
      x: (abc2.B * abc1.C - abc1.B * abc2.C) / det,
      y: (abc1.A * abc2.C - abc2.A * abc1.C) / det
    },
        l1xmin = Math.min(l1[0].x, l1[1].x),
        l1xmax = Math.max(l1[0].x, l1[1].x),
        l1ymin = Math.min(l1[0].y, l1[1].y),
        l1ymax = Math.max(l1[0].y, l1[1].y),
        l2xmin = Math.min(l2[0].x, l2[1].x),
        l2xmax = Math.max(l2[0].x, l2[1].x),
        l2ymin = Math.min(l2[0].y, l2[1].y),
        l2ymax = Math.max(l2[0].y, l2[1].y);
    if (candidate.x >= l1xmin && candidate.x <= l1xmax && candidate.y >= l1ymin && candidate.y <= l1ymax && candidate.x >= l2xmin && candidate.x <= l2xmax && candidate.y >= l2ymin && candidate.y <= l2ymax) {
      return candidate;
    } else {
      return null;
    }
  }
}
function lineRectangleIntersection(line, r) {
  var out = [],
      rectangleLines = [[{
    x: r.x,
    y: r.y
  }, {
    x: r.x + r.w,
    y: r.y
  }], [{
    x: r.x + r.w,
    y: r.y
  }, {
    x: r.x + r.w,
    y: r.y + r.h
  }], [{
    x: r.x,
    y: r.y
  }, {
    x: r.x,
    y: r.y + r.h
  }], [{
    x: r.x,
    y: r.y + r.h
  }, {
    x: r.x + r.w,
    y: r.y + r.h
  }]];
  forEach(rectangleLines, function (rLine) {
    var intersection = lineIntersection(line, rLine);
    if (intersection != null) {
      out.push(intersection);
    }
  });
  return out;
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
function snapToGrid(pos, grid, thresholdX, thresholdY) {
  thresholdX = thresholdX == null ? grid.thresholdX == null ? grid.w / 2 : grid.thresholdX : thresholdX;
  thresholdY = thresholdY == null ? grid.thresholdY == null ? grid.h / 2 : grid.thresholdY : thresholdY;
  var _dx = Math.floor(pos.x / grid.w),
      _dxl = grid.w * _dx,
      _dxt = _dxl + grid.w,
      x = Math.abs(pos.x - _dxl) <= thresholdX ? _dxl : Math.abs(_dxt - pos.x) <= thresholdX ? _dxt : pos.x;
  var _dy = Math.floor(pos.y / grid.h),
      _dyl = grid.h * _dy,
      _dyt = _dyl + grid.h,
      y = Math.abs(pos.y - _dyl) <= thresholdY ? _dyl : Math.abs(_dyt - pos.y) <= thresholdY ? _dyt : pos.y;
  return {
    x: x,
    y: y
  };
}

exports.EventGenerator = EventGenerator;
exports.OptimisticEventGenerator = OptimisticEventGenerator;
exports.TWO_PI = TWO_PI;
exports.add = add;
exports.addToDictionary = addToDictionary;
exports.addToList = addToList;
exports.addWithFunction = addWithFunction;
exports.arraysEqual = arraysEqual;
exports.clone = clone;
exports.each = each;
exports.encloses = encloses;
exports.extend = extend;
exports.fastTrim = fastTrim;
exports.filterList = filterList;
exports.filterNull = filterNull;
exports.findAllWithFunction = findAllWithFunction;
exports.findWithFunction = findWithFunction;
exports.forEach = forEach;
exports.fromArray = fromArray;
exports.functionChain = functionChain;
exports.getAllWithFunction = getAllWithFunction;
exports.getFromSetWithFunction = getFromSetWithFunction;
exports.getWithFunction = getWithFunction;
exports.getsert = getsert;
exports.gradient = gradient;
exports.insertSorted = insertSorted;
exports.intersects = intersects;
exports.isAssignableFrom = isAssignableFrom;
exports.isBoolean = isBoolean;
exports.isDate = isDate;
exports.isEmpty = isEmpty;
exports.isFunction = isFunction;
exports.isNamedFunction = isNamedFunction;
exports.isNumber = isNumber;
exports.isObject = isObject;
exports.isString = isString;
exports.lineIntersection = lineIntersection;
exports.lineLength = lineLength;
exports.lineRectangleIntersection = lineRectangleIntersection;
exports.log = log;
exports.logEnabled = logEnabled;
exports.map = map;
exports.merge = merge;
exports.normal = normal;
exports.objectsEqual = objectsEqual;
exports.perpendicularLineTo = perpendicularLineTo;
exports.pointOnLine = pointOnLine;
exports.populate = populate;
exports.quadrant = quadrant;
exports.remove = remove;
exports.removeWithFunction = removeWithFunction;
exports.replace = replace;
exports.rotateAnchorOrientation = rotateAnchorOrientation;
exports.rotatePoint = rotatePoint;
exports.setToArray = setToArray;
exports.snapToGrid = snapToGrid;
exports.subtract = subtract;
exports.suggest = suggest;
exports.theta = theta;
exports.uuid = uuid;
exports.wrap = wrap;

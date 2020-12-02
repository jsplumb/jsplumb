(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['jsplumb-core'] = {}));
}(this, (function (exports) { 'use strict';

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
    var SOURCE_INDEX = 0;
    var TARGET_INDEX = 1;
    var GROUP_KEY = "_jsPlumbGroup";
    var PARENT_GROUP_KEY = "_jsPlumbParentGroup";
    var IS_GROUP_KEY = "_isJsPlumbGroup";
    var ATTRIBUTE_MANAGED = "jtk-managed";
    var ATTRIBUTE_GROUP = "jtk-group";
    var ATTRIBUTE_SOURCE = "jtk-source";
    var ATTRIBUTE_TARGET = "jtk-target";
    var ATTRIBUTE_CONTAINER = "jtk-container";
    var ATTRIBUTE_NOT_DRAGGABLE = "jtk-not-draggable";
    var ATTRIBUTE_TABINDEX = "tabindex";
    var CHECK_DROP_ALLOWED = "checkDropAllowed";
    var IS_DETACH_ALLOWED = "isDetachAllowed";
    var BEFORE_DETACH = "beforeDetach";
    var CHECK_CONDITION = "checkCondition";
    var EVENT_CONNECTION = "connection";
    var EVENT_CONNECTION_DETACHED = "connectionDetached";
    var EVENT_INTERNAL_CONNECTION_DETACHED = "internal.connectionDetached";
    var EVENT_CONNECTION_MOVED = "connectionMoved";
    var EVENT_CONTAINER_CHANGE = "container:change";
    var EVENT_CLICK = "click";
    var EVENT_DBL_CLICK = "dblclick";
    var EVENT_CONNECTION_MOUSEOVER = "connectionMouseOver";
    var EVENT_CONNECTION_MOUSEOUT = "connectionMouseOut";
    var EVENT_ENDPOINT_CLICK = "endpointClick";
    var EVENT_ENDPOINT_DBL_CLICK = "endpointDblClick";
    var EVENT_ENDPOINT_MOUSEOVER = "endpointMouseOver";
    var EVENT_ENDPOINT_MOUSEOUT = "endpointMouseOut";
    var EVENT_ELEMENT_CLICK = "elementClick";
    var EVENT_ELEMENT_DBL_CLICK = "elementDblClick";
    var EVENT_ELEMENT_MOUSE_MOVE = "elementMousemove";
    var EVENT_ELEMENT_MOUSE_OVER = "elementMouseover";
    var EVENT_ELEMENT_MOUSE_OUT = "elementMouseout";
    var EVENT_FOCUS = "focus";
    var EVENT_MOUSEOVER = "mouseover";
    var EVENT_MOUSEOUT = "mouseout";
    var EVENT_MOUSEMOVE = "mousemove";
    var EVENT_MOUSEENTER = "mouseenter";
    var EVENT_MOUSEEXIT = "mouseexit";
    var EVENT_TAP = "tap";
    var EVENT_DBL_TAP = "dbltap";
    var EVENT_CONTEXTMENU = "contextmenu";
    var EVENT_MOUSEUP = "mouseup";
    var EVENT_MOUSEDOWN = "mousedown";
    var EVENT_CONNECTION_DRAG = "connectionDrag";
    var EVENT_GROUP_MEMBER_ADDED = "group:addMember";
    var EVENT_GROUP_MEMBER_REMOVED = "group:removeMember";
    var EVENT_GROUP_ADDED = "group:add";
    var EVENT_GROUP_REMOVED = "group:remove";
    var EVENT_EXPAND = "group:expand";
    var EVENT_COLLAPSE = "group:collapse";
    var EVENT_GROUP_DRAG_STOP = "groupDragStop";
    var EVENT_NESTED_GROUP_REMOVED = "nestedGroupRemoved";
    var EVENT_NESTED_GROUP_ADDED = "nestedGroupAdded";
    var EVENT_MAX_CONNECTIONS = "maxConnections";
    var EVENT_ZOOM = "zoom";
    var CLASS_CONNECTOR = "jtk-connector";
    var CLASS_ENDPOINT = "jtk-endpoint";
    var CLASS_OVERLAY = "jtk-overlay";
    var GROUP_COLLAPSED_CLASS = "jtk-group-collapsed";
    var GROUP_EXPANDED_CLASS = "jtk-group-expanded";
    var CMD_REMOVE_ALL = "removeAll";
    var CMD_ORPHAN_ALL = "orphanAll";
    var CMD_SHOW = "show";
    var CMD_HIDE = "hide";
    var SELECTOR_CONNECTOR = cls(CLASS_CONNECTOR);
    var SELECTOR_ENDPOINT = cls(CLASS_ENDPOINT);
    var SELECTOR_OVERLAY = cls(CLASS_OVERLAY);
    var SELECTOR_GROUP_CONTAINER = "[jtk-group-content]";
    var SELECTOR_MANAGED_ELEMENT = "[jtk-managed]";

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

    function filterList(list, value, missingIsFalse) {
      if (list === "*") {
        return true;
      }

      return list.length > 0 ? list.indexOf(value) !== -1 : !missingIsFalse;
    }
    function extend(o1, o2, keys) {
      var i;
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
      // first change the collations array - if present - into a lookup table, because its faster.
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
            c[i] = b[i]; // if we dont want to collate, just copy it in.
          } else {
            ar = []; // if c's object is also an array we can keep its values.

            ar.push.apply(ar, isArray(c[i]) ? c[i] : [c[i]]);
            ar.push.apply(ar, isBoolean(b[i]) ? b[i] : [b[i]]);
            c[i] = ar;
          }
        } else {
          if (isArray(b[i])) {
            ar = []; // if c's object is also an array we can keep its values.

            if (isArray(c[i])) {
              ar.push.apply(ar, c[i]);
            }

            ar.push.apply(ar, b[i]);
            c[i] = ar;
          } else if (IS.anObject(b[i])) {
            // overwrite c's value with an object if it is not already one.
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
          // set term = value on current t, creating term as array if necessary.
          if (array) {
            _getArray()[array[3]] = value;
          } else {
            t[term] = value;
          }
        } else {
          // set to current t[term], creating t[term] if necessary.
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
    } //
    // chain a list of functions, supplied by [ object, method name, args ], and return on the first
    // one that returns the failValue. if none return the failValue, return the successValue.
    //

    function functionChain(successValue, failValue, fns) {
      for (var i = 0; i < fns.length; i++) {
        var o = fns[i][0][fns[i][1]].apply(fns[i][0], fns[i][2]);

        if (o === failValue) {
          return o;
        }
      }

      return successValue;
    }
    /**
     *
     * Take the given model and expand out any parameters. 'functionPrefix' is optional, and if present, helps jsplumb figure out what to do if a value is a Function.
     * if you do not provide it (and doNotExpandFunctions is null, or false), jsplumb will run the given values through any functions it finds, and use the function's
     * output as the value in the result. if you do provide the prefix, only functions that are named and have this prefix
     * will be executed; other functions will be passed as values to the output.
     *
     * @param model
     * @param values
     * @param functionPrefix
     * @param doNotExpandFunctions
     * @returns {any}
     */

    function populate(model, values, functionPrefix, doNotExpandFunctions) {
      // for a string, see if it has parameter matches, and if so, try to make the substitutions.
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
      }; // process one entry.


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
    function addWithFunction(list, item, hashFunction) {
      if (findWithFunction(list, hashFunction) === -1) {
        list.push(item);
      }
    }
    function addToList(map, key, value, insertAtStart) {
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
    /**
     * Wraps one function with another, creating a placeholder for the
     * wrapped function if it was null. this is used to wrap the various
     * drag/drop event functions - to allow jsPlumb to be notified of
     * important lifecycle events without imposing itself on the user's
     * drag/drop functionality.
     * @method wrap
     * @param {Function} wrappedFunction original function to wrap; may be null.
     * @param {Function} newFunction function to wrap the original with.
     * @param {Object} [returnOnThisValue] Optional. Indicates that the wrappedFunction should
     * not be executed if the newFunction returns a value matching 'returnOnThisValue'.
     * note that this is a simple comparison and only works for primitives right now.
     */

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
        //map:(fn:(v:T) => Q):Q => {
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

    var EventGenerator =
    /*#__PURE__*/
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
                  // doing it this way rather than catching and then possibly re-throwing means that an error propagated by this
                  // method will have the whole call stack available in the debugger.
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
            addToList(_this._listeners, evt, listener, insertAtStart);
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
    /*#__PURE__*/
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

    function _applyTypes(component, params, doNotRepaint) {
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

        component.applyType(o, doNotRepaint, map);

        if (!doNotRepaint) {
          component.paint();
        }
      }
    }

    function _removeTypeCssHelper(component, typeIndex) {
      var typeId = component._types[typeIndex],
          type = component.instance.getType(typeId, component.getTypeDescriptor());

      if (type != null && type.cssClass) {
        component.removeClass(type.cssClass);
      }
    } // helper method to update the hover style whenever it, or paintStyle, changes.
    // we use paintStyle as the foundation and merge hoverPaintStyle over the
    // top.

    function _updateHoverStyle(component) {
      if (component.paintStyle && component.hoverPaintStyle) {
        var mergedHoverStyle = {};
        extend(mergedHoverStyle, component.paintStyle);
        extend(mergedHoverStyle, component.hoverPaintStyle);
        component.hoverPaintStyle = mergedHoverStyle;
      }
    }
    var Component =
    /*#__PURE__*/
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
            // if a string, convert to object representation so that we can store the typeid on it.
            // also assign an id.
            var fo = _this.instance.convertToFullOverlaySpec(o[i]);

            oo[fo[1].id] = fo;
          }
        }

        _this._defaultType = {
          overlays: oo,
          parameters: params.parameters || {},
          scope: params.scope || _this.instance.getDefaultScope()
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
          var r = this.instance.checkCondition("beforeDrop", {
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
        value: function setType(typeId, params, doNotRepaint) {
          this.clearTypes();
          this._types = _splitType(typeId) || [];

          _applyTypes(this, params, doNotRepaint);
        }
      }, {
        key: "getType",
        value: function getType() {
          return this._types;
        }
      }, {
        key: "reapplyTypes",
        value: function reapplyTypes(params, doNotRepaint) {
          _applyTypes(this, params, doNotRepaint);
        }
      }, {
        key: "hasType",
        value: function hasType(typeId) {
          return this._types.indexOf(typeId) !== -1;
        }
      }, {
        key: "addType",
        value: function addType(typeId, params, doNotRepaint) {
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
              _applyTypes(this, params, doNotRepaint);
            }
          }
        }
      }, {
        key: "removeType",
        value: function removeType(typeId, params, doNotRepaint) {
          var _this2 = this;

          var t = _splitType(typeId),
              _cont = false,
              _one = function _one(tt) {
            var idx = _this2._types.indexOf(tt);

            if (idx !== -1) {
              // remove css class if necessary
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
              _applyTypes(this, params, doNotRepaint);
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

          _applyTypes(this, params, doNotRepaint);
        }
      }, {
        key: "toggleType",
        value: function toggleType(typeId, params, doNotRepaint) {
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

            _applyTypes(this, params, doNotRepaint);
          }
        }
      }, {
        key: "applyType",
        value: function applyType(t, doNotRepaint, params) {
          this.setPaintStyle(t.paintStyle, doNotRepaint);
          this.setHoverPaintStyle(t.hoverPaintStyle, doNotRepaint);

          if (t.parameters) {
            for (var i in t.parameters) {
              this.setParameter(i, t.parameters[i]);
            }
          }

          this.paintStyleInUse = this.getPaintStyle();
        }
      }, {
        key: "setPaintStyle",
        value: function setPaintStyle(style, doNotRepaint) {
          this.paintStyle = style;
          this.paintStyleInUse = this.paintStyle;

          _updateHoverStyle(this);

          if (!doNotRepaint) {
            this.paint();
          }
        }
      }, {
        key: "getPaintStyle",
        value: function getPaintStyle() {
          return this.paintStyle;
        }
      }, {
        key: "setHoverPaintStyle",
        value: function setHoverPaintStyle(style, doNotRepaint) {
          this.hoverPaintStyle = style;

          _updateHoverStyle(this);

          if (!doNotRepaint) {
            this.paint();
          }
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
            this.cleanupListeners(); // this is on EventGenerator

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
    /*#__PURE__*/
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

        for (var event in _this.events) {
          _this.bind(event, _this.events[event]);
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
          this.instance.renderer.setOverlayVisible(this, v);
        }
      }, {
        key: "isVisible",
        value: function isVisible() {
          return this.visible;
        }
      }, {
        key: "destroy",
        value: function destroy(force) {
          this.instance.renderer.destroyOverlay(this, force);
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
        key: "dblClick",
        value: function dblClick(e) {
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
    /*#__PURE__*/
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
          this.instance.renderer.updateLabel(this);
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
        _jsPlumb: component.instance // TODO not necessary, since the instance can be accessed through the component.

      },
          mergedParams = extend(_params, params);
      return new LabelOverlay(component.instance, component, mergedParams);
    }

    function _processOverlay(component, o) {
      var _newOverlay = null;

      if (isArray(o)) {
        // this is for the shorthand ["Arrow", { width:50 }] syntax
        // there's also a three arg version:
        // ["Arrow", { width:50 }, {location:0.7}]
        // which merges the 3rd arg into the 2nd.
        var oa = o;
        var type = oa[0],
            // make a copy of the object so as not to mess up anyone else's reference...
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
    /*#__PURE__*/
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
        value: function addOverlay(overlay, doNotRepaint) {
          var o = _processOverlay(this, overlay);

          if (this.getData && o.type === "Label" && isArray(overlay)) {
            //
            // component data might contain label location - look for it here.
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

          if (!doNotRepaint) {
            this.paint();
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
        value: function removeAllOverlays(doNotRepaint) {
          for (var i in this.overlays) {
            this.overlays[i].destroy(true);
          }

          this.overlays = {};
          this.overlayPositions = null;
          this.overlayPlacements = {};

          if (!doNotRepaint) {
            this.paint();
          }
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

          if (!this.instance._suspendDrawing) {
            this.paint();
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
                //this.overlays[i].addClass(clazz)
                this.instance.renderer.addOverlayClass(this.overlays[i], clazz);
              } else if (action === "remove") {
                //this.overlays[i].removeClass(clazz)
                this.instance.renderer.removeOverlayClass(this.overlays[i], clazz);
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
        value: function applyType(t, doNotRepaint, typeMap) {
          _get(_getPrototypeOf(OverlayCapableComponent.prototype), "applyType", this).call(this, t, doNotRepaint, typeMap); // overlays?  not overlayMap?


          if (t.overlays) {
            // loop through the ones in the type. if already present on the component,
            // dont remove or re-add.
            var keep = {},
                i;

            for (i in t.overlays) {
              var existing = this.overlays[t.overlays[i][1].id];

              if (existing) {
                // maybe update from data, if there were parameterised values for instance.
                existing.updateFrom(t.overlays[i][1]);
                keep[t.overlays[i][1].id] = true;
                this.instance.renderer.reattachOverlay(existing, this);
              } else {
                var c = this.getCachedTypeItem("overlay", t.overlays[i][1].id);

                if (c != null) {
                  this.instance.renderer.reattachOverlay(c, this);
                  c.setVisible(true); // maybe update from data, if there were parameterised values for instance.

                  c.updateFrom(t.overlays[i][1]);
                  this.overlays[c.id] = c;
                } else {
                  c = this.addOverlay(t.overlays[i], true);
                }

                keep[c.id] = true;
              }
            } // now loop through the full overlays and remove those that we dont want to keep


            for (i in this.overlays) {
              if (keep[this.overlays[i].id] == null) {
                this.removeOverlay(this.overlays[i].id, true); // remove overlay but dont clean it up.
                // that would remove event listeners etc; overlays are never discarded by the types stuff, they are
                // just detached/reattached.
              }
            }
          }
        }
      }]);

      return OverlayCapableComponent;
    }(Component);

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

    var Anchor =
    /*#__PURE__*/
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

    // helper method to calculate the distance between the centers of the two elements.
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
    /*#__PURE__*/
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
        _this._lastAnchor = _this._curAnchor; // default method uses distance between element centers.  you can provide your own method in the dynamic anchor
        // constructor (and also to jsPlumb.makeDynamicAnchor). the arguments to it are four arrays:
        // xy - xy loc of the anchor's element
        // wh - anchor's element's dimensions
        // txy - xy loc of the element of the other anchor in the connection
        // twh - dimensions of the element of the other anchor in the connection.
        // anchors - the list of selectable anchors

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
          this.timestamp = params.timestamp; // if anchor is locked or an opposite element was not given, we
          // maintain our state. anchor will be locked
          // if it is the source of a drag and drop.

          if (this.isLocked() || txy == null || twh == null) {
            this.lastReturnValue = this._curAnchor.compute(params);
            return this.lastReturnValue;
          } else {
            params.timestamp = null; // otherwise clear this, i think. we want the anchor to compute.
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

    //{ [Key in faces]?:boolean }
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
    /*#__PURE__*/
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
        } // if the given edge is supported, returns it. otherwise looks for a substitute that _is_
        // supported. if none supported we also return the request edge.

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

          return edge; // we have to give them something.
        }
      }, {
        key: "isEdgeSupported",
        value: function isEdgeSupported(edge) {
          return this._lockedAxis == null ? this._lockedFace == null ? this.availableFaces[edge] === true : this._lockedFace === edge : this._lockedAxis.indexOf(edge) !== -1;
        }
      }, {
        key: "setCurrentFace",
        value: function setCurrentFace(face, overrideLock) {
          this._currentFace = face; // if currently locked, and the user wants to override, do that.

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
        } // TODO Whoever calls this should be using the Router instead.

      }, {
        key: "compute",
        value: function compute(params) {
          return this.instance.anchorManager.continuousAnchorLocations[params.element.id] || [0, 0, 0, 0];
        } // TODO Whoever calls this should be using the Router instead.

      }, {
        key: "getCurrentLocation",
        value: function getCurrentLocation(params) {
          return this.instance.anchorManager.continuousAnchorLocations[params.element.id] || [0, 0, 0, 0];
        } // TODO Whoever calls this should be using the Router instead.

      }, {
        key: "getOrientation",
        value: function getOrientation(endpoint) {
          return this.instance.anchorManager.continuousAnchorOrientations[endpoint.id] || [0, 0];
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
    //const anchorMap:Dictionary<(instance:jsPlumbInstance, args:any) => Anchor> = {}
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
      // if already an Anchor, return it
      if (spec.compute && spec.getOrientation) {
        return spec;
      } // if a string, its just a named anchor


      if (isString(spec)) {
        return getNamedAnchor(instance, spec, null, elementId);
      } else if (isArray(spec)) {
        // if its an array then it can be either:
        // - a DynamicAnchor, which is a series of Anchor specs
        // - an Anchor with constructor args
        // - a set of values for a low level Anchor create
        var sa = spec; // second arg is object, its a named anchor with constructor args

        if (IS.anObject(sa[1]) && sa[1].compute == null) {
          return getNamedAnchor(instance, sa[0], sa[1], elementId);
        } else {
          // if all values are numbers (or all numbers and an optional css class as the 7th arg) its a low level create
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

    _curryAnchor(0, 1, 0, 1, "BottomLeft"); // ------------- DYNAMIC ANCHOR DEFAULT ---------------------------


    var DEFAULT_DYNAMIC_ANCHORS = ["TopCenter", "RightMiddle", "BottomCenter", "LeftMiddle"];

    anchorMap["AutoDefault"] = function (instance, params) {
      var a = new DynamicAnchor(instance, {
        anchors: DEFAULT_DYNAMIC_ANCHORS.map(function (da) {
          return getNamedAnchor(instance, da, params);
        })
      });
      a.type = "AutoDefault";
      return a;
    }; // --------------------------- perimeter -----------------------


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
    }; // ------------------------- CONTINUOUS ANCHOR -------------------


    function _curryContinuousAnchor(type, faces) {
      anchorMap[type] = function (instance, params) {
        var o = {};
        Object.assign(o, params || {});

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

    function _updateConnectedClass(conn, element, remove) {
      if (element != null) {
        element._jsPlumbConnections = element._jsPlumbConnections || {};

        if (remove) {
          delete element._jsPlumbConnections[conn.id];
        } else {
          element._jsPlumbConnections[conn.id] = true;
        }

        if (isEmpty(element._jsPlumbConnections)) {
          conn.instance.removeClass(element, conn.instance.connectedClass);
        } else {
          conn.instance.addClass(element, conn.instance.connectedClass);
        }
      }
    }

    var Connection =
    /*#__PURE__*/
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

        _defineProperty(_assertThisInitialized(_this), "endpointStyles", [null, null]);

        _defineProperty(_assertThisInitialized(_this), "_endpointSpec", void 0);

        _defineProperty(_assertThisInitialized(_this), "_endpointsSpec", void 0);

        _defineProperty(_assertThisInitialized(_this), "_endpointStyle", void 0);

        _defineProperty(_assertThisInitialized(_this), "_endpointHoverStyle", void 0);

        _defineProperty(_assertThisInitialized(_this), "_endpointStyles", void 0);

        _defineProperty(_assertThisInitialized(_this), "_endpointHoverStyles", void 0);

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

        _defineProperty(_assertThisInitialized(_this), "floatingIndex", void 0);

        _defineProperty(_assertThisInitialized(_this), "floatingEndpoint", void 0);

        _defineProperty(_assertThisInitialized(_this), "floatingId", void 0);

        _defineProperty(_assertThisInitialized(_this), "floatingElement", void 0);

        _this.id = params.id; // if a new connection is the result of moving some existing connection, params.previousConnection
        // will have that Connection in it. listeners for the jsPlumbConnection event can look for that
        // member and take action if they need to.

        _this.previousConnection = params.previousConnection;
        _this.source = instance.getElement(params.source);
        _this.target = instance.getElement(params.target);

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

        _this._endpointSpec = params.endpoint;
        _this._endpointsSpec = params.endpoints;
        _this._endpointStyle = params.endpointStyle;
        _this._endpointHoverStyle = params.endpointHoverStyle;
        _this._endpointStyles = params.endpointStyles;
        _this._endpointHoverStyles = params.endpointHoverStyles;
        _this.paintStyle = params.paintStyle;
        _this.hoverPaintStyle = params.hoverPaintStyle;
        _this.uuids = params.uuids;

        var eS = _this.makeEndpoint(true, _this.source, _this.sourceId, params.sourceEndpoint),
            eT = _this.makeEndpoint(false, _this.target, _this.targetId, params.targetEndpoint);

        if (eS) {
          addToList(instance.endpointsByElement, _this.sourceId, eS);
        }

        if (eT) {
          addToList(instance.endpointsByElement, _this.targetId, eT);
        } // if scope not set, set it to be the scope for the source endpoint.


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

        _this._endpointsSpec = params.endpoints || [null, null];
        _this._endpointSpec = params.endpoint || null;

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

          _this.endpoints[0].paint({
            anchorLoc: sourceAnchorLoc,
            timestamp: initialTimestamp
          });

          var targetAnchorLoc = _this.instance.computeAnchorLoc(_this.endpoints[1], initialTimestamp);

          _this.endpoints[1].paint({
            anchorLoc: targetAnchorLoc,
            timestamp: initialTimestamp
          });
        }

        _this.cost = params.cost || _this.endpoints[0].connectionCost;
        _this.directed = params.directed; // inherit directed flag if set no source endpoint

        if (params.directed == null) {
          _this.directed = _this.endpoints[0].connectionsDirected;
        } // PARAMETERS
        // merge all the parameters objects into the connection.  parameters set
        // on the connection take precedence; then source endpoint params, then
        // finally target endpoint params.


        var _p = extend({}, _this.endpoints[1].getParameters());

        extend(_p, _this.endpoints[0].getParameters());
        extend(_p, _this.getParameters());

        _this.setParameters(_p); // END PARAMETERS
        // PAINTING


        _this.paintStyleInUse = _this.getPaintStyle() || {};

        _this.setConnector(_this.endpoints[0].connector || _this.endpoints[1].connector || params.connector || _this.instance.Defaults.connector, true);

        var data = params.data == null || !IS.anObject(params.data) ? {} : params.data;

        _this.setData(data); // the very last thing we do is apply types, if there are any.


        var _types = ["default", _this.endpoints[0].connectionType, _this.endpoints[1].connectionType, params.type].join(" ");

        if (/[^\s]/.test(_types)) {
          _this.addType(_types, params.data, true);
        }

        _this.updateConnectedClass();

        return _this;
      }

      _createClass(Connection, [{
        key: "makeEndpoint",
        value: function makeEndpoint(isSource, el, elId, ep) {
          elId = elId || this.instance.getId(el);
          return this.prepareEndpoint(ep, isSource ? 0 : 1, el, elId);
        }
      }, {
        key: "getTypeDescriptor",
        value: function getTypeDescriptor() {
          return "connection";
        }
      }, {
        key: "getAttachedElements",
        value: function getAttachedElements() {
          return this.endpoints;
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
        value: function applyType(t, doNotRepaint, typeMap) {
          var _connector = null;

          if (t.connector != null) {
            _connector = this.getCachedTypeItem("connector", typeMap.connector);

            if (_connector == null) {
              _connector = this.prepareConnector(t.connector, typeMap.connector);
              this.cacheTypeItem("connector", _connector, typeMap.connector);
            }

            this.setPreparedConnector(_connector);
          } // apply connector before superclass, as a new connector means overlays have to move.


          _get(_getPrototypeOf(Connection.prototype), "applyType", this).call(this, t, doNotRepaint, typeMap); // none of these things result in the creation of objects so can be ignored.


          if (t.detachable != null) {
            this.setDetachable(t.detachable);
          }

          if (t.reattach != null) {
            this.setReattach(t.reattach);
          }

          if (t.scope) {
            this.scope = t.scope;
          }

          var _anchors = null; // this also results in the creation of objects.

          if (t.anchor) {
            // note that even if the param was anchor, we store `anchors`.
            _anchors = this.getCachedTypeItem("anchors", typeMap.anchor);

            if (_anchors == null) {
              _anchors = [makeAnchorFromSpec(this.instance, t.anchor, this.sourceId), makeAnchorFromSpec(this.instance, t.anchor, this.targetId)];
              this.cacheTypeItem("anchors", _anchors, typeMap.anchor);
            }
          } else if (t.anchors) {
            _anchors = this.getCachedTypeItem("anchors", typeMap.anchors);

            if (_anchors == null) {
              _anchors = [makeAnchorFromSpec(this.instance, t.anchors[0], this.sourceId), makeAnchorFromSpec(this.instance, t.anchors[1], this.targetId)];
              this.cacheTypeItem("anchors", _anchors, typeMap.anchors);
            }
          }

          if (_anchors != null) {
            this.endpoints[0].anchor = _anchors[0];
            this.endpoints[1].anchor = _anchors[1];

            if (this.endpoints[1].anchor.isDynamic) {
              this.instance.repaint(this.endpoints[1].elementId);
            }
          }

          this.instance.renderer.applyConnectorType(this.connector, t);
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
            this.instance.renderer.addConnectorClass(this.connector, c);
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
            this.instance.renderer.removeConnectorClass(this.connector, c);
          }
        }
      }, {
        key: "setVisible",
        value: function setVisible(v) {
          _get(_getPrototypeOf(Connection.prototype), "setVisible", this).call(this, v);

          if (this.connector) {
            this.instance.renderer.setConnectorVisible(this.connector, v);
          }

          this.paint();
        }
      }, {
        key: "destroy",
        value: function destroy(force) {
          this.updateConnectedClass(true);
          this.endpoints = null;
          this.source = null;
          this.target = null; // TODO stop hover?

          this.instance.renderer.destroyConnection(this);
          this.connector = null;

          _get(_getPrototypeOf(Connection.prototype), "destroy", this).call(this, force);
        }
      }, {
        key: "updateConnectedClass",
        value: function updateConnectedClass(remove) {
          _updateConnectedClass(this, this.source, remove);

          _updateConnectedClass(this, this.target, remove);
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
            _jsPlumb: this.instance,
            cssClass: this.params.cssClass,
            container: this.params.container,
            "pointer-events": this.params["pointer-events"]
          },
              connector;

          if (isString(connectorSpec)) {
            connector = this.makeConnector(connectorSpec, connectorArgs);
          } // lets you use a string as shorthand.
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
                previousClasses = ""; // the connector will not be cleaned up if it was set as part of a type, because `typeId` will be set on it
            // and we havent passed in `true` for "force" here.

            if (this.connector != null) {
              previous = this.connector; //previousClasses = previous.getClass()

              previousClasses = this.instance.renderer.getConnectorClass(this.connector);
              this.instance.renderer.destroyConnection(this);
            }

            this.connector = connector;

            if (typeId) {
              this.cacheTypeItem("connector", connector, typeId);
            } // put classes from prior connector onto the canvas


            this.addClass(previousClasses);

            if (previous != null) {
              var o = this.getOverlays();

              for (var i in o) {
                this.instance.renderer.reattachOverlay(o[i], this);
              }
            }

            if (!doNotRepaint) {
              this.paint();
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
        key: "paint",
        value: function paint(params) {
          if (!this.instance._suspendDrawing && this.visible !== false) {
            params = params || {};
            var timestamp = params.timestamp;

            if (timestamp != null && timestamp === this.lastPaintedAt) {
              return;
            }

            if (timestamp == null || timestamp !== this.lastPaintedAt) {
              this.instance.router.computePath(this, timestamp);
              var overlayExtents = {
                minX: Infinity,
                minY: Infinity,
                maxX: -Infinity,
                maxY: -Infinity // compute overlays. we do this first so we can get their placements, and adjust the
                // container if needs be (if an overlay would be clipped)

              };

              for (var i in this.overlays) {
                if (this.overlays.hasOwnProperty(i)) {
                  var o = this.overlays[i];

                  if (o.isVisible()) {
                    this.overlayPlacements[i] = this.instance.renderer.drawOverlay(o, this.connector, this.paintStyleInUse, this.getAbsoluteOverlayPosition(o));
                    overlayExtents.minX = Math.min(overlayExtents.minX, this.overlayPlacements[i].minX);
                    overlayExtents.maxX = Math.max(overlayExtents.maxX, this.overlayPlacements[i].maxX);
                    overlayExtents.minY = Math.min(overlayExtents.minY, this.overlayPlacements[i].minY);
                    overlayExtents.maxY = Math.max(overlayExtents.maxY, this.overlayPlacements[i].maxY);
                  }
                }
              }

              var lineWidth = parseFloat("" + this.paintStyleInUse.strokeWidth || "1") / 2,
                  outlineWidth = parseFloat("" + this.paintStyleInUse.strokeWidth || "0"),
                  extents = {
                xmin: Math.min(this.connector.bounds.minX - (lineWidth + outlineWidth), overlayExtents.minX),
                ymin: Math.min(this.connector.bounds.minY - (lineWidth + outlineWidth), overlayExtents.minY),
                xmax: Math.max(this.connector.bounds.maxX + (lineWidth + outlineWidth), overlayExtents.maxX),
                ymax: Math.max(this.connector.bounds.maxY + (lineWidth + outlineWidth), overlayExtents.maxY)
              };
              this.instance.renderer.paintConnector(this.connector, this.paintStyleInUse, extents); // and then the overlays

              for (var j in this.overlays) {
                if (this.overlays.hasOwnProperty(j)) {
                  var p = this.overlays[j];

                  if (p.isVisible()) {
                    this.instance.renderer.paintOverlay(p, this.overlayPlacements[j], extents);
                  }
                }
              }
            }

            this.lastPaintedAt = timestamp;
          }
        }
      }, {
        key: "prepareEndpoint",
        value: function prepareEndpoint(existing, index, element, elementId, params) {
          var e;
          params = params || {};

          if (existing) {
            this.endpoints[index] = existing;
            existing.addConnection(this);
          } else {
            params.scope = params.scope == null ? this.scope : params.scope;
            params.reattach = params.reattach == null ? this.reattach : params.reattach;
            params.endpoints = params.endpoints == null ? this._endpointsSpec || [null, null] : params.endpoints;
            params.endpointStyles = params.endpointStyles == null ? this._endpointStyles || [null, null] : params.endpointStyles;
            params.endpointHoverStyles = params.endpointHoverStyles == null ? this._endpointHoverStyles || [null, null] : params.endpointHoverStyles;
            params.paintStyle = params.paintStyle == null ? this.paintStyleInUse : params.paintStyle;
            params.hoverPaintStyle = params.hoverPaintStyle == null ? this.hoverPaintStyle : params.hoverPaintStyle;
            var ep = params.endpoints[index] || params.endpoint || this._endpointSpec || this.instance.Defaults.endpoints[index] || this.instance.Defaults.endpoint;
            var es = params.endpointStyles[index] || params.endpointStyle || this._endpointStyle || this.instance.Defaults.endpointStyles[index] || this.instance.Defaults.endpointStyle; // Endpoints derive their fill from the connector's stroke, if no fill was specified.

            if (es.fill == null && params.paintStyle != null) {
              es.fill = params.paintStyle.stroke;
            }

            if (es.outlineStroke == null && params.paintStyle != null) {
              es.outlineStroke = params.paintStyle.outlineStroke;
            }

            if (es.outlineWidth == null && params.paintStyle != null) {
              es.outlineWidth = params.paintStyle.outlineWidth;
            }

            var ehs = params.endpointHoverStyles[index] || params.endpointHoverStyle || this._endpointHoverStyle || this.instance.Defaults.endpointHoverStyles[index] || this.instance.Defaults.endpointHoverStyle; // endpoint hover fill style is derived from connector's hover stroke style

            if (params.hoverPaintStyle != null) {
              if (ehs == null) {
                ehs = {};
              }

              if (ehs.fill == null) {
                ehs.fill = params.hoverPaintStyle.stroke;
              }
            }

            var a = this.anchors ? this.anchors[index] : this.anchor ? this.anchor : this._makeAnchor(this.instance.Defaults.anchors[index], elementId) || this._makeAnchor(this.instance.Defaults.anchor, elementId),
                u = this.uuids ? this.uuids[index] : null;
            e = this.instance.newEndpoint({
              paintStyle: es,
              hoverPaintStyle: ehs,
              endpoint: ep,
              connections: [this],
              uuid: u,
              anchor: a,
              source: element,
              scope: params.scope,
              reattach: params.reattach || this.instance.Defaults.reattachConnections,
              detachable: params.detachable || this.instance.Defaults.connectionsDetachable
            });

            if (existing == null) {
              e.deleteOnEmpty = true;
            }

            this.endpoints[index] = e;
          }

          return e;
        }
      }, {
        key: "_makeAnchor",
        value: function _makeAnchor(spec, elementId) {
          return spec != null ? makeAnchorFromSpec(this.instance, spec, elementId) : null;
        }
      }, {
        key: "replaceEndpoint",
        value: function replaceEndpoint(idx, endpointDef) {
          var current = this.endpoints[idx],
              elId = current.elementId,
              ebe = this.instance.getEndpoints(elId),
              _idx = ebe.indexOf(current),
              _new = this.prepareEndpoint(null, idx, current.element, elId, {
            endpoint: endpointDef
          });

          this.endpoints[idx] = _new;
          ebe.splice(_idx, 1, _new);
          current.detachFromConnection(this);
          this.instance.deleteEndpoint(current);
          this.instance.fire("endpointReplaced", {
            previous: current,
            current: _new
          });
          this.updateConnectedClass();
        }
      }]);

      return Connection;
    }(OverlayCapableComponent);

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
    /*#__PURE__*/
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
        /**
         * Function: findClosestPointOnPath
         * Finds the closest point on this segment to the given [x, y],
         * returning both the x and y of the point plus its distance from
         * the supplied point, and its location along the length of the
         * path inscribed by the segment.  This implementation returns
         * Infinity for distance and null values for everything else
         * subclasses are expected to override.
         */

      }, {
        key: "findClosestPointOnPath",
        value: function findClosestPointOnPath(x, y) {
          return noSuchPoint();
        }
        /**
         * Computes the list of points on the segment that intersect the given line.
         * @method lineIntersection
         * @param {number} x1
         * @param {number} y1
         * @param {number} x2
         * @param {number} y2
         * @returns {Array<PointArray>}
         */

      }, {
        key: "lineIntersection",
        value: function lineIntersection(x1, y1, x2, y2) {
          return [];
        }
        /**
         * Computes the list of points on the segment that intersect the box with the given origin and size.
         * @method boxIntersection
         * @param {number} x
         * @param {number} y
         * @param {number} w
         * @param {number} h
         * @returns {Array<PointArray>}
         */

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
        /**
         * Computes the list of points on the segment that intersect the given bounding box, which is an object of the form { x:.., y:.., w:.., h:.. }.
         * @method lineIntersection
         * @param {BoundingBox} box
         * @returns {Array<[number, number]>}
         */

      }, {
        key: "boundingBoxIntersection",
        value: function boundingBoxIntersection(box) {
          return this.boxIntersection(box.x, box.y, box.w, box.h);
        }
      }]);

      return AbstractSegment;
    }();

    /**
     * Superclass for all types of Endpoint. This class is renderer
     * agnostic, as are any subclasses of it.
     */
    var EndpointRepresentation =
    /*#__PURE__*/
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
          this.instance.renderer.addEndpointClass(this.endpoint, c);
        }
      }, {
        key: "removeClass",
        value: function removeClass(c) {
          this.classes = this.classes.filter(function (_c) {
            return _c !== c;
          });
          this.instance.renderer.removeEndpointClass(this.endpoint, c);
        }
      }, {
        key: "clone",
        value: function clone() {
          return null;
        }
      }, {
        key: "compute",
        value: function compute(anchorPoint, orientation, endpointStyle) {
          // TODO this compute method could be provided in the same way that the renderers do it - via a simple object containing functions..i think.
          // it would be much more lightweight as we'd not need to create a class for each one.
          this.computedValue = this._compute(anchorPoint, orientation, endpointStyle);
          this.bounds.minX = this.x;
          this.bounds.minY = this.y;
          this.bounds.maxX = this.x + this.w;
          this.bounds.maxY = this.y + this.h;
        }
      }, {
        key: "setVisible",
        value: function setVisible(v) {
          this.instance.renderer.setEndpointVisible(this.endpoint, v);
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

    function findConnectionToUseForDynamicAnchor(ep, elementWithPrecedence) {
      var idx = 0;

      if (elementWithPrecedence != null) {
        for (var i = 0; i < ep.connections.length; i++) {
          if (ep.connections[i].sourceId === elementWithPrecedence || ep.connections[i].targetId === elementWithPrecedence) {
            idx = i;
            break;
          }
        }
      }

      return ep.connections[idx];
    }

    var typeParameters = ["connectorStyle", "connectorHoverStyle", "connectorOverlays", "connector", "connectionType", "connectorClass", "connectorHoverClass"];
    var Endpoint =
    /*#__PURE__*/
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

        _defineProperty(_assertThisInitialized(_this), "connectorPointerEvents", void 0);

        _defineProperty(_assertThisInitialized(_this), "anchor", void 0);

        _defineProperty(_assertThisInitialized(_this), "endpoint", void 0);

        _defineProperty(_assertThisInitialized(_this), "element", void 0);

        _defineProperty(_assertThisInitialized(_this), "elementId", void 0);

        _defineProperty(_assertThisInitialized(_this), "dragAllowedWhenFull", true);

        _defineProperty(_assertThisInitialized(_this), "scope", void 0);

        _defineProperty(_assertThisInitialized(_this), "timestamp", void 0);

        _defineProperty(_assertThisInitialized(_this), "portId", void 0);

        _defineProperty(_assertThisInitialized(_this), "floatingEndpoint", void 0);

        _defineProperty(_assertThisInitialized(_this), "maxConnections", void 0);

        _defineProperty(_assertThisInitialized(_this), "connectorClass", void 0);

        _defineProperty(_assertThisInitialized(_this), "connectorHoverClass", void 0);

        _defineProperty(_assertThisInitialized(_this), "_originalAnchor", void 0);

        _defineProperty(_assertThisInitialized(_this), "deleteAfterDragStop", void 0);

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

        _defineProperty(_assertThisInitialized(_this), "defaultLabelLocation", [0.5, 0.5]);

        _this.appendToDefaultType({
          connectionType: params.connectionType,
          maxConnections: params.maxConnections == null ? _this.instance.Defaults.maxConnections : params.maxConnections,
          // maximum number of connections this endpoint can be the source of.,
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
        _this.element = _this.instance.getElement(params.source);
        _this.uuid = params.uuid;
        _this.portId = params.portId;
        _this.floatingEndpoint = null;

        if (_this.uuid) {
          _this.instance.endpointsByUUID[_this.uuid] = _assertThisInitialized(_this);
        }

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
          // in place copies, for example, are transient.  they will never need to be retrieved during a paint cycle, because they dont move, and then they are deleted.
          _this.instance.router.addEndpoint(_assertThisInitialized(_this), _this.elementId);
        } // what does this do?


        extend(_assertThisInitialized(_this), params, typeParameters);
        _this.isSource = params.isSource || false;
        _this.isTemporarySource = params.isTemporarySource || false;
        _this.isTarget = params.isTarget || false;
        _this.connections = params.connections || [];
        _this.connectorPointerEvents = params["connector-pointer-events"];
        _this.scope = params.scope || instance.getDefaultScope();
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

        _this.setAnchor(anchorParamsToUse, true); // finally, set type if it was provided


        var type = ["default", params.type || ""].join(" ");

        _this.addType(type, params.data, true);

        return _this;
      }

      _createClass(Endpoint, [{
        key: "_updateAnchorClass",
        value: function _updateAnchorClass() {
          var ac = this.anchor.getCssClass();

          if (ac != null && ac.length > 0) {
            // stash old, get new
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
        } // TODO refactor, somehow, to take AnchorManager out of the equation.

      }, {
        key: "setPreparedAnchor",
        value: function setPreparedAnchor(anchor, doNotRepaint) {
          this.instance.anchorManager.clearContinuousAnchorPlacement(this.elementId);
          this.anchor = anchor;

          this._updateAnchorClass();

          if (!doNotRepaint) {
            this.instance.repaint(this.elementId);
          }

          return this;
        }
      }, {
        key: "setAnchor",
        value: function setAnchor(anchorParams, doNotRepaint) {
          var a = this.prepareAnchor(anchorParams);
          this.setPreparedAnchor(a, doNotRepaint);
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
        /**
         * Detaches this Endpoint from the given Connection.  If `deleteOnEmpty` is set to true and there are no
         * Connections after this one is detached, the Endpoint is deleted.
         * @param connection
         * @param idx
         */

      }, {
        key: "detachFromConnection",
        value: function detachFromConnection(connection, idx, transientDetach) {
          idx = idx == null ? this.connections.indexOf(connection) : idx;

          if (idx >= 0) {
            this.connections.splice(idx, 1);
            this.instance.renderer.refreshEndpoint(this);
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
        value: function detachFrom(targetEndpoint, fireEvent, originalEvent) {
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
                var oIdx = this === this.connections[i].endpoints[0] ? 1 : 0; // only change the other endpoint if this is its only connection.

                if (this.connections[i].endpoints[oIdx].connections.length === 1) {
                  this.connections[i].endpoints[oIdx].setVisible(v, true, true);
                }
              }
            }
          }
        }
      }, {
        key: "applyType",
        value: function applyType(t, doNotRepaint, typeMap) {
          _get(_getPrototypeOf(Endpoint.prototype), "applyType", this).call(this, t, doNotRepaint, typeMap);

          this.setPaintStyle(t.endpointStyle || t.paintStyle, doNotRepaint);
          this.setHoverPaintStyle(t.endpointHoverStyle || t.hoverPaintStyle, doNotRepaint);
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
          this.instance.renderer.applyEndpointType(this, t);
        }
      }, {
        key: "destroy",
        value: function destroy(force) {
          // TODO i feel like this anchor class stuff should be in the renderer? is it DOM specific?
          var anchorClass = this.instance.endpointAnchorClassPrefix + (this.currentAnchorClass ? "-" + this.currentAnchorClass : "");
          this.instance.removeClass(this.element, anchorClass);
          this.anchor = null;

          if (this.endpoint != null) {
            this.instance.renderer.destroyEndpoint(this);
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
        key: "setReferenceElement",
        value: function setReferenceElement(_el) {
          this.element = this.instance.getElement(_el);
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
        key: "setElement",
        value: function setElement(el) {
          var _this3 = this;

          var parentId = this.instance.getId(el),
              curId = this.elementId; // remove the endpoint from the list for the current endpoint's element

          removeWithFunction(this.instance.endpointsByElement[this.elementId], function (e) {
            return e.id === _this3.id;
          });
          this.element = this.instance.getElement(el);
          this.elementId = this.instance.getId(this.element);
          this.instance.router.rehomeEndpoint(this, curId, this.element);
          addToList(this.instance.endpointsByElement, parentId, this);
          return this;
        }
      }, {
        key: "connectorSelector",
        value: function connectorSelector() {
          return this.connections[0];
        }
      }, {
        key: "paint",
        value: function paint(params) {
          params = params || {};
          var timestamp = params.timestamp,
              recalc = !(params.recalc === false);

          if (!timestamp || this.timestamp !== timestamp) {
            var info = this.instance.updateOffset({
              elId: this.elementId,
              timestamp: timestamp
            });
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
                  element: this,
                  timestamp: timestamp
                };

                if (recalc && this.anchor.isDynamic && this.connections.length > 0) {
                  var c = findConnectionToUseForDynamicAnchor(this, params.elementWithPrecedence),
                      oIdx = c.endpoints[0] === this ? 1 : 0,
                      oId = oIdx === 0 ? c.sourceId : c.targetId,
                      oInfo = this.instance.getCachedData(oId);
                  anchorParams.index = oIdx === 0 ? 1 : 0;
                  anchorParams.connection = c;
                  anchorParams.txy = [oInfo.x, oInfo.y];
                  anchorParams.twh = [oInfo.w, oInfo.h];
                  anchorParams.tElement = c.endpoints[oIdx];
                  anchorParams.tRotation = this.instance.getRotation(oId);
                } else if (this.connections.length > 0) {
                  anchorParams.connection = this.connections[0];
                }

                anchorParams.rotation = this.instance.getRotation(this.elementId);
                ap = this.anchor.compute(anchorParams);
              }

              this.endpoint.compute(ap, this.anchor.getOrientation(this), this.paintStyleInUse);
              this.instance.renderer.paintEndpoint(this, this.paintStyleInUse);
              this.timestamp = timestamp; // paint overlays

              for (var i in this.overlays) {
                if (this.overlays.hasOwnProperty(i)) {
                  var o = this.overlays[i];

                  if (o.isVisible()) {
                    this.overlayPlacements[i] = this.instance.renderer.drawOverlay(o, this.endpoint, this.paintStyleInUse, this.getAbsoluteOverlayPosition(o));
                    this.instance.renderer.paintOverlay(o, this.overlayPlacements[i], {
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
        key: "prepareEndpoint",
        value: function prepareEndpoint(ep, typeId) {
          var _this4 = this;

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
          } // assign a clone function using a copy of endpointArgs. this is used when a drag starts: the endpoint that was dragged is cloned,
          // and the clone is left in its place while the original one goes off on a magical journey.
          // the copy is to get around a closure problem, in which endpointArgs ends up getting shared by
          // the whole world.
          //var argsForClone = jsPlumb.extend({}, endpointArgs)


          endpoint.clone = function () {
            // TODO this, and the code above, can be refactored to be more dry.
            if (isString(ep)) {
              return EndpointFactory.get(_this4, ep, endpointArgs);
            } else if (isArray(ep)) {
              endpointArgs = merge(ep[1], endpointArgs);
              return EndpointFactory.get(_this4, ep[0], endpointArgs);
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
            this.instance.renderer.destroyEndpoint(this);
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

    var DotEndpoint =
    /*#__PURE__*/
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
      } // TODO this compute method could be provided in the same way that the renderers do it - via a simple object containing functions..i think.
      // it would be much more lightweight as we'd not need to create a class for each one.


      _createClass(DotEndpoint, [{
        key: "_compute",
        value: function _compute(anchorPoint, orientation, endpointStyle) {
          //this.radius = endpointStyle.radius || this.radius
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

    var UINode = function UINode(instance, el) {
      _classCallCheck(this, UINode);

      this.instance = instance;
      this.el = el;

      _defineProperty(this, "group", void 0);
    };
    var UIGroup =
    /*#__PURE__*/
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
        key: "getDragArea",
        value: function getDragArea() {
          var da = this.instance.getSelector(this.el, SELECTOR_GROUP_CONTAINER);
          return da && da.length > 0 ? da[0] : this.el;
        } // this function, and getEndpoint below, are stubs for a future setup in which we can choose endpoint
        // and anchor based upon the connection and the index (source/target) of the endpoint to be proxied.

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

          var dragArea = this.getDragArea();
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
                _this3.getDragArea().removeChild(__el);
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
            this.manager.instance.remove(_el2, true);
          }

          this.children.length = 0;

          this.manager._updateConnectionsForGroup(this);
        } // it would be nice to type `_el` as an element here, but the type of the element is currently specified by the
        // concrete implementation of jsplumb (of which there is 'DOM',  a browser implementation, at the moment.

      }, {
        key: "_orphan",
        value: function _orphan(_el) {
          var groupPos = this.manager.instance.getOffset(this.el);
          var id = this.manager.instance.getId(_el);
          var pos = this.manager.instance.getOffset(_el);

          _el.parentNode.removeChild(_el);

          if (this.group) {
            pos.left += groupPos.left;
            pos.top += groupPos.top;
            this.group.getDragArea().appendChild(_el); // set as child of parent group, if there is one.
          } else {
            this.instance.appendElement(_el, this.instance.getContainer()); // set back as child of container
          }

          this.instance.setPosition(_el, pos);
          delete _el._jsPlumbParentGroup;
          return [id, pos];
        }
      }, {
        key: "orphanAll",
        value: function orphanAll() {
          var orphanedPositions = {};

          for (var i = 0; i < this.children.length; i++) {
            var newPosition = this._orphan(this.children[i]);

            orphanedPositions[newPosition[0]] = newPosition[1];
          }

          this.children.length = 0;

          for (var _i = 0; _i < this.childGroups.length; _i++) {
            var _newPosition = this._orphan(this.childGroups[_i].el);

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
              return false; // cannot add a group as a child to this group if it is an ancestor of this group.
            } // TODO what happens if the group is a member of another group?


            if (group.group != null) {
              group.group.removeGroup(group);
            }

            var elpos = this.instance.getOffset(group.el, true);
            var cpos = this.collapsed ? this.instance.getOffset(this.el, true) : this.instance.getOffset(this.getDragArea(), true);
            group.el[PARENT_GROUP_KEY] = this;
            this.childGroups.push(group); //group.el.parentNode && group.el.parentNode.removeChild(group.el)

            this.instance.appendElement(group.el, this.getDragArea());
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
            // console log?
            return false;
          }
        }
      }, {
        key: "removeGroup",
        value: function removeGroup(group) {
          if (group.group === this) {
            var d = this.getDragArea();

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
    /*#__PURE__*/
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
              otherConnMap = p.index === 0 ? _this._connectionTargetMap : _this._connectionSourceMap; // adjust group manager's map for source/target (depends on index).


          if (newGroup != null) {
            connMap[p.connection.id] = newGroup; // if source === target set the same ref in the other map

            if (p.connection.source === p.connection.target) {
              otherConnMap[p.connection.id] = newGroup;
            }
          } else {
            // otherwise if the connection's endpoint for index is no longer in a group, remove from the map.
            delete connMap[p.connection.id]; // if source === target delete the ref in the other map.

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
          //addGroup(params:{id:string, el:jsPlumbDOMElement, collapsed?:boolean}) {
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
          this.instance.addClass(group.el, GROUP_EXPANDED_CLASS);
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
              throw new TypeError("No such group [" + groupId + "]");
            }
          }

          return group;
        }
      }, {
        key: "getGroupFor",
        value: function getGroupFor(el) {
          var _el = this.instance.getElement(el);

          if (_el != null) {
            var c = this.instance.getContainer();
            var abort = false,
                _g = null;

            while (!abort) {
              if (_el == null || _el === c) {
                abort = true;
              } else {
                if (_el[PARENT_GROUP_KEY]) {
                  _g = _el[PARENT_GROUP_KEY];
                  abort = true;
                } else {
                  _el = _el.parentNode;
                }
              }
            }

            return _g;
          }
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
        value: function removeGroup(group, deleteMembers, manipulateDOM, doNotFireEvent) {
          var _this2 = this;

          var actualGroup = this.getGroup(group);
          this.expandGroup(actualGroup, true); // this reinstates any original connections and removes all proxies, but does not fire an event.

          var newPositions = {};

          if (deleteMembers) {
            // remove all child groups
            actualGroup.childGroups.forEach(function (cg) {
              return _this2.removeGroup(cg, deleteMembers, manipulateDOM);
            }); // remove all child nodes

            actualGroup.removeAll(manipulateDOM, doNotFireEvent);
          } else {
            // if we want to retain the child nodes then we need to test if there is a group that the parent of actualGroup.
            // if so, transfer the nodes to that group
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
            this.instance.remove(actualGroup.el);
          }

          delete this.groupMap[actualGroup.id];
          this.instance.fire(EVENT_GROUP_REMOVED, {
            group: actualGroup
          });
          return newPositions; // this will be null in the case or remove, but be a map of {id->[x,y]} in the case of orphan
        }
      }, {
        key: "removeAllGroups",
        value: function removeAllGroups(deleteMembers, manipulateDOM, doNotFireEvent) {
          for (var _g2 in this.groupMap) {
            this.removeGroup(this.groupMap[_g2], deleteMembers, manipulateDOM, doNotFireEvent);
          }
        }
      }, {
        key: "forEach",
        value: function forEach(f) {
          for (var key in this.groupMap) {
            f(this.groupMap[key]);
          }
        } // orphan(_el:jsPlumbDOMElement):[string, Offset] {

      }, {
        key: "orphan",
        value: function orphan(_el) {
          if (_el._jsPlumbParentGroup) {
            var id = this.instance.getId(_el);
            var pos = this.instance.getOffset(_el);

            _el.parentNode.removeChild(_el);

            this.instance.appendElement(_el, this.instance.getContainer());
            this.instance.setPosition(_el, pos);
            delete _el._jsPlumbParentGroup;
            return [id, pos];
          }
        }
      }, {
        key: "_setGroupVisible",
        value: function _setGroupVisible(group, state) {
          var m = group.el.querySelectorAll("[jtk-managed]");

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
          group.connections.internal.length = 0; // get all direct members, and any of their descendants.

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
          } // let groupEl = group.el, groupElId = this.instance.getId(groupEl)
          // this.instance.proxyConnection(conn, index, groupEl, groupElId, (conn:Connection, index:number) => { return group.getEndpoint(conn, index); }, (conn:Connection, index:number) => { return group.getAnchor(conn, index); })

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
                el = el.parentNode; // TODO DOM specific.
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
            // hide all connections
            this._setGroupVisible(actualGroup, false);

            actualGroup.collapsed = true;

            if (actualGroup.proxied) {
              this.instance.removeClass(groupEl, GROUP_EXPANDED_CLASS);
              this.instance.addClass(groupEl, GROUP_COLLAPSED_CLASS);
              var collapsedConnectionIds = new Set(); // collapses all connections in a group.

              var _collapseSet = function _collapseSet(conns, index) {
                for (var i = 0; i < conns.length; i++) {
                  var c = conns[i];

                  if (_this4._collapseConnection(c, index, actualGroup) === true) {
                    collapsedConnectionIds.add(c.id);
                  }
                }
              }; // setup proxies for sources and targets


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
            this.instance.removeClass(groupEl, GROUP_EXPANDED_CLASS);
            this.instance.addClass(groupEl, GROUP_COLLAPSED_CLASS);
          }
        }
        /**
         * Cascade a collapse from the given `collapsedGroup` into the given `targetGroup`.
         * @param collapsedGroup
         * @param targetGroup
         * @param collapsedIds Set of connection ids for already collapsed connections, which we can ignore.
         */

      }, {
        key: "cascadeCollapse",
        value: function cascadeCollapse(collapsedGroup, targetGroup, collapsedIds) {
          var _this5 = this;

          if (collapsedGroup.proxied) {
            // collapses all connections in a group.
            var _collapseSet = function _collapseSet(conns, index) {
              for (var i = 0; i < conns.length; i++) {
                var c = conns[i];

                if (!collapsedIds.has(c.id)) {
                  if (_this5._collapseConnection(c, index, collapsedGroup) === true) {
                    collapsedIds.add(c.id);
                  }
                }
              }
            }; // setup proxies for sources and targets


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
          /*|| !actualGroup.collapsed*/
          ) {
              return;
            }

          var groupEl = actualGroup.el;

          if (actualGroup.collapseParent == null) {
            this._setGroupVisible(actualGroup, true);

            actualGroup.collapsed = false;

            if (actualGroup.proxied) {
              this.instance.addClass(groupEl, GROUP_EXPANDED_CLASS);
              this.instance.removeClass(groupEl, GROUP_COLLAPSED_CLASS); // collapses all connections in a group.

              var _expandSet = function _expandSet(conns, index) {
                for (var i = 0; i < conns.length; i++) {
                  var c = conns[i];

                  _this6._expandConnection(c, index, actualGroup);
                }
              }; // setup proxies for sources and targets


              _expandSet(actualGroup.connections.source, 0);

              _expandSet(actualGroup.connections.target, 1);

              var _expandNestedGroup = function _expandNestedGroup(group) {
                // if the group is collapsed:
                // - all of its internal connections should remain hidden.
                // - all external connections should be proxied to this group we are expanding (`actualGroup`)
                // otherwise:
                // just expend it as usual
                if (group.collapsed) {
                  var _collapseSet = function _collapseSet(conns, index) {
                    for (var i = 0; i < conns.length; i++) {
                      var c = conns[i];

                      _this6._collapseConnection(c, index, group.collapseParent || group);
                    }
                  }; // setup proxies for sources and targets


                  _collapseSet(group.connections.source, 0);

                  _collapseSet(group.connections.target, 1); // hide internal connections - the group is collapsed


                  group.connections.internal.forEach(function (c) {
                    return c.setVisible(false);
                  }); // expand child groups

                  group.childGroups.forEach(_expandNestedGroup);
                } else {
                  _this6.expandGroup(group, doNotFireEvent);
                }
              }; // expand any nested groups. this will take into account if the nested group is collapsed.


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
            this.instance.addClass(groupEl, GROUP_EXPANDED_CLASS);
            this.instance.removeClass(groupEl, GROUP_COLLAPSED_CLASS);
          }
        }
        /**
         * Cascade an expand from the given `collapsedGroup` into the given `targetGroup`.
         * @param expandedGroup
         * @param targetGroup
         */

      }, {
        key: "cascadeExpand",
        value: function cascadeExpand(expandedGroup, targetGroup) {
          var _this7 = this;

          //  What to do.
          //
          // We assume this method is only called when targetGroup is legitimately a descendant of collapsedGroup.
          // Basically all the connections on this group have to be re-proxied onto collapsedGroup, and this group has to be hidden.
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
            }; // setup proxies for sources and targets


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
        value: function addToGroup(group, el, doNotFireEvent) {
          var _this8 = this;

          var actualGroup = this.getGroup(group);

          if (actualGroup) {
            var groupEl = actualGroup.el;

            var _one = function _one(el) {
              var isGroup = el[IS_GROUP_KEY] != null,
                  droppingGroup = el[GROUP_KEY];
              var currentGroup = el[PARENT_GROUP_KEY]; // if already a member of this group, do nothing

              if (currentGroup !== actualGroup) {
                var elpos = _this8.instance.getOffset(el);

                var cpos = actualGroup.collapsed ? _this8.instance.getOffset(groupEl, true) : _this8.instance.getOffset(actualGroup.getDragArea()); // otherwise, transfer to this group.

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

                _this8.instance.revalidate(elId);

                if (!doNotFireEvent) {
                  // TODO fire a "child group added" event in that case?
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

            this.instance.each(el, _one);
          }
        }
      }, {
        key: "removeFromGroup",
        value: function removeFromGroup(group, el, doNotFireEvent) {
          var _this9 = this;

          var actualGroup = this.getGroup(group);

          if (actualGroup) {
            // if this group is currently collapsed then any proxied connections for the given el (or its descendants) need
            // to be put back on their original element, and unproxied
            if (actualGroup.collapsed) {
              var _expandSet = function _expandSet(conns, index) {
                for (var i = 0; i < conns.length; i++) {
                  var c = conns[i];

                  if (c.proxies) {
                    for (var j = 0; j < c.proxies.length; j++) {
                      if (c.proxies[j] != null) {
                        var proxiedElement = c.proxies[j].originalEp.element;

                        if (proxiedElement === el || _this9.isElementDescendant(proxiedElement, el)) {
                          _this9._expandConnection(c, index, actualGroup);
                        }
                      }
                    }
                  }
                }
              }; // setup proxies for sources and targets


              _expandSet(actualGroup.connections.source.slice(), 0);

              _expandSet(actualGroup.connections.target.slice(), 1);
            }

            actualGroup.remove(el, null, doNotFireEvent);
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

    /**
     * Various geometry functions
     *
     * Copyright (c) 2020 jsPlumb Pty Ltd
     * https://jsplumbtoolkit.com
     *
     * Permission is hereby granted, free of charge, to any person
     * obtaining a copy of this software and associated documentation
     * files (the "Software"), to deal in the Software without
     * restriction, including without limitation the rights to use,
     * copy, modify, merge, publish, distribute, sublicense, and/or sell
     * copies of the Software, and to permit persons to whom the
     * Software is furnished to do so, subject to the following
     * conditions:
     *
     * The above copyright notice and this permission notice shall be
     * included in all copies or substantial portions of the Software.
     *
     * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
     * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
     * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
     * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
     * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
     * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
     * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
     * OTHER DEALINGS IN THE SOFTWARE.
     */
    var segmentMultipliers = [null, [1, -1], [1, 1], [-1, 1], [-1, -1]];
    var inverseSegmentMultipliers = [null, [-1, -1], [-1, 1], [1, 1], [1, -1]];
    var TWO_PI = 2 * Math.PI;
    var jsPlumbGeometry =
    /*#__PURE__*/
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
        /**
         * @name gradient
         * @function
         * @desc Calculates the gradient of a line between the two points.
         * @param {PointXY} p1 First point, either as a 2 entry array or object with `left` and `top` properties.
         * @param {PointXY} p2 Second point, either as a 2 entry array or object with `left` and `top` properties.
         * @return {number} The gradient of a line between the two points.
         */

      }, {
        key: "gradient",
        value: function gradient(p1, p2) {
          if (p2.x === p1.x) return p2.y > p1.y ? Infinity : -Infinity;else if (p2.y === p1.y) return p2.x > p1.x ? 0 : -0;else return (p2.y - p1.y) / (p2.x - p1.x);
        }
        /**
         * @name normal
         * @function
         * @desc Calculates the gradient of a normal to a line between the two points.
         * @param {PointXY} p1 First point, either as a 2 entry array or object with `left` and `top` properties.
         * @param {PointXY} p2 Second point, either as a 2 entry array or object with `left` and `top` properties.
         * @return {number} The gradient of a normal to a line between the two points.
         */

      }, {
        key: "normal",
        value: function normal(p1, p2) {
          return -1 / this.gradient(p1, p2);
        }
        /**
         * @name lineLength
         * @function
         * @desc Calculates the length of a line between the two points.
         * @param {PointXY} p1 First point, either as a 2 entry array or object with `left` and `top` properties.
         * @param {PointXY} p2 Second point, either as a 2 entry array or object with `left` and `top` properties.
         * @return {number} The length of a line between the two points.
         */

      }, {
        key: "lineLength",
        value: function lineLength(p1, p2) {
          return Math.sqrt(Math.pow(p2.y - p1.y, 2) + Math.pow(p2.x - p1.x, 2));
        }
        /**
         * @name quadrant
         * @function
         * @desc Calculates the quadrant in which the angle between the two points lies.
         * @param {PointXY} p1 First point, either as a 2 entry array or object with `left` and `top` properties.
         * @param {PointXY} p2 Second point, either as a 2 entry array or object with `left` and `top` properties.
         * @return {Quadrant} The quadrant - 1 for upper right, 2 for lower right, 3 for lower left, 4 for upper left.
         */

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
        /**
         * @name theta
         * @function
         * @desc Calculates the angle between the two points.
         * @param {PointXY} p1 First point, either as a 2 entry array or object with `left` and `top` properties.
         * @param {PointXY} p2 Second point, either as a 2 entry array or object with `left` and `top` properties.
         * @return {number} The angle between the two points.
         */

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
        /**
         * @name intersects
         * @function
         * @desc Calculates whether or not the two rectangles intersect.
         * @param {RectangleXY} r1 First rectangle, as a js object in the form `{x:.., y:.., w:.., h:..}`
         * @param {RectangleXY} r2 Second rectangle, as a js object in the form `{x:.., y:.., w:.., h:..}`
         * @return {boolean} True if the rectangles intersect, false otherwise.
         */

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
        /**
         * @name encloses
         * @function
         * @desc Calculates whether or not r2 is completely enclosed by r1.
         * @param {RectangleXY} r1 First rectangle, as a js object in the form `{x:.., y:.., w:.., h:..}`
         * @param {RectangleXY} r2 Second rectangle, as a js object in the form `{x:.., y:.., w:.., h:..}`
         * @param {boolean} [allowSharedEdges=false] If true, the concept of enclosure allows for one or more edges to be shared by the two rectangles.
         * @return {boolean} True if r1 encloses r2, false otherwise.
         */

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
        /**
         * @name pointOnLine
         * @function
         * @desc Calculates a point on the line from `fromPoint` to `toPoint` that is `distance` units along the length of the line.
         * @param {PointXY} fromPoint First point, either as a 2 entry array or object with `left` and `top` properties.
         * @param {PointXY} toPoint Second point, either as a 2 entry array or object with `left` and `top` properties.
         * @param {number} distance Distance along the length that the point should be located.
         * @return {PointXY} Point on the line, in the form `{ x:..., y:... }`.
         */

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
        /**
         * @name perpendicularLineTo
         * @function
         * @desc Calculates a line of length `length` that is perpendicular to the line from `fromPoint` to `toPoint` and passes through `toPoint`.
         * @param {PointXY} fromPoint First point, either as a 2 entry array or object with `left` and `top` properties.
         * @param {PointXY} toPoint Second point, either as a 2 entry array or object with `left` and `top` properties.
         * @param {number} length Length of the line to generate
         * @return {LineXY} Perpendicular line, in the form `[ { x:..., y:... }, { x:..., y:... } ]`.
         */

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
    } // used by edgeSortFunctions


    function leftAndTopSort(a, b) {
      var p1 = a[0][0] < 0 ? -Math.PI - a[0][0] : Math.PI - a[0][0],
          p2 = b[0][0] < 0 ? -Math.PI - b[0][0] : Math.PI - b[0][0];
      return p1 - p2;
    } // used by placeAnchors


    var edgeSortFunctions = {
      "top": leftAndTopSort,
      "right": rightAndBottomSort,
      "bottom": rightAndBottomSort,
      "left": leftAndTopSort
    };
    var AnchorManager =
    /*#__PURE__*/
    function () {
      function AnchorManager(instance) {
        _classCallCheck(this, AnchorManager);

        this.instance = instance;

        _defineProperty(this, "_amEndpoints", {});

        _defineProperty(this, "continuousAnchorLocations", {});

        _defineProperty(this, "continuousAnchorOrientations", {});

        _defineProperty(this, "anchorLists", {});

        _defineProperty(this, "floatingConnections", {});
      }

      _createClass(AnchorManager, [{
        key: "reset",
        value: function reset() {
          this._amEndpoints = {};
          this.anchorLists = {};
        }
      }, {
        key: "placeAnchors",
        value: function placeAnchors(instance, elementId, _anchorLists) {
          var _this = this;

          var cd = instance.getCachedData(elementId),
              placeSomeAnchors = function placeSomeAnchors(desc, element, unsortedConnections, isHorizontal, otherMultiplier, orientation) {
            if (unsortedConnections.length > 0) {
              var sc = sortHelper(unsortedConnections, edgeSortFunctions[desc]),
                  // puts them in order based on the target element's pos on screen
              reverse = desc === "right" || desc === "top",
                  anchors = placeAnchorsOnLine(cd, sc, isHorizontal, otherMultiplier, reverse); // takes a computed anchor position and adjusts it for parent offset and scroll, then stores it.

              var _setAnchorLocation = function _setAnchorLocation(endpoint, anchorPos) {
                _this.continuousAnchorLocations[endpoint.id] = [anchorPos[0], anchorPos[1], anchorPos[2], anchorPos[3]];
                _this.continuousAnchorOrientations[endpoint.id] = orientation;
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
        key: "addFloatingConnection",
        value: function addFloatingConnection(key, conn) {
          this.floatingConnections[key] = conn;
        }
      }, {
        key: "removeFloatingConnection",
        value: function removeFloatingConnection(key) {
          delete this.floatingConnections[key];
        }
      }, {
        key: "newConnection",
        value: function newConnection(conn) {
          var _this2 = this;

          var sourceId = conn.sourceId,
              targetId = conn.targetId,
              ep = conn.endpoints,
              doRegisterTarget = true,
              registerConnection = function registerConnection(otherIndex, otherEndpoint, otherAnchor) {
            if (sourceId === targetId && otherAnchor.isContinuous) {
              // remove the target endpoint's canvas.  we dont need it.
              _this2.instance.renderer.destroyEndpoint(ep[1]);

              doRegisterTarget = false;
            }
          };

          registerConnection(0, ep[0], ep[0].anchor);

          if (doRegisterTarget) {
            registerConnection(1, ep[1], ep[1].anchor);
          }
        }
      }, {
        key: "removeEndpointFromAnchorLists",
        value: function removeEndpointFromAnchorLists(endpoint) {
          (function (list, eId) {
            if (list) {
              // transient anchors dont get entries in this list.
              var f = function f(e) {
                return e[4] === eId;
              };

              removeWithFunction(list.top, f);
              removeWithFunction(list.left, f);
              removeWithFunction(list.bottom, f);
              removeWithFunction(list.right, f);
            }
          })(this.anchorLists[endpoint.elementId], endpoint.id);
        }
      }, {
        key: "connectionDetached",
        value: function connectionDetached(connection) {
          if (connection.floatingId) {
            this.removeEndpointFromAnchorLists(connection.floatingEndpoint);
          } // remove from anchorLists


          this.removeEndpointFromAnchorLists(connection.endpoints[0]);
          this.removeEndpointFromAnchorLists(connection.endpoints[1]);
        }
      }, {
        key: "addEndpoint",
        value: function addEndpoint(endpoint, elementId) {
          addToList(this._amEndpoints, elementId, endpoint);
        }
      }, {
        key: "changeId",
        value: function changeId(oldId, newId) {
          this._amEndpoints[newId] = this._amEndpoints[oldId];
          delete this._amEndpoints[oldId];
        }
      }, {
        key: "deleteEndpoint",
        value: function deleteEndpoint(endpoint) {
          removeWithFunction(this._amEndpoints[endpoint.elementId], function (e) {
            return e.id === endpoint.id;
          });
          this.removeEndpointFromAnchorLists(endpoint);
        }
      }, {
        key: "clearFor",
        value: function clearFor(elementId) {
          delete this._amEndpoints[elementId];
          this._amEndpoints[elementId] = [];
        } // updates the given anchor list by either updating an existing anchor's info, or adding it. this function
        // also removes the anchor from its previous list, if the edge it is on has changed.
        // all connections found along the way (those that are connected to one of the faces this function
        // operates on) are added to the connsToPaint list, as are their endpoints. in this way we know to repaint
        // them wthout having to calculate anything else about them.

      }, {
        key: "_updateAnchorList",
        value: function _updateAnchorList(lists, theta, order, conn, aBoolean, otherElId, idx, reverse, edgeId, connsToPaint, endpointsToPaint) {
          // first try to find the exact match, but keep track of the first index of a matching element id along the way.s
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
              listToRemoveFrom.splice(rIdx, 1); // get all connections from this list

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
            var insertIdx = reverse ?  0 : listToAddTo.length; // of course we will get this from having looked through the array shortly.

            listToAddTo.splice(insertIdx, 0, values);
          } // store this for next time.


          endpoint._continuousAnchorEdge = edgeId;
        } //
        // moves the given endpoint from `currentId` to `element`.
        // This involves:
        //
        // 1. changing the key in _amEndpoints under which the endpoint is stored
        // 2. changing the source or target values in all of the endpoint's connections
        // 3. changing the array in connectionsByElementId in which the endpoint's connections
        //    are stored (done by either sourceChanged or updateOtherEndpoint)
        //

      }, {
        key: "rehomeEndpoint",
        value: function rehomeEndpoint(ep, currentId, element) {
          var eps = this._amEndpoints[currentId] || [],
              elementId = this.instance.getId(element);

          if (elementId !== currentId) {
            var idx = eps.indexOf(ep);

            if (idx > -1) {
              var _ep = eps.splice(idx, 1)[0];
              this.addEndpoint(_ep, elementId);
            }
          }

          for (var i = 0; i < ep.connections.length; i++) {
            this.instance.sourceOrTargetChanged(currentId, ep.elementId, ep.connections[i], ep.element, ep.connections[i].sourceId === currentId ? 0 : 1);
          }
        }
      }, {
        key: "redraw",
        value: function redraw(elementId, ui, timestamp, offsetToUI) {
          var connectionsToPaint = new Set(),
              endpointsToPaint = new Set(),
              anchorsToUpdate = new Set();

          if (!this.instance._suspendDrawing) {
            // get all the endpoints for this element
            var ep = this._amEndpoints[elementId] || [];
            timestamp = timestamp || uuid(); // offsetToUI are values that would have been calculated in the dragManager when registering
            // an endpoint for an element that had a parent (somewhere in the hierarchy) that had been
            // registered as draggable.

            offsetToUI = offsetToUI || {
              left: 0,
              top: 0
            };
            var offsetToUse = null; // TODO updateOffset should take an OffsetAndSize object, not a ViewportElement.

            if (ui) {
              offsetToUse = {
                left: ui.x + offsetToUI.left,
                top: ui.y + offsetToUI.top
              };
            } // valid for one paint cycle.


            var myOffset = this.instance.updateOffset({
              elId: elementId,
              offset: offsetToUse,
              recalc: false,
              timestamp: timestamp
            }),
                orientationCache = {};
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
                      endpoints: [anEndpoint, anEndpoint],
                      paint: function paint() {}
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

                      if (elementId !== targetId) {
                        this.instance.updateOffset({
                          elId: targetId,
                          timestamp: timestamp
                        });
                      }

                      if (elementId !== sourceId) {
                        this.instance.updateOffset({
                          elId: sourceId,
                          timestamp: timestamp
                        });
                      }

                      var td = this.instance.getCachedData(targetId),
                          sd = this.instance.getCachedData(sourceId);

                      if (targetId === sourceId && (sourceContinuous || targetContinuous)) {
                        // here we may want to improve this by somehow determining the face we'd like
                        // to put the connector on.  ideally, when drawing, the face should be calculated
                        // by determining which face is closest to the point at which the mouse button
                        // was released.  for now, we're putting it on the top face.
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
                        otherEndpoint.paint({
                          elementWithPrecedence: elementId,
                          timestamp: timestamp
                        });
                        connectionsToPaint.add(anEndpoint.connections[i]); // all the connections for the other endpoint now need to be repainted

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
              } // now place all the continuous anchors we need to

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
              } // now that continuous anchors have been placed, paint all the endpoints for this element and any other endpoints we came across as a result of the continuous anchors.

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
                var _ep2 = _step3.value;
                var cd = this.instance.getCachedData(_ep2.elementId);

                _ep2.paint({
                  timestamp: timestamp,
                  offset: cd
                });
              } // paint current floating connection for this element, if there is one.

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

            var fc = this.floatingConnections[elementId];

            if (fc) {
              fc.paint({
                timestamp: timestamp,
                recalc: false,
                elId: elementId
              });
            } // paint all the connections


            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = connectionsToPaint[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var c = _step4.value;
                c.paint({
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
          } // since we only support rotation around the center of an element these two lines don't have to take rotation
          // into account.


          var theta = Math.atan2(td.c[1] - sd.c[1], td.c[0] - sd.c[0]),
              theta2 = Math.atan2(sd.c[1] - td.c[1], sd.c[0] - td.c[0]); // --------------------------------------------------------------------------------------
          // improved face calculation. get midpoints of each face for source and target, then put in an array with all combinations of
          // source/target faces. sort this array by distance between midpoints. the entry at index 0 is our preferred option. we can
          // go through the array one by one until we find an entry in which each requested face is supported.

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
          }); // now go through this list and try to get an entry that satisfies both (there will be one, unless one of the anchors
          // declares no available faces)

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
          } // --------------------------------------------------------------------------------------


          return {
            a: [sourceEdge, targetEdge],
            theta: theta,
            theta2: theta2
          };
        }
      }]);

      return AnchorManager;
    }();

    /*
     * Default router. Defers to an AnchorManager for placement of anchors, and connector paint routines for paths.
     * Currently this is a placeholder and acts as a facade to the pre-existing anchor manager. The Toolkit edition
     * will make use of concept to provide more advanced routing.
     *
     * Copyright (c) 2010 - 2020 jsPlumb (hello@jsplumbtoolkit.com)
     *
     * https://jsplumbtoolkit.com
     * https://github.com/jsplumb/jsplumb
     *
     * Dual licensed under the MIT and GPL2 licenses.
     */
    var DefaultRouter =
    /*#__PURE__*/
    function () {
      function DefaultRouter(instance) {
        _classCallCheck(this, DefaultRouter);

        this.instance = instance;

        _defineProperty(this, "anchorManager", void 0);

        this.anchorManager = new AnchorManager(this.instance);
      }

      _createClass(DefaultRouter, [{
        key: "reset",
        value: function reset() {
          this.anchorManager.reset();
        }
      }, {
        key: "changeId",
        value: function changeId(oldId, newId) {
          this.anchorManager.changeId(oldId, newId);
        }
      }, {
        key: "newConnection",
        value: function newConnection(conn) {
          this.anchorManager.newConnection(conn);
        }
      }, {
        key: "connectionDetached",
        value: function connectionDetached(connInfo) {
          this.anchorManager.connectionDetached(connInfo);
        }
      }, {
        key: "redraw",
        value: function redraw(elementId, ui, timestamp, offsetToUI) {
          return this.anchorManager.redraw(elementId, ui, timestamp, offsetToUI);
        }
      }, {
        key: "deleteEndpoint",
        value: function deleteEndpoint(endpoint) {
          this.anchorManager.deleteEndpoint(endpoint);
        }
      }, {
        key: "rehomeEndpoint",
        value: function rehomeEndpoint(ep, currentId, element) {
          this.anchorManager.rehomeEndpoint(ep, currentId, element);
        }
      }, {
        key: "addEndpoint",
        value: function addEndpoint(endpoint, elementId) {
          this.anchorManager.addEndpoint(endpoint, elementId);
        }
      }, {
        key: "computePath",
        value: function computePath(connection, timestamp) {
          var sourceInfo = this.instance.updateOffset({
            elId: connection.sourceId
          }),
              // TODO dont create these intermediate sourceOffset/targetOffset objects, just use the ViewportElements.
          sourceOffset = {
            left: sourceInfo.x,
            top: sourceInfo.y
          },
              targetInfo = this.instance.updateOffset({
            elId: connection.targetId
          }),
              targetOffset = {
            left: targetInfo.x,
            top: targetInfo.y
          },
              sE = connection.endpoints[0],
              tE = connection.endpoints[1];
          var sAnchorP = sE.anchor.getCurrentLocation({
            xy: [sourceInfo.x, sourceInfo.y],
            wh: [sourceInfo.w, sourceInfo.h],
            element: sE,
            timestamp: timestamp,
            rotation: sourceInfo.r
          }),
              tAnchorP = tE.anchor.getCurrentLocation({
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
      }]);

      return DefaultRouter;
    }();

    var SelectionBase =
    /*#__PURE__*/
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
            return _this.instance.renderer.setHover(c, h);
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
    /*#__PURE__*/
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
        }
      }, {
        key: "setAnchor",
        value: function setAnchor(a) {
          this.each(function (ep) {
            return ep.setAnchor(a);
          });
        }
      }, {
        key: "deleteEveryConnection",
        value: function deleteEveryConnection() {
          this.each(function (ep) {
            return ep.deleteEveryConnection();
          });
        }
      }, {
        key: "deleteAll",
        value: function deleteAll() {
          var _this = this;

          this.each(function (ep) {
            return _this.instance.deleteEndpoint(ep);
          });
          this.clear();
        }
      }]);

      return EndpointSelection;
    }(SelectionBase);

    var ConnectionSelection =
    /*#__PURE__*/
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
          this.each(function (c) {
            return c.paint();
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
        }
      };
    } //
    // rotate the given rectangle around its center, and return the new bounds, plus new center.
    //


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
    /*#__PURE__*/
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
        } // ---------------------- PUBLIC -----------------------------

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
        /**
         * Updates the element with the given id. Any of the provided values may be null, in which case they are ignored (we never overwrite an
         * existing value with null).
         * @param id
         * @param x
         * @param y
         * @param width
         * @param height
         * @param rotation
         */

      }, {
        key: "updateElement",
        value: function updateElement(id, x, y, width, height, rotation) {
          var e = getsert(this._elementMap, id, EMPTY_POSITION);

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
        /**
         * Creates an empty entry for an element with the given ID.
         * @param id
         */

      }, {
        key: "registerElement",
        value: function registerElement(id) {
          return this.updateElement(id, 0, 0, 0, 0, 0);
        }
        /**
         * Adds the element with the given id, with the given values for x, y, width, height and rotation. Any of these may be null.
         * @param id
         * @param x
         * @param y
         * @param width
         * @param height
         * @param rotation
         */

      }, {
        key: "addElement",
        value: function addElement(id, x, y, width, height, rotation) {
          return this.updateElement(id, x, y, width, height, rotation);
        }
        /**
         * Rotates the element with the given id, recalculating bounds afterwards.
         * @param id
         * @param rotation
         */

      }, {
        key: "rotateElement",
        value: function rotateElement(id, rotation) {
          var e = getsert(this._elementMap, id, EMPTY_POSITION);
          e.r = rotation || 0;

          this._finaliseUpdate(id, e); //this._fireUpdate({type:"rotate", id:id, rotation:e.r})


          return e;
        }
        /**
         * Gets the width of the content managed by the viewport, taking any rotated elements into account.
         */

      }, {
        key: "getBoundsWidth",
        value: function getBoundsWidth() {
          return this._bounds.maxx - this._bounds.minx;
        }
        /**
         * Gets the height of the content managed by the viewport, taking any rotated elements into account.
         */

      }, {
        key: "getBoundsHeight",
        value: function getBoundsHeight() {
          return this._bounds.maxy - this._bounds.miny;
        }
        /**
         * Gets the leftmost point of the content managed by the viewport, taking any rotated elements into account.
         */

      }, {
        key: "getX",
        value: function getX() {
          return this._bounds.minx;
        }
        /**
         * Gets the topmost of the content managed by the viewport, taking any rotated elements into account.
         */

      }, {
        key: "getY",
        value: function getY() {
          return this._bounds.miny;
        }
        /**
         * Sets the size of the element with the given ID, recalculating bounds.
         * @param id
         * @param w
         * @param h
         */

      }, {
        key: "setSize",
        value: function setSize(id, w, h) {
          if (this._elementMap.has(id)) {
            return this.updateElement(id, null, null, w, h, null);
          }
        }
        /**
         * Sets the [x,y] position of the element with the given ID, recalculating bounds.
         * @param id
         * @param x
         * @param y
         */

      }, {
        key: "setPosition",
        value: function setPosition(id, x, y) {
          if (this._elementMap.has(id)) {
            return this.updateElement(id, x, y, null, null, null);
          }
        }
        /**
         * Clears the internal state of the viewport, removing all elements.
         */

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
        /**
         * Remove the element with the given ID from the viewport.
         * @param id
         */

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
        /**
         * Gets the position of the element. This returns both the original position, and also the translated position of the element. Certain internal methods, such as the anchor
         * calculation code, use the unrotated position and then subsequently apply the element's rotation to any calculated positions.
         * Other parts of the codebase - the Toolkit's magnetizer or pan/zoom widget, for instance - are interested in the rotated position.
         * @param id
         */

      }, {
        key: "getPosition",
        value: function getPosition(id) {
          return this._elementMap.get(id);
        }
        /**
         * Get all elements managed by the Viewport.
         */

      }, {
        key: "getElements",
        value: function getElements() {
          return this._elementMap;
        }
        /**
         * Returns whether or not the viewport is empty.
         */

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
              for (var i = 0, j = input.length; i < j; i++) {
                r.push(instance.info(input[i]).id);
              }
            } else {
              r.push(instance.info(input).id);
            }
          }
        }
      }

      return r;
    }

    var JsPlumbInstance =
    /*#__PURE__*/
    function (_EventGenerator) {
      _inherits(JsPlumbInstance, _EventGenerator);

      function JsPlumbInstance(_instanceIndex, renderer, defaults, helpers) {
        var _this;

        _classCallCheck(this, JsPlumbInstance);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(JsPlumbInstance).call(this));
        _this._instanceIndex = _instanceIndex;
        _this.renderer = renderer;

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

        _defineProperty(_assertThisInitialized(_this), "hoverClass", "jtk-hover");

        _defineProperty(_assertThisInitialized(_this), "endpointClass", "jtk-endpoint");

        _defineProperty(_assertThisInitialized(_this), "endpointConnectedClass", "jtk-endpoint-connected");

        _defineProperty(_assertThisInitialized(_this), "endpointFullClass", "jtk-endpoint-full");

        _defineProperty(_assertThisInitialized(_this), "endpointDropAllowedClass", "jtk-endpoint-drop-allowed");

        _defineProperty(_assertThisInitialized(_this), "endpointDropForbiddenClass", "jtk-endpoint-drop-forbidden");

        _defineProperty(_assertThisInitialized(_this), "overlayClass", "jtk-overlay");

        _defineProperty(_assertThisInitialized(_this), "draggingClass", "jtk-dragging");

        _defineProperty(_assertThisInitialized(_this), "elementDraggingClass", "jtk-element-dragging");

        _defineProperty(_assertThisInitialized(_this), "sourceElementDraggingClass", "jtk-source-element-dragging");

        _defineProperty(_assertThisInitialized(_this), "endpointAnchorClassPrefix", "jtk-endpoint-anchor");

        _defineProperty(_assertThisInitialized(_this), "targetElementDraggingClass", "jtk-target-element-dragging");

        _defineProperty(_assertThisInitialized(_this), "hoverSourceClass", "jtk-source-hover");

        _defineProperty(_assertThisInitialized(_this), "hoverTargetClass", "jtk-target-hover");

        _defineProperty(_assertThisInitialized(_this), "dragSelectClass", "jtk-drag-select");

        _defineProperty(_assertThisInitialized(_this), "connections", []);

        _defineProperty(_assertThisInitialized(_this), "endpointsByElement", {});

        _defineProperty(_assertThisInitialized(_this), "endpointsByUUID", {});

        _defineProperty(_assertThisInitialized(_this), "allowNestedGroups", void 0);

        _defineProperty(_assertThisInitialized(_this), "_curIdStamp", 1);

        _defineProperty(_assertThisInitialized(_this), "_offsetTimestamps", {});

        _defineProperty(_assertThisInitialized(_this), "viewport", new Viewport());

        _defineProperty(_assertThisInitialized(_this), "router", void 0);

        _defineProperty(_assertThisInitialized(_this), "anchorManager", void 0);

        _defineProperty(_assertThisInitialized(_this), "groupManager", void 0);

        _defineProperty(_assertThisInitialized(_this), "_connectionTypes", {});

        _defineProperty(_assertThisInitialized(_this), "_endpointTypes", {});

        _defineProperty(_assertThisInitialized(_this), "_container", void 0);

        _defineProperty(_assertThisInitialized(_this), "_managedElements", {});

        _defineProperty(_assertThisInitialized(_this), "_floatingConnections", {});

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
        _this.router = new DefaultRouter(_assertThisInitialized(_this)); // TODO we don't want to expose the anchor manager on the instance. we dont want to expose it on Router, either.
        // this cast would currently mean any alternative Router could fail (if it didn't expose an anchorManager).
        // this is something that will need to be refactored before the Toolkit edition 4.x can be released.

        _this.anchorManager = _this.router.anchorManager;
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
        value: function getOffset(el, relativeToRoot, container) {
          return this._helpers.getOffset ? this._helpers.getOffset(el, relativeToRoot, container) : this._getOffset(el, relativeToRoot, container);
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
        key: "getZoom",
        value: function getZoom() {
          return this._zoom;
        }
      }, {
        key: "info",
        value: function info(el) {
          if (el == null) {
            return null;
          } else if (el.nodeType === 3 || el.nodeType === 8) {
            return {
              el: el,
              text: true
            };
          } else {
            var _el = this.getElement(el);

            return {
              el: _el,
              id: isString(el) && _el == null ? el : this.getId(_el)
            };
          }
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
        key: "getInternalId",
        value: function getInternalId(element) {
          var id = element._jsplumbid;

          if (id == null) {
            id = "jsplumb_" + this._instanceIndex + "_" + this._idstamp();
            element._jsplumbid = id;
          }

          return id;
        }
      }, {
        key: "getId",
        value: function getId(element, uuid) {
          if (isString(element)) {
            return element;
          }

          if (element == null) {
            return null;
          }

          var id = this.getAttribute(element, "id");

          if (!id || id === "undefined") {
            // check if fixed uuid parameter is given
            if (arguments.length === 2 && arguments[1] !== undefined) {
              id = uuid;
            } else if (arguments.length === 1 || arguments.length === 3 && !arguments[2]) {
              id = "jsPlumb_" + this._instanceIndex + "_" + this._idstamp();
            }

            this.setAttribute(element, "id", id);
          }

          return id;
        }
        /**
         * Set the id of the given element. Changes all the refs etc.
         * @param el
         * @param newId
         * @param doNotSetAttribute
         */

      }, {
        key: "setId",
        value: function setId(el, newId, doNotSetAttribute) {
          //
          var id, _el;

          if (isString(el)) {
            id = el;
          } else {
            _el = this.getElement(el);
            id = this.getId(_el);
          }

          var sConns = this.getConnections({
            source: id,
            scope: '*'
          }, true),
              tConns = this.getConnections({
            target: id,
            scope: '*'
          }, true);
          newId = "" + newId;

          if (!doNotSetAttribute) {
            _el = this.getElement(id);
            this.setAttribute(_el, "id", newId);
          } else {
            _el = this.getElement(newId);
          }

          this.endpointsByElement[newId] = this.endpointsByElement[id] || [];

          for (var i = 0, ii = this.endpointsByElement[newId].length; i < ii; i++) {
            this.endpointsByElement[newId][i].setElementId(newId);
            this.endpointsByElement[newId][i].setReferenceElement(_el);
          }

          delete this.endpointsByElement[id];
          this._managedElements[newId] = this._managedElements[id];
          delete this._managedElements[id];

          var _conns = function _conns(list, epIdx, type) {
            for (var _i = 0, _ii = list.length; _i < _ii; _i++) {
              list[_i].endpoints[epIdx].setElementId(newId);

              list[_i].endpoints[epIdx].setReferenceElement(_el);

              list[_i][type + "Id"] = newId;
              list[_i][type] = _el;
            }
          };

          _conns(sConns, 0, SOURCE);

          _conns(tConns, 1, TARGET);

          this.repaint(newId);
        }
      }, {
        key: "setIdChanged",
        value: function setIdChanged(oldId, newId) {
          this.setId(oldId, newId, true);
        }
      }, {
        key: "getCachedData",
        value: function getCachedData(elId) {
          var o = this.viewport.getPosition(elId);

          if (!o) {
            return this.updateOffset({
              elId: elId
            });
          } else {
            return o;
          }
        } // ------------------  element selection ------------------------

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

          var scope = options.scope || this.getDefaultScope(),
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
          params.scope = params.scope || "*";
          var noElementFilters = !params.element && !params.source && !params.target,
              elements = noElementFilters ? "*" : prepareList(this, params.element),
              sources = noElementFilters ? "*" : prepareList(this, params.source),
              targets = noElementFilters ? "*" : prepareList(this, params.target),
              scopes = prepareList(this, params.scope, true);
          var ep = [];

          for (var _el2 in this.endpointsByElement) {
            var either = filterList(elements, _el2, true),
                source = filterList(sources, _el2, true),
                sourceMatchExact = sources !== "*",
                target = filterList(targets, _el2, true),
                targetMatchExact = targets !== "*"; // if they requested 'either' then just match scope. otherwise if they requested 'source' (not as a wildcard) then we have to match only endpoints that have isSource set to to true, and the same thing with isTarget.

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
          // get container as element and set container.
          this._container = this.getElement(c); // tell people.

          this.fire(EVENT_CONTAINER_CHANGE, this._container);
        }
      }, {
        key: "_set",
        value: function _set(c, el, idx, doNotRepaint) {
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

          /*cEl = c[_st.el],*/
          sid,
              sep,
              oldEndpoint = c.endpoints[idx];
          var evtParams = {
            index: idx,
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
              ep = null; // dont change source/target if the element is already the one given.
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

            if (!doNotRepaint) {
              c.paint();
            }
          }

          evtParams.element = el;
          return evtParams;
        }
      }, {
        key: "setSource",
        value: function setSource(connection, el, doNotRepaint) {
          var p = this._set(connection, el, 0, doNotRepaint);

          this.sourceOrTargetChanged(p.originalSourceId, p.newSourceId, connection, p.el, 0);
        }
      }, {
        key: "setTarget",
        value: function setTarget(connection, el, doNotRepaint) {
          var p = this._set(connection, el, 1, doNotRepaint);

          connection.updateConnectedClass();
        }
        /**
         * Returns whether or not hover is currently suspended.
         */

      }, {
        key: "isHoverSuspended",
        value: function isHoverSuspended() {
          return this.hoverSuspended;
        }
        /**
         * Sets whether or not drawing is suspended.
         * @param val True to suspend, false to enable.
         * @param repaintAfterwards If true, repaint everything afterwards.
         */

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
          var myOffset = this._managedElements[endpoint.elementId].info;
          var anchorLoc = endpoint.anchor.compute({
            xy: [myOffset.x, myOffset.y],
            wh: [myOffset.w, myOffset.h],
            element: endpoint,
            timestamp: timestamp || this._suspendedAt,
            rotation: this._managedElements[endpoint.elementId].rotation
          });
          return anchorLoc;
        } // return time for when drawing was suspended.

      }, {
        key: "getSuspendedAt",
        value: function getSuspendedAt() {
          return this._suspendedAt;
        }
        /**
         * Suspend drawing, run the given function, and then re-enable drawing, optionally repainting everything.
         * @param fn Function to run while drawing is suspended.
         * @param doNotRepaintAfterwards Whether or not to repaint everything after drawing is re-enabled.
         */

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
        key: "getDefaultScope",
        value: function getDefaultScope() {
          return this.DEFAULT_SCOPE;
        }
        /**
         * Execute the given function for each of the given elements.
         * @param spec An Element, or an element id, or an array of elements/element ids.
         * @param fn The function to run on each element.
         */

      }, {
        key: "each",
        value: function each(spec, fn) {
          if (spec == null) {
            return;
          }

          if (typeof spec === "string") {
            fn(this.getElement(spec));
          } else if (spec.length != null) {
            for (var i = 0; i < spec.length; i++) {
              fn(this.getElement(spec[i]));
            }
          } else {
            fn(spec);
          } // assume it's an element.


          return this;
        }
        /**
         * Update the cached offset information for some element.
         * @param params
         * @return an UpdateOffsetResult containing the offset information for the given element.
         */

      }, {
        key: "updateOffset",
        value: function updateOffset(params) {
          var timestamp = params.timestamp,
              recalc = params.recalc,
              offset = params.offset,
              elId = params.elId,
              s;

          if (this._suspendDrawing && !timestamp) {
            timestamp = this._suspendedAt;
          }

          if (!recalc) {
            if (timestamp && timestamp === this._offsetTimestamps[elId]) {
              return this.viewport.getPosition(elId);
            }
          }

          if (recalc || !offset && this.viewport.getPosition(elId) == null) {
            // if forced repaint or no offset available, we recalculate.
            // get the current size and offset, and store them
            s = this._managedElements[elId] ? this._managedElements[elId].el : null;

            if (s != null) {
              var size = this.getSize(s);

              var _offset = this.getOffset(s);

              this.viewport.updateElement(elId, _offset.left, _offset.top, size[0], size[1], null);
              this._offsetTimestamps[elId] = timestamp;
            }
          } else {
            // if offset available, update the viewport
            if (offset != null) {
              this.viewport.setPosition(elId, offset.left, offset.top);
            }

            this._offsetTimestamps[elId] = timestamp;
          }

          return this.viewport.getPosition(elId);
        }
        /**
         * Delete the given connection.
         * @param connection Connection to delete.
         * @param params Optional extra parameters.
         */

      }, {
        key: "deleteConnection",
        value: function deleteConnection(connection, params) {
          if (connection != null) {
            params = params || {};

            if (params.force || functionChain(true, false, [[connection.endpoints[0], IS_DETACH_ALLOWED, [connection]], [connection.endpoints[1], IS_DETACH_ALLOWED, [connection]], [connection, IS_DETACH_ALLOWED, [connection]], [this, CHECK_CONDITION, [BEFORE_DETACH, connection]]])) {
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

          var _el = this.getElement(el);

          var id = this.getId(_el),
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
          // may have been given a connection, or in special cases, an object
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
          } // always fire this. used by internal jsplumb stuff.


          this.fire(EVENT_INTERNAL_CONNECTION_DETACHED, params, originalEvent);
          this.router.connectionDetached(params.connection);
        }
      }, {
        key: "fireMoveEvent",
        value: function fireMoveEvent(params, evt) {
          this.fire(EVENT_CONNECTION_MOVED, params, evt);
        }
        /**
         * Manage a group of elements.
         * @param elements Array-like object of strings or DOM elements.
         * @param recalc Maybe recalculate offsets for the element also.
         */

      }, {
        key: "manageAll",
        value: function manageAll(elements, recalc) {
          for (var i = 0; i < elements.length; i++) {
            this.manage(elements[i], recalc);
          }
        }
        /**
         * Manage an element.
         * @param element String, or DOM element.
         * @param recalc Maybe recalculate offsets for the element also.
         */

      }, {
        key: "manage",
        value: function manage(element, recalc) {
          var el = IS.aString(element) ? this.getElementById(element) : element;
          var elId = this.getId(el);

          if (!this._managedElements[elId]) {
            this.setAttribute(el, ATTRIBUTE_MANAGED, "");
            this._managedElements[elId] = {
              el: el,
              endpoints: [],
              connections: [],
              rotation: 0
            };

            if (this._suspendDrawing) {
              this._managedElements[elId].info = this.viewport.registerElement(elId);
            } else {
              this._managedElements[elId].info = this.updateOffset({
                elId: elId,
                recalc: true
              });
            } // write context into the element. we want to use this moving forward and get rid of endpointsByElement and the sizes, offsets and info stuff
            // from above. it should suffice to put the context on the elements themselves.


            el._jspContext = {
              ep: [] // o:this._offsets[elId],
              // s:this._sizes[elId]

            };
          } else {
            if (recalc) {
              this._managedElements[elId].info = this.updateOffset({
                elId: elId,
                timestamp: null,
                recalc: true
              });
            }
          }

          return this._managedElements[elId];
        }
        /**
         * Stops managing the given element.
         * @param id ID of the element to stop managing.
         */

      }, {
        key: "unmanage",
        value: function unmanage(id) {
          if (this._managedElements[id]) {
            this.removeAttribute(this._managedElements[id].el, ATTRIBUTE_MANAGED);
            this.viewport.remove(id);
            delete this._managedElements[id];
          }
        }
      }, {
        key: "rotate",
        value: function rotate(elementId, rotation, doNotRepaint) {
          if (this._managedElements[elementId]) {
            this._managedElements[elementId].rotation = rotation;
            this.viewport.rotateElement(elementId, rotation);

            if (doNotRepaint !== true) {
              return this.revalidate(elementId);
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
        key: "getAllConnections",
        value: function getAllConnections() {
          return this.connections;
        } // repaint some element's endpoints and connections

      }, {
        key: "repaint",
        value: function repaint(el, ui, timestamp) {
          return this._draw(el, ui, timestamp);
        }
      }, {
        key: "revalidate",
        value: function revalidate(el, timestamp, isIdAlready) {
          var elId = isIdAlready ? el : this.getId(el);
          this.updateOffset({
            elId: elId,
            recalc: true,
            timestamp: timestamp
          });
          return this.repaint(el);
        } // repaint every endpoint and connection.

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
            this._draw(elId, null, timestamp, true);
          }

          return this;
        }
        /**
         * for some given element, find any other elements we want to draw whenever that element
         * is being drawn. for groups, for example, this means any child elements of the group.
         * @param el
         * @private
         */

      }, {
        key: "_draw",
        value: function _draw(element, ui, timestamp, offsetsWereJustCalculated) {
          var r = {
            c: new Set(),
            e: new Set()
          };

          var _mergeRedraw = function _mergeRedraw(r2) {
            // merge in r2 to r
            r2.c.forEach(function (c) {
              return r.c.add(c);
            });
            r2.e.forEach(function (e) {
              return r.e.add(e);
            });
          };

          if (!this._suspendDrawing) {
            var id = typeof element === "string" ? element : this.getId(element),
                _el3 = typeof element === "string" ? this.getElementById(element) : element;

            if (_el3 != null) {
              var repaintEls = this._getAssociatedElements(_el3),
                  repaintOffsets = [];

              if (timestamp == null) {
                timestamp = uuid();
              }

              if (!offsetsWereJustCalculated) {
                // update the offset of everything _before_ we try to draw anything.
                this.updateOffset({
                  elId: id,
                  offset: ui,
                  recalc: false,
                  timestamp: timestamp
                });

                for (var i = 0; i < repaintEls.length; i++) {
                  repaintOffsets.push(this.updateOffset({
                    elId: this.getId(repaintEls[i]),
                    recalc: true,
                    timestamp: timestamp
                  }));
                }
              } else {
                for (var _i2 = 0; _i2 < repaintEls.length; _i2++) {
                  var reId = this.getId(repaintEls[_i2]);
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
            delete this.endpointsByUUID[uuid];
          }

          this.router.deleteEndpoint(endpoint); // TODO at least replace this with a removeWithFunction call.

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
          var _this3 = this;

          var endpoint = typeof object === "string" ? this.endpointsByUUID[object] : object;

          if (endpoint) {
            // find all connections for the endpoint
            var connectionsToDelete = endpoint.connections.slice();
            connectionsToDelete.forEach(function (connection) {
              // detach this endpoint from each of these connections.
              endpoint.detachFromConnection(connection, null, true);
            }); // delete the endpoint

            this.unregisterEndpoint(endpoint);
            endpoint.destroy(true); // then delete the connections. each of these connections only has one endpoint at the moment

            connectionsToDelete.forEach(function (connection) {
              // detach this endpoint from each of these connections.
              _this3.deleteConnection(connection, {
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
          var mel = this.manage(el, !this._suspendDrawing);
          var e = this.newEndpoint(_p, id);
          addToList(this.endpointsByElement, id, e); // store the endpoint directly on the element.

          mel.el._jspContext.ep.push(e);

          if (!this._suspendDrawing) {
            // why not just a full renderer.paintEndpoint method here?
            //this.renderer.paintEndpoint()  // but why does this method expect a paintStyle?
            var anchorLoc = this.computeAnchorLoc(e);
            e.paint({
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
        } // clears all endpoints and connections from the instance of jsplumb, optionally without firing any events
        // subclasses should take care of cleaning up the rendering.

      }, {
        key: "reset",
        value: function reset(silently) {
          var _this4 = this;

          this.silently(function () {
            _this4.endpointsByElement = {};
            _this4._managedElements = {};
            _this4.endpointsByUUID = {};

            _this4.viewport.reset();

            _this4._offsetTimestamps = {};

            _this4.router.reset();

            _this4.groupManager.reset();

            _this4._connectionTypes = {};
            _this4._endpointTypes = {};
            _this4.connections.length = 0;
          });
        } // ------ these are exposed for library packages to use; it allows them to be built without needing to include the utils --------

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
        } // ---------------------------------------------------------------------------------
        // clears the instance (without firing any events) and unbinds any listeners on the instance.

      }, {
        key: "destroy",
        value: function destroy() {
          this.reset(true);
          this.unbind();
        }
      }, {
        key: "getEndpoints",
        value: function getEndpoints(el) {
          return this.endpointsByElement[this.info(el).id] || [];
        }
      }, {
        key: "getEndpoint",
        value: function getEndpoint(id) {
          return this.endpointsByUUID[id];
        }
      }, {
        key: "connect",
        value: function connect(params, referenceParams) {
          // prepare a final set of parameters to create connection with
          var _p = this._prepareConnectionParams(params, referenceParams),
              jpc; // TODO probably a nicer return value if the connection was not made.  _prepareConnectionParams
          // will return null (and log something) if either endpoint was full.  what would be nicer is to
          // create a dedicated 'error' object.


          if (_p) {
            if (_p.source == null && _p.sourceEndpoint == null) {
              log("Cannot establish connection - source does not exist");
              return;
            }

            if (_p.target == null && _p.targetEndpoint == null) {
              log("Cannot establish connection - target does not exist");
              return;
            } // create the connection.  it is not yet registered


            jpc = this._newConnection(_p); // now add it the model, fire an event, and redraw

            this._finaliseConnection(jpc, _p);
          }

          return jpc;
        }
      }, {
        key: "_prepareConnectionParams",
        value: function _prepareConnectionParams(params, referenceParams) {
          var _this5 = this;

          var _p = extend({}, params);

          if (referenceParams) {
            extend(_p, referenceParams);
          } // wire endpoints passed as source or target to sourceEndpoint/targetEndpoint, respectively.


          if (_p.source) {
            if (_p.source.endpoint) {
              _p.sourceEndpoint = _p.source;
            } else {
              _p.source = this.getElement(_p.source);
            }
          }

          if (_p.target) {
            if (_p.target.endpoint) {
              _p.targetEndpoint = _p.target;
            } else {
              _p.target = this.getElement(_p.target);
            }
          } // test for endpoint uuids to connect


          if (params.uuids) {
            _p.sourceEndpoint = this.getEndpoint(params.uuids[0]);
            _p.targetEndpoint = this.getEndpoint(params.uuids[1]);
          } // now ensure that if we do have Endpoints already, they're not full.
          // source:


          if (_p.sourceEndpoint && _p.sourceEndpoint.isFull()) {
            log("could not add connection; source endpoint is full");
            return;
          } // target:


          if (_p.targetEndpoint && _p.targetEndpoint.isFull()) {
            log("could not add connection; target endpoint is full");
            return;
          } // if source endpoint mandates connection type and nothing specified in our params, use it.


          if (!_p.type && _p.sourceEndpoint) {
            _p.type = _p.sourceEndpoint.connectionType;
          } // copy in any connectorOverlays that were specified on the source endpoint.
          // it doesnt copy target endpoint overlays.  i'm not sure if we want it to or not.


          if (_p.sourceEndpoint && _p.sourceEndpoint.connectorOverlays) {
            _p.overlays = _p.overlays || [];

            for (var i = 0, j = _p.sourceEndpoint.connectorOverlays.length; i < j; i++) {
              _p.overlays.push(_p.sourceEndpoint.connectorOverlays[i]);
            }
          } // scope


          if (_p.sourceEndpoint && _p.sourceEndpoint.scope) {
            _p.scope = _p.sourceEndpoint.scope;
          } // pointer events


          if (!_p["pointer-events"] && _p.sourceEndpoint && _p.sourceEndpoint.connectorPointerEvents) {
            _p["pointer-events"] = _p.sourceEndpoint.connectorPointerEvents;
          }

          var _addEndpoint = function _addEndpoint(el, def, idx) {
            var params = _mergeOverrides(def, {
              anchor: _p.anchors ? _p.anchors[idx] : _p.anchor,
              endpoint: _p.endpoints ? _p.endpoints[idx] : _p.endpoint,
              paintStyle: _p.endpointStyles ? _p.endpointStyles[idx] : _p.endpointStyle,
              hoverPaintStyle: _p.endpointHoverStyles ? _p.endpointHoverStyles[idx] : _p.endpointHoverStyle,
              portId: _p.ports ? _p.ports[idx] : null
            });

            return _this5.addEndpoint(el, params);
          }; // check for makeSource/makeTarget specs.


          var _oneElementDef = function _oneElementDef(type, idx, matchType, portId) {
            // `type` is "source" or "target". Check that it exists, and is not already an Endpoint.
            if (_p[type] && !_p[type].endpoint && !_p[type + "Endpoint"] && !_p.newConnection) {
              var elDefs = _p[type][type === SOURCE ? SOURCE_DEFINITION_LIST : TARGET_DEFINITION_LIST];

              if (elDefs) {
                var defIdx = findWithFunction(elDefs, function (d) {
                  //return (d.def.connectionType == null || d.def.connectionType === matchType) && (portId == null || d.def.portId === portId)
                  return (d.def.connectionType == null || d.def.connectionType === matchType) && (d.def.portId == null || d.def.portId == portId); //return (d.def.portId == null || d.def.portId == portId)
                });

                if (defIdx >= 0) {
                  var tep = elDefs[defIdx];

                  if (tep) {
                    // if not enabled, return.
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
                    } // provide scope if not already provided and endpoint def has one.


                    if (tep.uniqueEndpoint) {
                      if (!tep.endpoint) {
                        tep.endpoint = newEndpoint;
                        newEndpoint.deleteOnEmpty = false;
                      } else {
                        newEndpoint.finalEndpoint = tep.endpoint;
                      }
                    } else {
                      newEndpoint.deleteOnEmpty = true;
                    } //
                    // copy in connector overlays if present on the source definition.
                    //


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
          } // last, ensure scopes match


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
          c.paint();
          return c;
        } //
        // adds the connection to the backing model, fires an event if necessary and then redraws
        //

      }, {
        key: "_finaliseConnection",
        value: function _finaliseConnection(jpc, params, originalEvent, doInformAnchorManager) {
          params = params || {}; // add to list of connections (by scope).

          if (!jpc.suspendedEndpoint) {
            this.connections.push(jpc);
          }

          jpc.pending = null; // turn off isTemporarySource on the source endpoint (only viable on first draw)

          jpc.endpoints[0].isTemporarySource = false; // always inform the anchor manager
          // except that if jpc has a suspended endpoint it's not true to say the
          // connection is new; it has just (possibly) moved. the question is whether
          // to make that call here or in the anchor manager.  i think perhaps here.

          if (doInformAnchorManager !== false) {
            this.router.newConnection(jpc);
          } // force a paint


          this._draw(jpc.source); // fire an event


          if (!params.doNotFireConnectionEvent && params.fireEvent !== false) {
            var _eventArgs = {
              connection: jpc,
              source: jpc.source,
              target: jpc.target,
              sourceId: jpc.sourceId,
              targetId: jpc.targetId,
              sourceEndpoint: jpc.endpoints[0],
              targetEndpoint: jpc.endpoints[1]
            };
            this.fire(EVENT_CONNECTION, _eventArgs, originalEvent);
          }
        }
      }, {
        key: "_doRemove",
        value: function _doRemove(info, affectedElements) {
          var _this6 = this;

          this.removeAllEndpoints(info.id, true, affectedElements);

          var _one = function _one(_info) {
            if (info.el != null) {
              _this6.anchorManager.clearFor(_info.id);

              _this6.anchorManager.removeFloatingConnection(_info.id);

              if (_this6.isSource(_info.el)) {
                _this6.unmakeSource(_info.el);
              }

              if (_this6.isTarget(_info.el)) {
                _this6.unmakeTarget(_info.el);
              }

              delete _this6._floatingConnections[_info.id];
              delete _this6._managedElements[_info.id];

              _this6.viewport.remove(_info.id);

              if (_info.el) {
                _this6.removeElement(_info.el);
              }
            }
          }; // remove all affected child elements


          for (var ae = 1; ae < affectedElements.length; ae++) {
            _one(affectedElements[ae]);
          } // and always remove the requested one from the dom.


          _one(info);
        } //
        // TODO this method performs DOM operations, and shouldnt.

      }, {
        key: "remove",
        value: function remove(el, doNotRepaint) {
          var _this7 = this;

          var info = this.info(el),
              affectedElements = [];

          if (info.text && info.el.parentNode) {
            info.el.parentNode.removeChild(info.el);
          } else if (info.id) {
            this.batch(function () {
              _this7._doRemove(info, affectedElements);
            }, doNotRepaint === true);
          }

          return this;
        }
      }, {
        key: "removeAllEndpoints",
        value: function removeAllEndpoints(el, recurse, affectedElements) {
          var _this8 = this;

          affectedElements = affectedElements || [];

          var _one = function _one(_el) {
            var info = _this8.info(_el),
                ebe = _this8.endpointsByElement[info.id],
                i,
                ii;

            if (ebe) {
              affectedElements.push(info);

              for (i = 0, ii = ebe.length; i < ii; i++) {
                // TODO check this logic. was the second arg a "do not repaint now" argument?
                //this.deleteEndpoint(ebe[i], false)
                _this8.deleteEndpoint(ebe[i]);
              }
            }

            delete _this8.endpointsByElement[info.id]; // TODO DOM specific

            if (recurse) {
              if (info.el && info.el.nodeType !== 3 && info.el.nodeType !== 8) {
                for (i = 0, ii = info.el.childNodes.length; i < ii; i++) {
                  _one(info.el.childNodes[i]);
                }
              }
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
          connectionType = connectionType || DEFAULT;
          this.each(el, function (_el) {
            var defs = _el[type === SOURCE ? SOURCE_DEFINITION_LIST : TARGET_DEFINITION_LIST];

            if (defs) {
              _this9.each(defs, function (def) {
                if (def.def.connectionType == null || def.def.connectionType === connectionType) {
                  os = def.enabled;
                  originalState.push(os);
                  newState = toggle ? !os : state;
                  def.enabled = newState;

                  _this9[newState ? "removeClass" : "addClass"](_el, "jtk-" + type + "-disabled");
                }
              });
            }
          });
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
          return this.findFirstSourceDefinition(this.getElement(el), connectionType) != null;
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
          return this.findFirstTargetDefinition(this.getElement(el), connectionType) != null;
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
        } // really just exposed for testing

      }, {
        key: "makeAnchor",
        value: function makeAnchor(spec, elementId) {
          return makeAnchorFromSpec(this, spec, elementId);
        }
      }, {
        key: "_unmake",
        value: function _unmake(type, key, el, connectionType) {
          var _this10 = this;

          connectionType = connectionType || "*";
          this.each(el, function (_el) {
            if (_el[key]) {
              if (connectionType === "*") {
                delete _el[key];

                _this10.removeAttribute(_el, "jtk-" + type);
              } else {
                var t = [];

                _el[key].forEach(function (def) {
                  if (connectionType !== def.def.connectionType) {
                    t.push(def);
                  }
                });

                if (t.length > 0) {
                  _el[key] = t;
                } else {
                  delete _el[key];

                  _this10.removeAttribute(_el, "jtk-" + type);
                }
              }
            }
          });
        }
      }, {
        key: "_unmakeEvery",
        value: function _unmakeEvery(type, key, connectionType) {
          var els = this.getSelector("[jtk-" + type + "]");

          for (var i = 0; i < els.length; i++) {
            this._unmake(type, key, els[i], connectionType);
          }
        } // see api docs

      }, {
        key: "unmakeTarget",
        value: function unmakeTarget(el, connectionType) {
          return this._unmake(TARGET, TARGET_DEFINITION_LIST, el, connectionType);
        } // see api docs

      }, {
        key: "unmakeSource",
        value: function unmakeSource(el, connectionType) {
          return this._unmake(SOURCE, SOURCE_DEFINITION_LIST, el, connectionType);
        } // see api docs

      }, {
        key: "unmakeEverySource",
        value: function unmakeEverySource(connectionType) {
          this._unmakeEvery(SOURCE, SOURCE_DEFINITION_LIST, connectionType || "*");
        } // see api docs

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
            this.setAttribute(el, "jtk-scope-" + scopes[i], "");
          }
        } // TODO knows about the DOM

      }, {
        key: "makeSource",
        value: function makeSource(el, params, referenceParams) {
          var _this11 = this;

          var p = extend({
            _jsPlumb: this
          }, referenceParams);
          extend(p, params);
          p.connectionType = p.connectionType || DEFAULT;
          var aae = this.deriveEndpointAndAnchorSpec(p.connectionType);
          p.endpoint = p.endpoint || aae.endpoints[0];
          p.anchor = p.anchor || aae.anchors[0];
          var maxConnections = p.maxConnections || -1;

          var _one = function _one(_el) {
            var elInfo = _this11.info(_el); // get the element's id and store the endpoint definition for it.  jsPlumb.connect calls will look for one of these,
            // and use the endpoint definition if found.


            var _del = elInfo.el;

            _this11.manage(_del);

            _this11.setAttribute(_del, ATTRIBUTE_SOURCE, "");

            _this11._writeScopeAttribute(elInfo.el, p.scope || _this11.Defaults.scope);

            _this11.setAttribute(_del, [ATTRIBUTE_SOURCE, p.connectionType].join("-"), "");

            elInfo.el._jsPlumbSourceDefinitions = elInfo.el._jsPlumbSourceDefinitions || [];
            var _def = {
              def: extend({}, p),
              uniqueEndpoint: p.uniqueEndpoint,
              maxConnections: maxConnections,
              enabled: true,
              endpoint: null
            };

            if (p.createEndpoint) {
              _def.uniqueEndpoint = true;
              _def.endpoint = _this11.addEndpoint(_del, _def.def);
              _def.endpoint.deleteOnEmpty = false;
            }

            elInfo.def = _def;

            elInfo.el._jsPlumbSourceDefinitions.push(_def);
          };

          this.each(el, _one);
          return this;
        }
      }, {
        key: "_getScope",
        value: function _getScope(el, defKey) {
          var elInfo = this.info(el);

          if (elInfo.el && elInfo.el[defKey] && elInfo.el[defKey].length > 0) {
            return elInfo.el[defKey][0].def.scope;
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
          var elInfo = this.info(el);

          if (elInfo.el && elInfo.el[defKey]) {
            elInfo.el[defKey].forEach(function (def) {
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
          var _this12 = this;

          // put jsplumb ref into params without altering the params passed in
          var p = Object.assign({
            _jsPlumb: this
          }, referenceParams);
          Object.assign(p, params);
          p.connectionType = p.connectionType || DEFAULT;
          var maxConnections = p.maxConnections || -1; //,

          var _one = function _one(_el) {
            // get the element's id and store the endpoint definition for it.  jsPlumb.connect calls will look for one of these,
            // and use the endpoint definition if found.
            // decode the info for this element (id and element)
            var elInfo = _this12.info(_el),
                dropOptions = extend({}, p.dropOptions || {});

            _this12.manage(elInfo.el);

            _this12.setAttribute(elInfo.el, ATTRIBUTE_TARGET, "");

            _this12._writeScopeAttribute(elInfo.el, p.scope || _this12.Defaults.scope);

            _this12.setAttribute(elInfo.el, [ATTRIBUTE_TARGET, p.connectionType].join("-"), "");

            elInfo.el._jsPlumbTargetDefinitions = elInfo.el._jsPlumbTargetDefinitions || []; // if this is a group and the user has not mandated a rank, set to -1 so that Nodes takes
            // precedence.

            if (elInfo.el._isJsPlumbGroup && dropOptions.rank == null) {
              dropOptions.rank = -1;
            } // store the definition


            var _def = {
              def: extend({}, p),
              uniqueEndpoint: p.uniqueEndpoint,
              maxConnections: maxConnections,
              enabled: true,
              endpoint: null
            };

            if (p.createEndpoint) {
              _def.uniqueEndpoint = true;
              _def.endpoint = _this12.addEndpoint(elInfo.el, _def.def);
              _def.endpoint.deleteOnEmpty = false;
            }

            elInfo.el._jsPlumbTargetDefinitions.push(_def);
          };

          this.each(el, _one);
          return this;
        }
      }, {
        key: "show",
        value: function show(el, changeEndpoints) {
          this._setVisible(el, BLOCK, changeEndpoints);

          return this;
        }
      }, {
        key: "hide",
        value: function hide(el, changeEndpoints) {
          this._setVisible(el, NONE, changeEndpoints);

          return this;
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

          var info = this.info(el);

          this._operation(info.id, function (jpc) {
            if (visible && alsoChangeEndpoints) {
              // this test is necessary because this functionality is new, and i wanted to maintain backwards compatibility.
              // this block will only set a connection to be visible if the other endpoint in the connection is also visible.
              var oidx = jpc.sourceId === info.id ? 1 : 0;

              if (jpc.endpoints[oidx].isVisible()) {
                jpc.setVisible(true);
              }
            } else {
              // the default behaviour for show, and what always happens for hide, is to just set the visibility without getting clever.
              jpc.setVisible(visible);
            }
          }, endpointFunc);
        }
        /**
         * private method to do the business of toggling hiding/showing.
         */

      }, {
        key: "toggleVisible",
        value: function toggleVisible(elId, changeEndpoints) {
          var endpointFunc = null;

          if (changeEndpoints) {
            endpointFunc = function endpointFunc(ep) {
              var state = ep.isVisible();
              ep.setVisible(!state);
            };
          }

          this._operation(elId, function (jpc) {
            var state = jpc.isVisible();
            jpc.setVisible(!state);
          }, endpointFunc);
        }
      }, {
        key: "_operation",
        value: function _operation(elId, func, endpointFunc) {
          var endpoints = this.endpointsByElement[elId];

          if (endpoints && endpoints.length) {
            for (var i = 0, ii = endpoints.length; i < ii; i++) {
              for (var j = 0, jj = endpoints[i].connections.length; j < jj; j++) {
                var retVal = func(endpoints[i].connections[j]); // if the function passed in returns true, we exit.
                // most functions return false.

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
          this._connectionTypes[id] = extend({}, type);

          if (type.overlays) {
            var to = {};

            for (var i = 0; i < type.overlays.length; i++) {
              // if a string, convert to object representation so that we can store the typeid on it.
              // also assign an id.
              var fo = this.convertToFullOverlaySpec(type.overlays[i]);
              to[fo[1].id] = fo;
            } //this._connectionTypes[id].overlayMap = to


            this._connectionTypes[id].overlays = to;
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
          this._endpointTypes[id] = extend({}, type);

          if (type.overlays) {
            var to = {};

            for (var i = 0; i < type.overlays.length; i++) {
              // if a string, convert to object representation so that we can store the typeid on it.
              // also assign an id.
              var fo = this.convertToFullOverlaySpec(type.overlays[i]);
              to[fo[1].id] = fo;
            }

            this._endpointTypes[id].overlays = to;
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
          return typeDescriptor === "connection" ? this._connectionTypes[id] : this._endpointTypes[id];
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
        } // ----------------------------- proxy connections -----------------------

      }, {
        key: "proxyConnection",
        value: function proxyConnection(connection, index, proxyEl, proxyElId, endpointGenerator, anchorGenerator) {
          var alreadyProxied = connection.proxies[index] != null,
              proxyEp,
              originalElementId = alreadyProxied ? connection.proxies[index].originalEp.elementId : connection.endpoints[index].elementId,
              originalEndpoint = alreadyProxied ? connection.proxies[index].originalEp : connection.endpoints[index]; // if proxies exist for this end of the connection

          if (connection.proxies[index]) {
            // and the endpoint is for the element we're going to proxy to, just use it.
            if (connection.proxies[index].ep.elementId === proxyElId) {
              proxyEp = connection.proxies[index].ep;
            } else {
              // otherwise detach that previous endpoint; it will delete itself
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

          proxyEp.deleteOnEmpty = true; // for this index, stash proxy info: the new EP, the original EP.

          connection.proxies[index] = {
            ep: proxyEp,
            originalEp: originalEndpoint // and advise the anchor manager

          };
          this.sourceOrTargetChanged(originalElementId, proxyElId, connection, proxyEl, index); // detach the original EP from the connection, but mark as a transient detach.

          originalEndpoint.detachFromConnection(connection, null, true); // set the proxy as the new ep

          proxyEp.connections = [connection];
          connection.endpoints[index] = proxyEp;
          originalEndpoint.setVisible(false);
          connection.setVisible(true);
          this.revalidate(proxyEl);
        }
      }, {
        key: "unproxyConnection",
        value: function unproxyConnection(connection, index, proxyElId) {
          // if connection cleaned up, no proxies, or none for this end of the connection, abort.
          if (connection.proxies == null || connection.proxies[index] == null) {
            return;
          }

          var originalElement = connection.proxies[index].originalEp.element,
              originalElementId = connection.proxies[index].originalEp.elementId;
          connection.endpoints[index] = connection.proxies[index].originalEp;
          this.sourceOrTargetChanged(proxyElId, originalElementId, connection, originalElement, index); // detach the proxy EP from the connection (which will cause it to be removed as we no longer need it)

          connection.proxies[index].ep.detachFromConnection(connection, null);
          connection.proxies[index].originalEp.addConnection(connection);

          if (connection.isVisible()) {
            connection.proxies[index].originalEp.setVisible(true);
          } // cleanup


          connection.proxies[index] = null; // if both empty, set length to 0.

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
        } // ------------------------ GROUPS --------------

      }, {
        key: "getGroup",
        value: function getGroup(id) {
          return this.groupManager.getGroup(id);
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
        value: function addToGroup(group, el, doNotFireEvent) {
          return this.groupManager.addToGroup(group, el, doNotFireEvent);
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
        value: function removeGroup(group, deleteMembers, manipulateDOM, doNotFireEvent) {
          this.groupManager.removeGroup(group, deleteMembers, manipulateDOM, doNotFireEvent);
        }
      }, {
        key: "removeAllGroups",
        value: function removeAllGroups(deleteMembers, manipulateDOM, doNotFireEvent) {
          this.groupManager.removeAllGroups(deleteMembers, manipulateDOM, doNotFireEvent);
        }
      }, {
        key: "removeFromGroup",
        value: function removeFromGroup(group, el, doNotFireEvent) {
          this.groupManager.removeFromGroup(group, el, doNotFireEvent);
          this.appendElement(el, this.getContainer());
          this.updateOffset({
            recalc: true,
            elId: this.getId(el)
          });
        }
      }]);

      return JsPlumbInstance;
    }(EventGenerator);

    /**
     * jsBezier
     *
     * Copyright (c) 2010 - 2020 jsPlumb (hello@jsplumbtoolkit.com)
     *
     * licensed under the MIT license.
     *
     * a set of Bezier curve functions that deal with Beziers, used by jsPlumb, and perhaps useful for other people.  These functions work with Bezier
     * curves of arbitrary degree.
     *
     * - functions are all in the 'jsBezier' namespace.
     *
     * - all input points should be in the format {x:.., y:..}. all output points are in this format too.
     *
     * - all input curves should be in the format [ {x:.., y:..}, {x:.., y:..}, {x:.., y:..}, {x:.., y:..} ]
     *
     * - 'location' as used as an input here refers to a decimal in the range 0-1 inclusive, which indicates a point some proportion along the length
     * of the curve.  location as output has the same format and meaning.
     *
     *
     * Function List:
     * --------------
     *
     * distanceFromCurve(point, curve)
     *
     * 	Calculates the distance that the given point lies from the given Bezier.  Note that it is computed relative to the center of the Bezier,
     * so if you have stroked the curve with a wide pen you may wish to take that into account!  The distance returned is relative to the values
     * of the curve and the point - it will most likely be pixels.
     *
     * gradientAtPoint(curve, location)
     *
     * 	Calculates the gradient to the curve at the given location, as a decimal between 0 and 1 inclusive.
     *
     * gradientAtPointAlongCurveFrom (curve, location)
     *
     *	Calculates the gradient at the point on the given curve that is 'distance' units from location.
     *
     * nearestPointOnCurve(point, curve)
     *
     *	Calculates the nearest point to the given point on the given curve.  The return value of this is a JS object literal, containing both the
     *point's coordinates and also the 'location' of the point (see above), for example:  { point:{x:551,y:150}, location:0.263365 }.
     *
     * pointOnCurve(curve, location)
     *
     * 	Calculates the coordinates of the point on the given Bezier curve at the given location.
     *
     * pointAlongCurveFrom(curve, location, distance)
     *
     * 	Calculates the coordinates of the point on the given curve that is 'distance' units from location.  'distance' should be in the same coordinate
     * space as that used to construct the Bezier curve.  For an HTML Canvas usage, for example, distance would be a measure of pixels.
     *
     * locationAlongCurveFrom(curve, location, distance)
     *
     * 	Calculates the location on the given curve that is 'distance' units from location.  'distance' should be in the same coordinate
     * space as that used to construct the Bezier curve.  For an HTML Canvas usage, for example, distance would be a measure of pixels.
     *
     * perpendicularToCurveAt(curve, location, length, distance)
     *
     * 	Calculates the perpendicular to the given curve at the given location.  length is the length of the line you wish for (it will be centered
     * on the point at 'location'). distance is optional, and allows you to specify a point along the path from the given location as the center of
     * the perpendicular returned.  The return value of this is an array of two points: [ {x:...,y:...}, {x:...,y:...} ].
     *
     *
     */
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
    /**
     * Calculates the distance that the point lies from the curve.
     *
     * @param point a point in the form {x:567, y:3342}
     * @param curve a Bezier curve in the form [{x:..., y:...}, {x:..., y:...}, {x:..., y:...}, {x:..., y:...}].  note that this is currently
     * hardcoded to assume cubiz beziers, but would be better off supporting any degree.
     * @return a JS object literal containing location and distance, for example: {location:0.35, distance:10}.  Location is analogous to the location
     * argument you pass to the pointOnPath function: it is a ratio of distance travelled along the curve.  Distance is the distance in pixels from
     * the point to the curve.
     */

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
    /**
     * finds the nearest point on the curve to the given point.
     */

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
    /**
     * counts how many roots there are.
     */


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
      sign = old_sign = sgn(curve[0].y);

      for (var i = 1; i <= degree; i++) {
        sign = sgn(curve[i].y);
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
        return EMPTY_POINT; // not supported.
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

        fns.push(f_term()); // first is t to the power of the curve order

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

        fns.push(l_term()); // last is (1-t) to the power of the curve order

        _curveFunctionCache.set(order, fns);
      }

      return fns;
    }
    /**
     * calculates a point on the curve, for a Bezier of arbitrary order.
     * @param curve an array of control points, eg [{x:10,y:20}, {x:50,y:50}, {x:100,y:100}, {x:120,y:100}].  For a cubic bezier this should have four points.
     * @param location a decimal indicating the distance along the curve the point should be located at.  this is the distance along the curve as it travels, taking the way it bends into account.  should be a number from 0 to 1, inclusive.
     */


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
    /**
     * finds the point that is 'distance' along the path from 'location'.  this method returns both the x,y location of the point and also
     * its 'location' (proportion of travel along the path); the method below - _pointAlongPathFrom - calls this method and just returns the
     * point.
     *
     * TODO The compute length functionality was made much faster recently, using a lookup table. is it possible to use that lookup table find
     * a value for the point some distance along the curve from somewhere?
     */

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
    /**
     * finds the point that is 'distance' along the path from 'location'.
     */

    function pointAlongCurveFrom(curve, location, distance) {
      return pointAlongPath(curve, location, distance).point;
    }
    /**
     * finds the location that is 'distance' along the path from 'location'.
     */

    function locationAlongCurveFrom(curve, location, distance) {
      return pointAlongPath(curve, location, distance).location;
    }
    /**
     * returns the gradient of the curve at the given location, which is a decimal between 0 and 1 inclusive.
     *
     * thanks // http://bimixual.org/AnimationLibrary/beziertangents.html
     */

    function gradientAtPoint(curve, location) {
      var p1 = pointOnCurve(curve, location),
          p2 = pointOnCurve(curve.slice(0, curve.length - 1), location),
          dy = p2.y - p1.y,
          dx = p2.x - p1.x;
      return dy === 0 ? Infinity : Math.atan(dy / dx);
    }
    /**
     returns the gradient of the curve at the point which is 'distance' from the given location.
     if this point is greater than location 1, the gradient at location 1 is returned.
     if this point is less than location 0, the gradient at location 0 is returned.
     */

    function gradientAtPointAlongPathFrom(curve, location, distance) {
      var p = pointAlongPath(curve, location, distance);
      if (p.location > 1) p.location = 1;
      if (p.location < 0) p.location = 0;
      return gradientAtPoint(curve, p.location);
    }
    /**
     * calculates a line that is 'length' pixels long, perpendicular to, and centered on, the path at 'distance' pixels from the given location.
     * if distance is not supplied, the perpendicular for the given location is computed (ie. we set distance to zero).
     */

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
    /**
     * Calculates all intersections of the given line with the given curve.
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @param curve
     * @returns {Array}
     */

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
              x = [coeffs[0][0] * t3 + coeffs[0][1] * t2 + coeffs[0][2] * _t + coeffs[0][3], coeffs[1][0] * t3 + coeffs[1][1] * t2 + coeffs[1][2] * _t + coeffs[1][3]]; // check bounds of the line

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
    /**
     * Calculates all intersections of the given box with the given curve.
     * @param x X position of top left corner of box
     * @param y Y position of top left corner of box
     * @param w width of box
     * @param h height of box
     * @param curve
     * @returns {Array}
     */

    function boxIntersection(x, y, w, h, curve) {
      var i = [];
      i.push.apply(i, lineIntersection(x, y, x + w, y, curve));
      i.push.apply(i, lineIntersection(x + w, y, x + w, y + h, curve));
      i.push.apply(i, lineIntersection(x + w, y + h, x, y + h, curve));
      i.push.apply(i, lineIntersection(x, y + h, x, y, curve));
      return i;
    }
    /**
     * Calculates all intersections of the given bounding box with the given curve.
     * @param boundingBox Bounding box, in { x:.., y:..., w:..., h:... } format.
     * @param curve
     * @returns {Array}
     */

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

    function sgn(x) {
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

      if (D >= 0) // complex or duplicate roots
        {
          S = sgn(R + Math.sqrt(D)) * Math.pow(Math.abs(R + Math.sqrt(D)), 1 / 3);
          T = sgn(R - Math.sqrt(D)) * Math.pow(Math.abs(R - Math.sqrt(D)), 1 / 3);
          t[0] = -A / 3 + (S + T);
          t[1] = -A / 3 - (S + T) / 2;
          t[2] = -A / 3 - (S + T) / 2;
          /*discard complex roots*/

          if (Math.abs(Math.sqrt(3) * (S - T) / 2) !== 0) {
            t[1] = -1;
            t[2] = -1;
          }
        } else // distinct real roots
        {
          var th = Math.acos(R / Math.sqrt(-Math.pow(Q, 3)));
          t[0] = 2 * Math.sqrt(-Q) * Math.cos(th / 3) - A / 3;
          t[1] = 2 * Math.sqrt(-Q) * Math.cos((th + 2 * Math.PI) / 3) - A / 3;
          t[2] = 2 * Math.sqrt(-Q) * Math.cos((th + 4 * Math.PI) / 3) - A / 3;
        } // discard out of spec roots


      for (var i = 0; i < 3; i++) {
        if (t[i] < 0 || t[i] > 1.0) {
          t[i] = -1;
        }
      }

      return t;
    }

    var AbstractConnector =
    /*#__PURE__*/
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
        /**
         * Subclasses can override this. By default we just pass back the geometry we are using internally.
         */

      }, {
        key: "exportGeometry",
        value: function exportGeometry() {
          return this.geometry;
        }
        /**
         * Subclasses can override this. By default we just set the given geometry as our internal representation.
         */

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
            p += this.instance.renderer.getPath(this.segments[i], i === 0);
            p += " ";
          }

          return p;
        }
        /**
         * Function: findSegmentForPoint
         * Returns the segment that is closest to the given [x,y],
         * null if nothing found.  This function returns a JS
         * object with:
         *
         *   d   -   distance from segment
         *   l   -   proportional location in segment
         *   x   -   x point on the segment
         *   y   -   y point on the segment
         *   s   -   the segment itself.
         */

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
        /**
         * returns [segment, proportion of travel in segment, segment index] for the segment
         * that contains the point which is 'location' distance along the entire path, where
         * 'location' is a decimal between 0 and 1 inclusive. in this connector type, paths
         * are made up of a list of segments, each of which contributes some fraction to
         * the total length.
         * From 1.3.10 this also supports the 'absolute' property, which lets us specify a location
         * as the absolute distance in pixels, rather than a proportion of the total path.
         */

      }, {
        key: "_findSegmentForLocation",
        value: function _findSegmentForLocation(location, absolute) {
          var idx, i, inSegmentProportion;

          if (absolute) {
            location = location > 0 ? location / this.totalLength : (this.totalLength + location) / this.totalLength;
          } // if location 1 we know its the last segment


          if (location === 1) {
            idx = this.segments.length - 1;
            inSegmentProportion = 1;
          } else if (location === 0) {
            // if location 0 we know its the first segment
            inSegmentProportion = 0;
            idx = 0;
          } else {
            // if location >= 0.5, traverse backwards (of course not exact, who knows the segment proportions. but
            // an educated guess at least)
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
              h = Math.abs(params.targetPos[1] - params.sourcePos[1]); // if either anchor does not have an orientation set, we derive one from their relative
          // positions.  we fix the axis to be the one in which the two elements are further apart, and
          // point each anchor at the other element.  this is also used when dragging a new connection.

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
          var seg = this._findSegmentForLocation(location, absolute); // TODO what happens if this crosses to the next segment?


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
          this.instance.renderer.applyConnectorType(this, t);
        } //
        // a dummy implementation for subclasses to override if they want to.
        //

      }, {
        key: "setAnchorOrientation",
        value: function setAnchorOrientation(idx, orientation) {}
      }]);

      return AbstractConnector;
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
    /*#__PURE__*/
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
        /**
         * returns the point on the segment's path that is 'location' along the length of the path, where 'location' is a decimal from
         * 0 to 1 inclusive.
         */

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
        /**
         * returns the gradient of the segment at the given point.
         */

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
        } // TODO: lineIntersection

      }]);

      return ArcSegment;
    }(AbstractSegment);

    _defineProperty(ArcSegment, "segmentType", "Arc");

    var BezierSegment =
    /*#__PURE__*/
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
        }]; // although this is not a strictly rigorous determination of bounds
        // of a bezier curve, it works for the types of curves that this segment
        // type produces.

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

        /**
         * returns the point on the segment's path that is 'location' along the length of the path, where 'location' is a decimal from
         * 0 to 1 inclusive.
         */
        value: function pointOnPath(location, absolute) {
          location = BezierSegment._translateLocation(this.curve, location, absolute);
          return pointOnCurve(this.curve, location);
        }
        /**
         * returns the gradient of the segment at the given point.
         */

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

    var StraightSegment =
    /*#__PURE__*/
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
        /**
         * returns the point on the segment's path that is 'location' along the length of the path, where 'location' is a decimal from
         * 0 to 1 inclusive. for the straight line segment this is simple maths.
         */

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
        /**
         * returns the gradient of the segment at the given point - which for us is constant.
         */

      }, {
        key: "gradientAtPoint",
        value: function gradientAtPoint(location, absolute) {
          return this.m;
        }
        /**
         * returns the point on the segment's path that is 'distance' along the length of the path from 'location', where
         * 'location' is a decimal from 0 to 1 inclusive, and 'distance' is a number of pixels.
         * this hands off to jsPlumbUtil to do the maths, supplying two points and the distance.
         */

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
            /*
             location == 1 ? {
             x:x1 + ((x2 - x1) * 10),
             y:y1 + ((y1 - y2) * 10)
             } :
             */

          };

          if (distance <= 0 && Math.abs(distance) > 1) {
            distance *= -1;
          }

          return this.instance.geometry.pointOnLine(p, farAwayPoint, distance);
        } // is c between a and b?

      }, {
        key: "within",
        value: function within(a, b, c) {
          return c >= Math.min(a, b) && c <= Math.max(a, b);
        } // find which of a and b is closest to c

      }, {
        key: "closest",
        value: function closest(a, b, c) {
          return Math.abs(c - a) < Math.abs(c - b) ? a : b;
        }
        /**
         Function: findClosestPointOnPath
         Finds the closest point on this segment to [x,y]. See
         notes on this method in AbstractSegment.
         */

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
            // closest point lies on normal from given point to this line.
            var b = this.y1 - this.m * this.x1,
                b2 = y - this.m2 * x,
                // y1 = m.x1 + b and y1 = m2.x1 + b2
            // so m.x1 + b = m2.x1 + b2
            // x1(m - m2) = b2 - b
            // x1 = (b2 - b) / (m - m2)
            _x1 = (b2 - b) / (this.m - this.m2),
                _y1 = this.m * _x1 + b;

            out.x = this.within(this.x1, this.x2, _x1) ? _x1 : this.closest(this.x1, this.x2, _x1); //_x1

            out.y = this.within(this.y1, this.y2, _y1) ? _y1 : this.closest(this.y1, this.y2, _y1); //_y1
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
        /**
         * Calculates all intersections of the given line with this segment.
         * @param _x1
         * @param _y1
         * @param _x2
         * @param _y2
         * @returns {Array}
         */

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
              b2 = m2 === Infinity ? _x1 : _y1 - m2 * _x1; // if lines parallel, no intersection

          if (m2 !== m1) {
            // perpendicular, segment horizontal
            if (m2 === Infinity && m1 === 0) {
              if (this._pointLiesBetween(_x1, this.x1, this.x2) && this._pointLiesBetween(this.y1, _y1, _y2)) {
                out.push([_x1, this.y1]); // we return X on the incident line and Y from the segment
              }
            } else if (m2 === 0 && m1 === Infinity) {
              // perpendicular, segment vertical
              if (this._pointLiesBetween(_y1, this.y1, this.y2) && this._pointLiesBetween(this.x1, _x1, _x2)) {
                out.push([this.x1, _y1]); // we return X on the segment and Y from the incident line
              }
            } else {
              var X, Y;

              if (m2 === Infinity) {
                // test line is a vertical line. where does it cross the segment?
                X = _x1;

                if (this._pointLiesBetween(X, this.x1, this.x2)) {
                  Y = m1 * _x1 + b;

                  if (this._pointLiesBetween(Y, _y1, _y2)) {
                    out.push([X, Y]);
                  }
                }
              } else if (m2 === 0) {
                Y = _y1; // test line is a horizontal line. where does it cross the segment?

                if (this._pointLiesBetween(Y, this.y1, this.y2)) {
                  X = (_y1 - b) / m1;

                  if (this._pointLiesBetween(X, _x1, _x2)) {
                    out.push([X, Y]);
                  }
                }
              } else {
                // mX + b = m2X + b2
                // mX - m2X = b2 - b
                // X(m - m2) = b2 - b
                // X = (b2 - b) / (m - m2)
                // Y = mX + b
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
        /**
         * Calculates all intersections of the given box with this segment. By default this method simply calls `lineIntersection` with each of the four
         * faces of the box; subclasses can override this if they think there's a faster way to compute the entire box at once.
         * @param x X position of top left corner of box
         * @param y Y position of top left corner of box
         * @param w width of box
         * @param h height of box
         * @returns {Array}
         */

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

    var DEFAULT_WIDTH = 20;
    var DEFAULT_LENGTH = 20;
    var ArrowOverlay =
    /*#__PURE__*/
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
    /*#__PURE__*/
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
    /*#__PURE__*/
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
    /*#__PURE__*/
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

    exports.ATTRIBUTE_CONTAINER = ATTRIBUTE_CONTAINER;
    exports.ATTRIBUTE_GROUP = ATTRIBUTE_GROUP;
    exports.ATTRIBUTE_MANAGED = ATTRIBUTE_MANAGED;
    exports.ATTRIBUTE_NOT_DRAGGABLE = ATTRIBUTE_NOT_DRAGGABLE;
    exports.ATTRIBUTE_SOURCE = ATTRIBUTE_SOURCE;
    exports.ATTRIBUTE_TABINDEX = ATTRIBUTE_TABINDEX;
    exports.ATTRIBUTE_TARGET = ATTRIBUTE_TARGET;
    exports.AbstractConnector = AbstractConnector;
    exports.AbstractSegment = AbstractSegment;
    exports.Anchor = Anchor;
    exports.AnchorManager = AnchorManager;
    exports.Anchors = Anchors;
    exports.ArcSegment = ArcSegment;
    exports.ArrowOverlay = ArrowOverlay;
    exports.BEFORE_DETACH = BEFORE_DETACH;
    exports.BLOCK = BLOCK;
    exports.BezierSegment = BezierSegment;
    exports.CHECK_CONDITION = CHECK_CONDITION;
    exports.CHECK_DROP_ALLOWED = CHECK_DROP_ALLOWED;
    exports.CLASS_CONNECTOR = CLASS_CONNECTOR;
    exports.CLASS_ENDPOINT = CLASS_ENDPOINT;
    exports.CLASS_OVERLAY = CLASS_OVERLAY;
    exports.CMD_HIDE = CMD_HIDE;
    exports.CMD_ORPHAN_ALL = CMD_ORPHAN_ALL;
    exports.CMD_REMOVE_ALL = CMD_REMOVE_ALL;
    exports.CMD_SHOW = CMD_SHOW;
    exports.Component = Component;
    exports.Connection = Connection;
    exports.ConnectionSelection = ConnectionSelection;
    exports.Connectors = Connectors;
    exports.ContinuousAnchor = ContinuousAnchor;
    exports.CustomOverlay = CustomOverlay;
    exports.DEFAULT = DEFAULT;
    exports.DiamondOverlay = DiamondOverlay;
    exports.DynamicAnchor = DynamicAnchor;
    exports.EMPTY_BOUNDS = EMPTY_BOUNDS;
    exports.EVENT_CLICK = EVENT_CLICK;
    exports.EVENT_COLLAPSE = EVENT_COLLAPSE;
    exports.EVENT_CONNECTION = EVENT_CONNECTION;
    exports.EVENT_CONNECTION_DETACHED = EVENT_CONNECTION_DETACHED;
    exports.EVENT_CONNECTION_DRAG = EVENT_CONNECTION_DRAG;
    exports.EVENT_CONNECTION_MOUSEOUT = EVENT_CONNECTION_MOUSEOUT;
    exports.EVENT_CONNECTION_MOUSEOVER = EVENT_CONNECTION_MOUSEOVER;
    exports.EVENT_CONNECTION_MOVED = EVENT_CONNECTION_MOVED;
    exports.EVENT_CONTAINER_CHANGE = EVENT_CONTAINER_CHANGE;
    exports.EVENT_CONTEXTMENU = EVENT_CONTEXTMENU;
    exports.EVENT_DBL_CLICK = EVENT_DBL_CLICK;
    exports.EVENT_DBL_TAP = EVENT_DBL_TAP;
    exports.EVENT_ELEMENT_CLICK = EVENT_ELEMENT_CLICK;
    exports.EVENT_ELEMENT_DBL_CLICK = EVENT_ELEMENT_DBL_CLICK;
    exports.EVENT_ELEMENT_MOUSE_MOVE = EVENT_ELEMENT_MOUSE_MOVE;
    exports.EVENT_ELEMENT_MOUSE_OUT = EVENT_ELEMENT_MOUSE_OUT;
    exports.EVENT_ELEMENT_MOUSE_OVER = EVENT_ELEMENT_MOUSE_OVER;
    exports.EVENT_ENDPOINT_CLICK = EVENT_ENDPOINT_CLICK;
    exports.EVENT_ENDPOINT_DBL_CLICK = EVENT_ENDPOINT_DBL_CLICK;
    exports.EVENT_ENDPOINT_MOUSEOUT = EVENT_ENDPOINT_MOUSEOUT;
    exports.EVENT_ENDPOINT_MOUSEOVER = EVENT_ENDPOINT_MOUSEOVER;
    exports.EVENT_EXPAND = EVENT_EXPAND;
    exports.EVENT_FOCUS = EVENT_FOCUS;
    exports.EVENT_GROUP_ADDED = EVENT_GROUP_ADDED;
    exports.EVENT_GROUP_DRAG_STOP = EVENT_GROUP_DRAG_STOP;
    exports.EVENT_GROUP_MEMBER_ADDED = EVENT_GROUP_MEMBER_ADDED;
    exports.EVENT_GROUP_MEMBER_REMOVED = EVENT_GROUP_MEMBER_REMOVED;
    exports.EVENT_GROUP_REMOVED = EVENT_GROUP_REMOVED;
    exports.EVENT_INTERNAL_CONNECTION_DETACHED = EVENT_INTERNAL_CONNECTION_DETACHED;
    exports.EVENT_MAX_CONNECTIONS = EVENT_MAX_CONNECTIONS;
    exports.EVENT_MOUSEDOWN = EVENT_MOUSEDOWN;
    exports.EVENT_MOUSEENTER = EVENT_MOUSEENTER;
    exports.EVENT_MOUSEEXIT = EVENT_MOUSEEXIT;
    exports.EVENT_MOUSEMOVE = EVENT_MOUSEMOVE;
    exports.EVENT_MOUSEOUT = EVENT_MOUSEOUT;
    exports.EVENT_MOUSEOVER = EVENT_MOUSEOVER;
    exports.EVENT_MOUSEUP = EVENT_MOUSEUP;
    exports.EVENT_NESTED_GROUP_ADDED = EVENT_NESTED_GROUP_ADDED;
    exports.EVENT_NESTED_GROUP_REMOVED = EVENT_NESTED_GROUP_REMOVED;
    exports.EVENT_TAP = EVENT_TAP;
    exports.EVENT_ZOOM = EVENT_ZOOM;
    exports.Endpoint = Endpoint;
    exports.EndpointFactory = EndpointFactory;
    exports.EndpointRepresentation = EndpointRepresentation;
    exports.EndpointSelection = EndpointSelection;
    exports.EventGenerator = EventGenerator;
    exports.GROUP_COLLAPSED_CLASS = GROUP_COLLAPSED_CLASS;
    exports.GROUP_EXPANDED_CLASS = GROUP_EXPANDED_CLASS;
    exports.GROUP_KEY = GROUP_KEY;
    exports.GroupManager = GroupManager;
    exports.IS = IS;
    exports.IS_DETACH_ALLOWED = IS_DETACH_ALLOWED;
    exports.IS_GROUP_KEY = IS_GROUP_KEY;
    exports.JsPlumbInstance = JsPlumbInstance;
    exports.LabelOverlay = LabelOverlay;
    exports.NONE = NONE;
    exports.OptimisticEventGenerator = OptimisticEventGenerator;
    exports.Overlay = Overlay;
    exports.OverlayCapableComponent = OverlayCapableComponent;
    exports.OverlayFactory = OverlayFactory;
    exports.PARENT_GROUP_KEY = PARENT_GROUP_KEY;
    exports.PlainArrowOverlay = PlainArrowOverlay;
    exports.SELECTOR_CONNECTOR = SELECTOR_CONNECTOR;
    exports.SELECTOR_ENDPOINT = SELECTOR_ENDPOINT;
    exports.SELECTOR_GROUP_CONTAINER = SELECTOR_GROUP_CONTAINER;
    exports.SELECTOR_MANAGED_ELEMENT = SELECTOR_MANAGED_ELEMENT;
    exports.SELECTOR_OVERLAY = SELECTOR_OVERLAY;
    exports.SOURCE = SOURCE;
    exports.SOURCE_DEFINITION_LIST = SOURCE_DEFINITION_LIST;
    exports.SOURCE_INDEX = SOURCE_INDEX;
    exports.StraightSegment = StraightSegment;
    exports.TARGET = TARGET;
    exports.TARGET_DEFINITION_LIST = TARGET_DEFINITION_LIST;
    exports.TARGET_INDEX = TARGET_INDEX;
    exports.TWO_PI = TWO_PI;
    exports.UIGroup = UIGroup;
    exports.UINode = UINode;
    exports.Viewport = Viewport;
    exports.WILDCARD = WILDCARD;
    exports.X_AXIS_FACES = X_AXIS_FACES;
    exports.Y_AXIS_FACES = Y_AXIS_FACES;
    exports._mergeOverrides = _mergeOverrides;
    exports._removeTypeCssHelper = _removeTypeCssHelper;
    exports._updateHoverStyle = _updateHoverStyle;
    exports.addToList = addToList;
    exports.addWithFunction = addWithFunction;
    exports.boundingBoxIntersection = boundingBoxIntersection;
    exports.boxIntersection = boxIntersection;
    exports.classList = classList;
    exports.clone = clone;
    exports.cls = cls;
    exports.computeBezierLength = computeBezierLength;
    exports.dist = dist;
    exports.distanceFromCurve = distanceFromCurve;
    exports.each = each;
    exports.extend = extend;
    exports.fastTrim = fastTrim;
    exports.filterList = filterList;
    exports.findWithFunction = findWithFunction;
    exports.functionChain = functionChain;
    exports.getsert = getsert;
    exports.gradientAtPoint = gradientAtPoint;
    exports.gradientAtPointAlongPathFrom = gradientAtPointAlongPathFrom;
    exports.isArray = isArray;
    exports.isArrowOverlay = isArrowOverlay;
    exports.isBoolean = isBoolean;
    exports.isCustomOverlay = isCustomOverlay;
    exports.isDate = isDate;
    exports.isDiamondOverlay = isDiamondOverlay;
    exports.isEmpty = isEmpty;
    exports.isFunction = isFunction;
    exports.isLabelOverlay = isLabelOverlay;
    exports.isNamedFunction = isNamedFunction;
    exports.isNull = isNull;
    exports.isNumber = isNumber;
    exports.isObject = isObject;
    exports.isPlainArrowOverlay = isPlainArrowOverlay;
    exports.isPoint = isPoint;
    exports.isString = isString;
    exports.jsPlumbGeometry = jsPlumbGeometry;
    exports.lineIntersection = lineIntersection;
    exports.locationAlongCurveFrom = locationAlongCurveFrom;
    exports.log = log;
    exports.logEnabled = logEnabled;
    exports.makeAnchorFromSpec = makeAnchorFromSpec;
    exports.map = map;
    exports.merge = merge;
    exports.mergeWithParents = mergeWithParents;
    exports.nearestPointOnCurve = nearestPointOnCurve;
    exports.optional = optional;
    exports.perpendicularToPathAt = perpendicularToPathAt;
    exports.pointAlongCurveFrom = pointAlongCurveFrom;
    exports.pointAlongPath = pointAlongPath;
    exports.pointOnCurve = pointOnCurve;
    exports.populate = populate;
    exports.remove = remove;
    exports.removeWithFunction = removeWithFunction;
    exports.replace = replace;
    exports.rotateAnchorOrientation = rotateAnchorOrientation;
    exports.rotatePoint = rotatePoint;
    exports.rotatePointXY = rotatePointXY;
    exports.sortHelper = sortHelper;
    exports.suggest = suggest;
    exports.uuid = uuid;
    exports.wrap = wrap;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

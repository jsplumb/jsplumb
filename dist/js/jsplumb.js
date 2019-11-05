(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.jsplumb = {}));
}(this, function (exports) { 'use strict';

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

  function isArray(a) {
    return Object.prototype.toString.call(a) === "[object Array]";
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
  } //
  // extends the given obj (which can be an array) with the given constructor function, prototype functions, and
  // class members, any of which may be null.

  /*
  export function extend(child: any, parent: any, _protoFn: any): any {
      let i;
      parent = isArray(parent) ? parent : [parent];

      const _copyProtoChain = (focus: any): void => {
          let proto = focus.__proto__;
          while (proto != null) {
              if (proto.prototype != null) {
                  for (let j in proto.prototype) {
                      if (proto.prototype.hasOwnProperty(j) && !child.prototype.hasOwnProperty(j)) {
                          child.prototype[j] = proto.prototype[j];
                      }
                  }
                  proto = proto.prototype.__proto__;
              } else {
                  proto = null;
              }
          }
      };

      for (i = 0; i < parent.length; i++) {
          for (let j in parent[i].prototype) {
              if (parent[i].prototype.hasOwnProperty(j) && !child.prototype.hasOwnProperty(j)) {
                  child.prototype[j] = parent[i].prototype[j];
              }
          }

          _copyProtoChain(parent[i]);
      }


      const _makeFn = (name: string, protoFn: Function): any => {
          return function () {
              for (i = 0; i < parent.length; i++) {
                  if (parent[i].prototype[name]) {
                      parent[i].prototype[name].apply(this, arguments);
                  }
              }
              return protoFn.apply(this, arguments);
          };
      };

      const _oneSet = (fns: any) => {
          for (let k in fns) {
              child.prototype[k] = _makeFn(k, fns[k]);
          }
      };

      if (arguments.length > 2) {
          for (i = 2; i < arguments.length; i++) {
              _oneSet(arguments[i]);
          }
      }

      return child;
  }*/

  function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
          v = c === 'x' ? r : r & 0x3 | 0x8;
      return v.toString(16);
    });
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

    for (var i = 0; i < obj.length; i++) {
      fn(obj[i]);
    }
  }
  function map(obj, fn) {
    var o = [];

    for (var i = 0; i < obj.length; i++) {
      o.push(fn(obj[i]));
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
            i = 0,
            _dd;

        while (!done && i < t.length) {
          _dd = _getDef(t[i]);

          if (_dd) {
            done = true;
          } else {
            i++;
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

    for (var i in values) {
      if (values[i]) {
        m[i] = values[i];
      }
    }

    return m;
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
        if (!this.tick) {
          this.tick = true;

          if (!this.eventsSuspended && this._listeners[event]) {
            var l = this._listeners[event].length,
                i = 0,
                _gone = false,
                ret = null;

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
                    log("jsPlumb: fire failed for event " + event + " : " + e);
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

        return this;
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
        return this._listeners[forEvent];
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

  function _updateAttachedElements(component, state, timestamp, sourceElement) {
    var affectedElements = component.getAttachedElements();

    if (affectedElements) {
      for (var i = 0, j = affectedElements.length; i < j; i++) {
        if (!sourceElement || sourceElement !== affectedElements[i]) {
          affectedElements[i].setHover(state, true, timestamp); // tell the attached elements not to inform their own attached elements.
        }
      }
    }
  }

  function _splitType(t) {
    return t == null ? null : t.split(" ");
  }

  function _mapType(map, obj, typeId) {
    for (var i in obj) {
      map[i] = typeId;
    }
  }

  function _applyTypes(component, params, doNotRepaint) {
    if (component.getDefaultType) {
      var td = component.getTypeDescriptor(),
          map = {};
      var defType = component.getDefaultType();
      var o = merge({}, defType);

      _mapType(map, defType, "__default");

      for (var i = 0, j = component._jsPlumb.types.length; i < j; i++) {
        var tid = component._jsPlumb.types[i];

        if (tid !== "__default") {
          var _t = component._jsPlumb.instance.getType(tid, td);

          if (_t != null) {
            o = merge(o, _t, ["cssClass"], ["connector"]);

            _mapType(map, _t, tid);
          }
        }
      }

      if (params) {
        o = populate(o, params, "_");
      }

      component.applyType(o, doNotRepaint, map);

      if (!doNotRepaint) {
        component.repaint();
      }
    }
  }

  function _removeTypeCssHelper(component, typeIndex) {
    var typeId = component._jsPlumb.types[typeIndex],
        type = component._jsPlumb.instance.getType(typeId, component.getTypeDescriptor());

    if (type != null && type.cssClass) {
      component.removeClass(type.cssClass);
    }
  } // helper method to update the hover style whenever it, or paintStyle, changes.
  // we use paintStyle as the foundation and merge hoverPaintStyle over the
  // top.

  function _updateHoverStyle(component) {
    if (component._jsPlumb.paintStyle && component._jsPlumb.hoverPaintStyle) {
      var mergedHoverStyle = {};
      extend(mergedHoverStyle, component._jsPlumb.paintStyle);
      extend(mergedHoverStyle, component._jsPlumb.hoverPaintStyle);
      delete component._jsPlumb.hoverPaintStyle; // we want the fill of paintStyle to override a gradient, if possible.

      if (mergedHoverStyle.gradient && component._jsPlumb.paintStyle.fill) {
        delete mergedHoverStyle.gradient;
      }

      component._jsPlumb.hoverPaintStyle = mergedHoverStyle;
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

      _defineProperty(_assertThisInitialized(_this), "typeId", void 0);

      _defineProperty(_assertThisInitialized(_this), "displayElements", []);

      _defineProperty(_assertThisInitialized(_this), "overlayPlacements", []);

      _defineProperty(_assertThisInitialized(_this), "paintStyle", void 0);

      _defineProperty(_assertThisInitialized(_this), "hoverPaintStyle", void 0);

      _defineProperty(_assertThisInitialized(_this), "domListeners", []);

      _defineProperty(_assertThisInitialized(_this), "paintStyleInUse", void 0);

      _defineProperty(_assertThisInitialized(_this), "data", void 0);

      _defineProperty(_assertThisInitialized(_this), "_defaultType", void 0);

      _defineProperty(_assertThisInitialized(_this), "_jsPlumb", void 0);

      _defineProperty(_assertThisInitialized(_this), "cssClass", void 0);

      params = params || {};
      _this.cssClass = params.cssClass || "";
      _this._jsPlumb = {
        instance: instance,
        parameters: params.parameters || {},
        paintStyle: null,
        hoverPaintStyle: null,
        paintStyleInUse: null,
        hover: false,
        beforeDetach: params.beforeDetach,
        beforeDrop: params.beforeDrop,
        overlayPlacements: [],
        hoverClass: params.hoverClass || instance.Defaults.hoverClass,
        types: [],
        typeCache: {},
        visible: true
      };
      _this.id = _this.getIdPrefix() + new Date().getTime();
      var o = params.overlays || [],
          oo = {};

      var defaultOverlayKeys = _this.getDefaultOverlayKeys();

      if (defaultOverlayKeys) {
        for (var i = 0; i < defaultOverlayKeys.length; i++) {
          Array.prototype.push.apply(o, _this.instance.Defaults[defaultOverlayKeys[i]] || []);
        }

        for (var _i = 0; _i < o.length; _i++) {
          // if a string, convert to object representation so that we can store the typeid on it.
          // also assign an id.
          var fo = _this.instance.convertToFullOverlaySpec(o[_i]);

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
      key: "setListenerComponent",
      value: function setListenerComponent(c) {
        for (var i = 0; i < this.domListeners.length; i++) {
          this.domListeners[i][3] = c;
        }
      }
    }, {
      key: "isDetachAllowed",
      value: function isDetachAllowed(connection) {
        var r = true;

        if (this._jsPlumb.beforeDetach) {
          try {
            r = this._jsPlumb.beforeDetach(connection);
          } catch (e) {
            log("jsPlumb: beforeDetach callback failed", e);
          }
        }

        return r;
      }
    }, {
      key: "isDropAllowed",
      value: function isDropAllowed(sourceId, targetId, scope, connection, dropEndpoint, source, target) {
        var r = this._jsPlumb.instance.checkCondition("beforeDrop", {
          sourceId: sourceId,
          targetId: targetId,
          scope: scope,
          connection: connection,
          dropEndpoint: dropEndpoint,
          source: source,
          target: target
        });

        if (this._jsPlumb.beforeDrop) {
          try {
            r = this._jsPlumb.beforeDrop({
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
      } // clone ():Component<E> {
      //     let o = Object.create(this.constructor.prototype);
      //     this.constructor.apply(o, a);
      //     return o;
      // }

    }, {
      key: "getId",
      value: function getId() {
        return this.id;
      }
    }, {
      key: "cacheTypeItem",
      value: function cacheTypeItem(key, item, typeId) {
        this._jsPlumb.typeCache[typeId] = this._jsPlumb.typeCache[typeId] || {};
        this._jsPlumb.typeCache[typeId][key] = item;
      }
    }, {
      key: "getCachedTypeItem",
      value: function getCachedTypeItem(key, typeId) {
        return this._jsPlumb.typeCache[typeId] ? this._jsPlumb.typeCache[typeId][key] : null;
      }
    }, {
      key: "getDisplayElements",
      value: function getDisplayElements() {
        return this.displayElements;
      }
    }, {
      key: "appendDisplayElement",
      value: function appendDisplayElement(el) {
        this.displayElements.push(el);
      }
    }, {
      key: "setType",
      value: function setType(typeId, params, doNotRepaint) {
        this.clearTypes();
        this._jsPlumb.types = _splitType(typeId) || [];

        _applyTypes(this, params, doNotRepaint);
      }
    }, {
      key: "getType",
      value: function getType() {
        return this._jsPlumb.types;
      }
    }, {
      key: "reapplyTypes",
      value: function reapplyTypes(params, doNotRepaint) {
        _applyTypes(this, params, doNotRepaint);
      }
    }, {
      key: "hasType",
      value: function hasType(typeId) {
        return this._jsPlumb.types.indexOf(typeId) !== -1;
      }
    }, {
      key: "addType",
      value: function addType(typeId, params, doNotRepaint) {
        var t = _splitType(typeId),
            _cont = false;

        if (t != null) {
          for (var i = 0, j = t.length; i < j; i++) {
            if (!this.hasType(t[i])) {
              this._jsPlumb.types.push(t[i]);

              _cont = true;
            }
          }

          if (_cont) {
            _applyTypes(this, params, doNotRepaint);
          }
        }
      }
    }, {
      key: "removeType",
      value: function removeType(typeId, params, doNotRepaint) {
        var t = _splitType(typeId),
            _cont = false,
            _one = function (tt) {
          var idx = this._jsPlumb.types.indexOf(tt);

          if (idx !== -1) {
            // remove css class if necessary
            _removeTypeCssHelper(this, idx);

            this._jsPlumb.types.splice(idx, 1);

            return true;
          }

          return false;
        }.bind(this);

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
        var i = this._jsPlumb.types.length;

        for (var j = 0; j < i; j++) {
          _removeTypeCssHelper(this, 0);

          this._jsPlumb.types.splice(0, 1);
        }

        _applyTypes(this, params, doNotRepaint);
      }
    }, {
      key: "toggleType",
      value: function toggleType(typeId, params, doNotRepaint) {
        var t = _splitType(typeId);

        if (t != null) {
          for (var i = 0, j = t.length; i < j; i++) {
            var idx = this._jsPlumb.types.indexOf(t[i]);

            if (idx !== -1) {
              _removeTypeCssHelper(this, idx);

              this._jsPlumb.types.splice(idx, 1);
            } else {
              this._jsPlumb.types.push(t[i]);
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

        this._jsPlumb.paintStyleInUse = this.getPaintStyle();
      }
    }, {
      key: "setPaintStyle",
      value: function setPaintStyle(style, doNotRepaint) {
        this._jsPlumb.paintStyle = style;
        this._jsPlumb.paintStyleInUse = this._jsPlumb.paintStyle;

        _updateHoverStyle(this);

        if (!doNotRepaint) {
          this.repaint();
        }
      }
    }, {
      key: "getPaintStyle",
      value: function getPaintStyle() {
        return this._jsPlumb.paintStyle;
      }
    }, {
      key: "setHoverPaintStyle",
      value: function setHoverPaintStyle(style, doNotRepaint) {
        this._jsPlumb.hoverPaintStyle = style;

        _updateHoverStyle(this);

        if (!doNotRepaint) {
          this.repaint();
        }
      }
    }, {
      key: "getHoverPaintStyle",
      value: function getHoverPaintStyle() {
        return this._jsPlumb.hoverPaintStyle;
      }
    }, {
      key: "cleanup",
      value: function cleanup(force) {}
    }, {
      key: "destroy",
      value: function destroy(force) {
        if (force || this.typeId == null) {
          this.cleanupListeners(); // this is on EventGenerator

          this.clone = null;
          this._jsPlumb = null;
        }
      }
    }, {
      key: "isHover",
      value: function isHover() {
        return this._jsPlumb.hover;
      }
    }, {
      key: "setHover",
      value: function setHover(hover, ignoreAttachedElements, timestamp) {
        // while dragging, we ignore these events.  this keeps the UI from flashing and
        // swishing and whatevering.
        if (this._jsPlumb && !this._jsPlumb.instance.currentlyDragging && !this._jsPlumb.instance.isHoverSuspended()) {
          this._jsPlumb.hover = hover;
          //     if (this._jsPlumb.instance.hoverClass != null) {
          //         this._jsPlumb.instance[method](this.canvas, this._jsPlumb.instance.hoverClass);
          //     }
          //     if (this._jsPlumb.hoverClass != null) {
          //         this._jsPlumb.instance[method](this.canvas, this._jsPlumb.hoverClass);
          //     }
          // }

          if (this._jsPlumb.hoverPaintStyle != null) {
            this._jsPlumb.paintStyleInUse = hover ? this._jsPlumb.hoverPaintStyle : this._jsPlumb.paintStyle;

            if (!this._jsPlumb.instance.isSuspendDrawing()) {
              timestamp = timestamp || _timestamp();
              this.repaint({
                timestamp: timestamp,
                recalc: false
              });
            }
          } // get the list of other affected elements, if supported by this component.
          // for a connection, its the endpoints.  for an endpoint, its the connections! surprise.


          if (this.getAttachedElements && !ignoreAttachedElements) {
            _updateAttachedElements(this, hover, _timestamp(), this);
          }
        }
      }
    }, {
      key: "getParameter",
      value: function getParameter(name) {
        return this._jsPlumb.parameters[name];
      }
    }, {
      key: "setParameter",
      value: function setParameter(name, value) {
        this._jsPlumb.parameters[name] = value;
      }
    }, {
      key: "getParameters",
      value: function getParameters() {
        return this._jsPlumb.parameters;
      }
    }, {
      key: "setParameters",
      value: function setParameters(p) {
        this._jsPlumb.parameters = p;
      }
    }, {
      key: "reattach",
      value: function reattach(instance) {}
    }, {
      key: "setVisible",
      value: function setVisible(v) {
        this._jsPlumb.visible = v;
      }
    }, {
      key: "isVisible",
      value: function isVisible() {
        return this._jsPlumb.visible;
      }
    }, {
      key: "addClass",
      value: function addClass(clazz, dontUpdateOverlays) {
        var parts = (this._jsPlumb.cssClass || "").split(" ");
        parts.push(clazz);
        this._jsPlumb.cssClass = parts.join(" ");
      }
    }, {
      key: "removeClass",
      value: function removeClass(clazz, dontUpdateOverlays) {
        var parts = (this._jsPlumb.cssClass || "").split(" ");
        this._jsPlumb.cssClass = parts.filter(function (p) {
          return p !== clazz;
        }).join(" ");
      }
    }, {
      key: "getClass",
      value: function getClass() {
        return this._jsPlumb.cssClass;
      }
    }, {
      key: "shouldFireEvent",
      value: function shouldFireEvent(event, value, originalEvent) {
        return true;
      }
    }, {
      key: "repaint",
      value: function repaint(options) {
        this.instance.renderer.repaint(this, this.getTypeDescriptor(), options);
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

      _defineProperty(_assertThisInitialized(_this), "renderer", void 0);

      _defineProperty(_assertThisInitialized(_this), "visible", true);

      _defineProperty(_assertThisInitialized(_this), "location", void 0);

      _defineProperty(_assertThisInitialized(_this), "endpointLocation", void 0);

      _defineProperty(_assertThisInitialized(_this), "events", void 0);

      p = p || {};
      _this.id = p.id || uuid();
      _this.cssClass = p.cssClass || "";
      _this.location = p.location || 0.5;
      _this.events = p.events || {};
      return _this;
    }

    _createClass(Overlay, [{
      key: "setRenderer",
      value: function setRenderer(r) {
        this.renderer = r;
        var e = r.getElement(this.component);

        for (var event in this.events) {
          this.bind(event, this.events[event]);
        }
      }
    }, {
      key: "getRenderer",
      value: function getRenderer() {
        return this.renderer;
      }
    }, {
      key: "shouldFireEvent",
      value: function shouldFireEvent(event, value, originalEvent) {
        return true;
      }
    }, {
      key: "setVisible",
      value: function setVisible(v) {
        this.visible = v;
        this.renderer.setVisible(v);
      }
    }, {
      key: "hide",
      value: function hide() {
        this.setVisible(false);
      }
    }, {
      key: "show",
      value: function show() {
        this.setVisible(true);
      }
    }, {
      key: "isVisible",
      value: function isVisible() {
        return this.visible;
      }
    }, {
      key: "destroy",
      value: function destroy(force) {
        this.renderer.destroy(force);
      }
    }, {
      key: "addClass",
      value: function addClass(clazz) {
        this.renderer.addClass(clazz);
      }
    }, {
      key: "removeClass",
      value: function removeClass(clazz) {
        this.renderer.removeClass(clazz);
      }
    }, {
      key: "setListenerComponent",
      value: function setListenerComponent(c) {}
    }, {
      key: "reattach",
      value: function reattach(component) {// if (this._jsPlumb.div != null) {
        //     instance.getContainer().appendChild(this._jsPlumb.div);
        // }
        // this.detached = false;
      }
    }, {
      key: "transfer",
      value: function transfer(target) {}
    }, {
      key: "paint",
      value: function paint(params, extents) {
        //console.log("PAINT on label overlay called")
        return this.renderer.paint(params, extents);
      }
    }, {
      key: "_postComponentEvent",
      value: function _postComponentEvent(eventName, originalEvent) {
        this.instance.fire(eventName, this.component, originalEvent);
      }
    }, {
      key: "click",
      value: function click(e) {
        this.fire("click", e);
        var eventName = this.component instanceof Connection ? "click" : "endpointClick";

        this._postComponentEvent(eventName, e);
      }
    }, {
      key: "dblClick",
      value: function dblClick(e) {
        this.fire("click", e);
        var eventName = this.component instanceof Connection ? "dblclick" : "endpointDblClick";

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

      _defineProperty(_assertThisInitialized(_this), "type", "Label");

      _defineProperty(_assertThisInitialized(_this), "cachedDimensions", void 0);

      p = p || {
        label: ""
      };

      _this.setRenderer(_this.instance.renderer.assignOverlayRenderer(_this.instance, _assertThisInitialized(_this)));

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
        this.update();
      }
    }, {
      key: "_getDimensions",
      value: function _getDimensions(forceRefresh) {
        if (this.cachedDimensions == null || forceRefresh) {
          this.cachedDimensions = this.getDimensions();
        }

        return this.cachedDimensions;
      }
    }, {
      key: "getDimensions",
      value: function getDimensions() {
        return [1, 1];
      }
    }, {
      key: "draw",
      value: function draw(component, paintStyle, absolutePosition) {
        return this.getRenderer().draw(component, paintStyle, absolutePosition);
      }
    }, {
      key: "updateFrom",
      value: function updateFrom(d) {
        if (d.label != null) {
          this.setLabel(d.label);
        }
      }
    }, {
      key: "update",
      value: function update() {
        if (isFunction(this.label)) {
          var lt = this.label(this);

          if (lt != null) {
            this.getRenderer().setText(lt.replace(/\r\n/g, "<br/>"));
          } else {
            this.getRenderer().setText("");
          }
        } else {
          if (this.labelText == null) {
            this.labelText = this.label;

            if (this.labelText != null) {
              this.getRenderer().setText(this.labelText.replace(/\r\n/g, "<br/>"));
            } else {
              this.getRenderer().setText("");
            }
          }
        }
      }
    }]);

    return LabelOverlay;
  }(Overlay);
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
    component._jsPlumb.overlays[_newOverlay.id] = _newOverlay;
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

      params = params || {};
      _this._jsPlumb.overlays = {};
      _this._jsPlumb.overlayPositions = {};

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
      key: "setListenerComponent",
      value: function setListenerComponent(c) {
        if (this._jsPlumb) {
          _get(_getPrototypeOf(OverlayCapableComponent.prototype), "setListenerComponent", this).call(this, c);

          for (var i in this._jsPlumb.overlays) {
            this._jsPlumb.overlays[i].setListenerComponent(c);
          }
        }
      }
    }, {
      key: "setHover",
      value: function setHover(hover, ignoreAttachedElements) {
        _get(_getPrototypeOf(OverlayCapableComponent.prototype), "setHover", this).call(this, hover, ignoreAttachedElements);

        if (this._jsPlumb && !this.instance.isConnectionBeingDragged) {
          for (var i in this._jsPlumb.overlays) {
            this._jsPlumb.overlays[i][hover ? "addClass" : "removeClass"](this._jsPlumb.instance.hoverClass);
          }
        }
      }
    }, {
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
          this.repaint();
        }

        return o;
      }
    }, {
      key: "getOverlay",
      value: function getOverlay(id) {
        return this._jsPlumb.overlays[id];
      }
    }, {
      key: "getOverlays",
      value: function getOverlays() {
        return this._jsPlumb.overlays;
      }
    }, {
      key: "hideOverlay",
      value: function hideOverlay(id) {
        var o = this.getOverlay(id);

        if (o) {
          o.hide();
        }
      }
    }, {
      key: "hideOverlays",
      value: function hideOverlays() {
        for (var i in this._jsPlumb.overlays) {
          this._jsPlumb.overlays[i].hide();
        }
      }
    }, {
      key: "showOverlay",
      value: function showOverlay(id) {
        var o = this.getOverlay(id);

        if (o) {
          o.show();
        }
      }
    }, {
      key: "showOverlays",
      value: function showOverlays() {
        for (var i in this._jsPlumb.overlays) {
          this._jsPlumb.overlays[i].show();
        }
      }
    }, {
      key: "removeAllOverlays",
      value: function removeAllOverlays(doNotRepaint) {
        for (var i in this._jsPlumb.overlays) {
          this._jsPlumb.overlays[i].destroy(true);
        }

        this._jsPlumb.overlays = {};
        this._jsPlumb.overlayPositions = null;
        this._jsPlumb.overlayPlacements = {};

        if (!doNotRepaint) {
          this.repaint();
        }
      }
    }, {
      key: "removeOverlay",
      value: function removeOverlay(overlayId, dontCleanup) {
        var o = this._jsPlumb.overlays[overlayId];

        if (o) {
          o.setVisible(false);

          if (!dontCleanup) {
            o.destroy(true);
          }

          delete this._jsPlumb.overlays[overlayId];

          if (this._jsPlumb.overlayPositions) {
            delete this._jsPlumb.overlayPositions[overlayId];
          }

          if (this._jsPlumb.overlayPlacements) {
            delete this._jsPlumb.overlayPlacements[overlayId];
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
          this._jsPlumb.overlays[_internalLabelOverlayId] = lo;
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

        if (!this._jsPlumb.instance.isSuspendDrawing()) {
          this.repaint();
        }
      }
    }, {
      key: "cleanup",
      value: function cleanup(force) {
        _get(_getPrototypeOf(OverlayCapableComponent.prototype), "cleanup", this).call(this, force);

        for (var i in this._jsPlumb.overlays) {
          this._jsPlumb.overlays[i].destroy(force);
        }

        if (force) {
          this._jsPlumb.overlays = {};
          this._jsPlumb.overlayPositions = null;
        }
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
        this._jsPlumb.overlayPositions[overlay.id] = xy;
      }
    }, {
      key: "getAbsoluteOverlayPosition",
      value: function getAbsoluteOverlayPosition(overlay) {
        return this._jsPlumb.overlayPositions ? this._jsPlumb.overlayPositions[overlay.id] : null;
      }
    }, {
      key: "_clazzManip",
      value: function _clazzManip(action, clazz, dontUpdateOverlays) {
        if (!dontUpdateOverlays) {
          for (var i in this._jsPlumb.overlays) {
            this._jsPlumb.overlays[i][action + "Class"](clazz);
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
            var existing = this._jsPlumb.overlays[t.overlays[i][1].id];

            if (existing) {
              // maybe update from data, if there were parameterised values for instance.
              existing.updateFrom(t.overlays[i][1]);
              keep[t.overlays[i][1].id] = true;
            } else {
              var c = this.getCachedTypeItem("overlay", t.overlays[i][1].id);

              if (c != null) {
                c.reattach(this);
                c.setVisible(true); // maybe update from data, if there were parameterised values for instance.

                c.updateFrom(t.overlays[i][1]);
                this._jsPlumb.overlays[c.id] = c;
              } else {
                c = this.addOverlay(t.overlays[i], true);
              }

              keep[c.id] = true;
            }
          } // now loop through the full overlays and remove those that we dont want to keep


          for (i in this._jsPlumb.overlays) {
            if (keep[this._jsPlumb.overlays[i].id] == null) {
              this.removeOverlay(this._jsPlumb.overlays[i].id, true); // remove overlay but dont clean it up.
              // that would remove event listeners etc; overlays are never discarded by the types stuff, they are
              // just detached/reattached.
            }
          }
        }
      }
    }, {
      key: "moveParent",
      value: function moveParent(newParent) {
        for (var i in this._jsPlumb.overlays) {
          this._jsPlumb.overlays[i].getRenderer().moveParent(newParent);
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
          this.lastReturnValue = null;
        }
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

        this.lastReturnValue = [xy[0] + this.x * wh[0] + this.offsets[0], xy[1] + this.y * wh[1] + this.offsets[1], this.x, this.y];
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
  function _distance(anchor, cx, cy, xy, wh) {
    var ax = xy[0] + anchor.x * wh[0],
        ay = xy[1] + anchor.y * wh[1],
        acx = xy[0] + wh[0] / 2,
        acy = xy[1] + wh[1] / 2;
    return Math.sqrt(Math.pow(cx - ax, 2) + Math.pow(cy - ay, 2)) + Math.sqrt(Math.pow(acx - ax, 2) + Math.pow(acy - ay, 2));
  }

  var DEFAULT_ANCHOR_SELECTOR = function DEFAULT_ANCHOR_SELECTOR(xy, wh, txy, twh, anchors) {
    var cx = txy[0] + twh[0] / 2,
        cy = txy[1] + twh[1] / 2;
    var minIdx = -1,
        minDist = Infinity;

    for (var i = 0; i < anchors.length; i++) {
      var d = _distance(anchors[i], cx, cy, xy, wh);

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
          return this._curAnchor.compute(params);
        } else {
          params.timestamp = null; // otherwise clear this, i think. we want the anchor to compute.
        }

        this._curAnchor = this._anchorSelector(xy, wh, txy, twh, this.anchors);
        this.x = this._curAnchor.x;
        this.y = this._curAnchor.y;

        if (this._curAnchor !== this._lastAnchor) {
          this.fire("anchorChanged", this._curAnchor);
        }

        this._lastAnchor = this._curAnchor;
        return this._curAnchor.compute(params);
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

      _defineProperty(_assertThisInitialized(_this), "type", "Continuous");

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
      } //isRelocatable = function() { return true; };
      //isSnapOnRelocate = function() { return true; };
      // if the given edge is supported, returns it. otherwise looks for a substitute that _is_
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
      }
    }, {
      key: "unlock",
      value: function unlock() {
        this._lockedFace = null;
      }
    }, {
      key: "isLocked",
      value: function isLocked() {
        return this._lockedFace != null;
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
        return this.instance.anchorManager.continuousAnchorLocations[params.element.id] || [0, 0];
      }
    }, {
      key: "getCurrentLocation",
      value: function getCurrentLocation(params) {
        return this.instance.anchorManager.continuousAnchorLocations[params.element.id] || [0, 0];
      }
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

  var X_AXIS_FACES = ["left", "right"];
  var Y_AXIS_FACES = ["top", "bottom"];
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
    a.orientation = [ox, oy];
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
    a.orientation = orientation;
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
      var a = new ContinuousAnchor(instance, {
        faces: faces
      });
      a.type = type;
      return a;
    };
  }

  anchorMap["Continuous"] = function (instance, params) {
    return instance.anchorManager.continuousAnchorFactory.get(instance, params);
  };

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
      //} implements Connection<E> {        // extend OverlayCapableComponent.. hmm.
      value: function getIdPrefix() {
        return "_jsPlumb_c";
      }
    }, {
      key: "getDefaultOverlayKeys",
      value: function getDefaultOverlayKeys() {
        return ["overlays", "connectionOverlays"];
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

      _defineProperty(_assertThisInitialized(_this), "endpoints", [null, null]);

      _defineProperty(_assertThisInitialized(_this), "endpointStyles", [null, null]);

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
      instance.manage(_this.sourceId, _this.source);
      instance.manage(_this.targetId, _this.target);
      _this._jsPlumb.visible = true;
      _this._jsPlumb.params = {
        cssClass: params.cssClass,
        //container: params.container,
        "pointer-events": params["pointer-events"],
        //editorParams: params.editorParams,
        overlays: params.overlays
      };
      _this._jsPlumb.lastPaintedAt = null;

      _this.bind("mouseover", function () {
        _this.setHover(true);
      });

      _this.bind("mouseout", function () {
        _this.setHover(false);
      });

      if (params.type) {
        params.endpoints = params.endpoints || _this.instance.deriveEndpointAndAnchorSpec(params.type).endpoints;
      }

      _this._jsPlumb.endpoint = params.endpoint;
      _this._jsPlumb.endpoints = params.endpoints;
      _this._jsPlumb.endpointStyle = params.endpointStyle;
      _this._jsPlumb.endpointHoverStyle = params.endpointHoverStyle;
      _this._jsPlumb.endpointStyles = params.endpointStyles;
      _this._jsPlumb.endpointHoverStyles = params.endpointHoverStyles;
      _this._jsPlumb.paintStyle = params.paintStyle;
      _this._jsPlumb.hoverPaintStyle = params.hoverPaintStyle;
      _this._jsPlumb.uuids = params.uuids;

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

      _this._jsPlumb.endpoints = params.endpoints || [null, null];
      _this._jsPlumb.endpoint = params.endpoint || null;

      var _reattach = params.reattach || _this.endpoints[0].reattachConnections || _this.endpoints[1].reattachConnections || _this.instance.Defaults.reattachConnections;

      _this.appendToDefaultType({
        detachable: _detachable,
        reattach: _reattach,
        paintStyle: _this.endpoints[0].connectorStyle || _this.endpoints[1].connectorStyle || params.paintStyle || _this.instance.Defaults.paintStyle,
        hoverPaintStyle: _this.endpoints[0].connectorHoverStyle || _this.endpoints[1].connectorHoverStyle || params.hoverPaintStyle || _this.instance.Defaults.hoverPaintStyle
      });

      if (!_this.instance.isSuspendDrawing()) {
        // paint the endpoints
        var myInfo = _this.instance.getCachedData(_this.sourceId),
            myOffset = myInfo.o,
            myWH = myInfo.s,
            otherInfo = _this.instance.getCachedData(_this.targetId),
            otherOffset = otherInfo.o,
            otherWH = otherInfo.s,
            initialTimestamp = _this.instance._suspendedAt || _timestamp(),
            anchorLoc = _this.endpoints[0].anchor.compute({
          xy: [myOffset.left, myOffset.top],
          wh: myWH,
          element: _this.endpoints[0],
          elementId: _this.endpoints[0].elementId,
          txy: [otherOffset.left, otherOffset.top],
          twh: otherWH,
          tElement: _this.endpoints[1],
          timestamp: initialTimestamp
        });

        _this.endpoints[0].paint({
          anchorLoc: anchorLoc,
          timestamp: initialTimestamp
        });

        anchorLoc = _this.endpoints[1].anchor.compute({
          xy: [otherOffset.left, otherOffset.top],
          wh: otherWH,
          element: _this.endpoints[1],
          elementId: _this.endpoints[1].elementId,
          txy: [myOffset.left, myOffset.top],
          twh: myWH,
          tElement: _this.endpoints[0],
          timestamp: initialTimestamp
        });

        _this.endpoints[1].paint({
          anchorLoc: anchorLoc,
          timestamp: initialTimestamp
        });
      }

      _this._jsPlumb.cost = params.cost || _this.endpoints[0].getConnectionCost();
      _this._jsPlumb.directed = params.directed; // inherit directed flag if set no source endpoint

      if (params.directed == null) {
        _this._jsPlumb.directed = _this.endpoints[0].areConnectionsDirected();
      } // PARAMETERS
      // merge all the parameters objects into the connection.  parameters set
      // on the connection take precedence; then source endpoint params, then
      // finally target endpoint params.


      var _p = extend({}, _this.endpoints[1].getParameters());

      extend(_p, _this.endpoints[0].getParameters());
      extend(_p, _this.getParameters());

      _this.setParameters(_p); // END PARAMETERS
      // PAINTING


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
        elId = elId || this._jsPlumb.instance.getId(el);
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
        return this._jsPlumb.detachable === false ? false : ep != null ? ep.connectionsDetachable === true : this._jsPlumb.detachable === true;
      }
    }, {
      key: "setDetachable",
      value: function setDetachable(detachable) {
        this._jsPlumb.detachable = detachable === true;
      }
    }, {
      key: "isReattach",
      value: function isReattach() {
        return this._jsPlumb.reattach === true || this.endpoints[0].reattachConnections === true || this.endpoints[1].reattachConnections === true;
      }
    }, {
      key: "setReattach",
      value: function setReattach(reattach) {
        this._jsPlumb.reattach = reattach === true;
      }
    }, {
      key: "applyType",
      value: function applyType(t, doNotRepaint, typeMap) {
        _get(_getPrototypeOf(Connection.prototype), "applyType", this).call(this, t, doNotRepaint, typeMap); //window.jtime("apply connection type");


        var _connector = null;

        if (t.connector != null) {
          _connector = this.getCachedTypeItem("connector", typeMap.connector);

          if (_connector == null) {
            _connector = this.prepareConnector(t.connector, typeMap.connector);
            this.cacheTypeItem("connector", _connector, typeMap.connector);
          }

          this.setPreparedConnector(_connector);
        } // none of these things result in the creation of objects so can be ignored.


        if (t.detachable != null) {
          this.setDetachable(t.detachable);
        }

        if (t.reattach != null) {
          this.setReattach(t.reattach);
        }

        if (t.scope) {
          this.scope = t.scope;
        } // if (t.cssClass != null && this.canvas) {
        //     this._jsPlumb.instance.addClass(this.canvas, t.cssClass);
        // }


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

        this.connector.applyType(t); //   window.jtimeEnd("apply connection type");
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
          this.connector.addClass(c);
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
          this.connector.removeClass(c);
        }
      }
    }, {
      key: "setVisible",
      value: function setVisible(v) {
        _get(_getPrototypeOf(Connection.prototype), "setVisible", this).call(this, v);

        if (this.connector) {
          this.connector.setVisible(v);
        }

        this.repaint();
      }
    }, {
      key: "cleanup",
      value: function cleanup(force) {
        _get(_getPrototypeOf(Connection.prototype), "cleanup", this).call(this, force);

        this.updateConnectedClass(true);
        this.endpoints = null;
        this.source = null;
        this.target = null;

        if (this.connector != null) {
          this.connector.cleanup(true);
          this.connector.destroy(true);
        }

        this.connector = null;
      }
    }, {
      key: "moveParent",
      value: function moveParent(newParent) {
        this.connector.renderer.moveParent(newParent);

        _get(_getPrototypeOf(Connection.prototype), "moveParent", this).call(this, newParent);
      }
    }, {
      key: "updateConnectedClass",
      value: function updateConnectedClass(remove) {
        if (this._jsPlumb) {
          _updateConnectedClass(this, this.source, remove);

          _updateConnectedClass(this, this.target, remove);
        }
      }
    }, {
      key: "setHover",
      value: function setHover(state) {
        _get(_getPrototypeOf(Connection.prototype), "setHover", this).call(this, state);

        if (this.connector && this._jsPlumb && !this.instance.isConnectionBeingDragged) {
          this.connector.setHover(state);
          this.instance[state ? "addClass" : "removeClass"](this.source, this.instance.hoverSourceClass);
          this.instance[state ? "addClass" : "removeClass"](this.target, this.instance.hoverTargetClass);
        }
      }
    }, {
      key: "getUuids",
      value: function getUuids() {
        return [this.endpoints[0].getUuid(), this.endpoints[1].getUuid()];
      }
    }, {
      key: "getCost",
      value: function getCost() {
        return this._jsPlumb ? this._jsPlumb.cost : -Infinity;
      }
    }, {
      key: "setCost",
      value: function setCost(c) {
        this._jsPlumb.cost = c;
      }
    }, {
      key: "isDirected",
      value: function isDirected() {
        return this._jsPlumb.directed;
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
          _jsPlumb: this._jsPlumb.instance,
          cssClass: this._jsPlumb.params.cssClass,
          container: this._jsPlumb.params.container,
          "pointer-events": this._jsPlumb.params["pointer-events"]
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
            previous = this.connector;
            previousClasses = previous.getClass();
            this.connector.cleanup();
            this.connector.destroy();
          }

          this.connector = connector;

          if (typeId) {
            this.cacheTypeItem("connector", connector, typeId);
          } // this.canvas = this.connector.canvas;
          // this.bgCanvas = this.connector.bgCanvas;
          // put classes from prior connector onto the canvas


          this.addClass(previousClasses); // new: instead of binding listeners per connector, we now just have one delegate on the container.
          // so for that handler we set the connection as the '_jsPlumb' member of the canvas element, and
          // bgCanvas, if it exists, which it does right now in the VML renderer, so it won't from v 2.0.0 onwards.
          // if (this.canvas) {
          //     (<any>this.canvas)._jsPlumb = this;
          // }
          // if (this.bgCanvas) {
          //     (<any>this.bgCanvas)._jsPlumb = this;
          // }

          if (previous != null) {
            var o = this.getOverlays();

            for (var i in o) {
              if (o[i].transfer) {
                o[i].transfer(this.connector);
              }
            }
          }

          if (!doNotChangeListenerComponent) {
            this.setListenerComponent(this.connector);
          }

          if (!doNotRepaint) {
            this.repaint();
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
        if (!this.instance.isSuspendDrawing() && this._jsPlumb.visible) {
          //window.jtime("connection paint");
          params = params || {};
          var timestamp = params.timestamp,
              // if the moving object is not the source we must transpose the two references.
          swap = false,
              tId = swap ? this.sourceId : this.targetId,
              sId = swap ? this.targetId : this.sourceId,
              tIdx = swap ? 0 : 1,
              sIdx = swap ? 1 : 0;

          if (timestamp == null || timestamp !== this._jsPlumb.lastPaintedAt) {
            var sourceInfo = this.instance.updateOffset({
              elId: sId
            }).o,
                targetInfo = this.instance.updateOffset({
              elId: tId
            }).o,
                sE = this.endpoints[sIdx],
                tE = this.endpoints[tIdx];
            var sAnchorP = sE.anchor.getCurrentLocation({
              xy: [sourceInfo.left, sourceInfo.top],
              wh: [sourceInfo.width, sourceInfo.height],
              element: sE,
              timestamp: timestamp
            }),
                tAnchorP = tE.anchor.getCurrentLocation({
              xy: [targetInfo.left, targetInfo.top],
              wh: [targetInfo.width, targetInfo.height],
              element: tE,
              timestamp: timestamp
            });
            this.connector.resetBounds();
            this.connector.compute({
              sourcePos: sAnchorP,
              targetPos: tAnchorP,
              sourceOrientation: sE.anchor.getOrientation(sE),
              targetOrientation: tE.anchor.getOrientation(tE),
              sourceEndpoint: this.endpoints[sIdx],
              targetEndpoint: this.endpoints[tIdx],
              strokeWidth: this._jsPlumb.paintStyleInUse.strokeWidth,
              sourceInfo: sourceInfo,
              targetInfo: targetInfo
            }); //window.jtime("connection overlays");

            var overlayExtents = {
              minX: Infinity,
              minY: Infinity,
              maxX: -Infinity,
              maxY: -Infinity
            }; // compute overlays. we do this first so we can get their placements, and adjust the
            // container if needs be (if an overlay would be clipped)

            for (var i in this._jsPlumb.overlays) {
              if (this._jsPlumb.overlays.hasOwnProperty(i)) {
                var o = this._jsPlumb.overlays[i];

                if (o.isVisible()) {
                  this._jsPlumb.overlayPlacements[i] = o.draw(this.connector, this._jsPlumb.paintStyleInUse, this.getAbsoluteOverlayPosition(o));
                  overlayExtents.minX = Math.min(overlayExtents.minX, this._jsPlumb.overlayPlacements[i].minX);
                  overlayExtents.maxX = Math.max(overlayExtents.maxX, this._jsPlumb.overlayPlacements[i].maxX);
                  overlayExtents.minY = Math.min(overlayExtents.minY, this._jsPlumb.overlayPlacements[i].minY);
                  overlayExtents.maxY = Math.max(overlayExtents.maxY, this._jsPlumb.overlayPlacements[i].maxY);
                }
              }
            }

            var lineWidth = parseFloat("" + this._jsPlumb.paintStyleInUse.strokeWidth || "1") / 2,
                outlineWidth = parseFloat("" + this._jsPlumb.paintStyleInUse.strokeWidth || "0"),
                extents = {
              xmin: Math.min(this.connector.bounds.minX - (lineWidth + outlineWidth), overlayExtents.minX),
              ymin: Math.min(this.connector.bounds.minY - (lineWidth + outlineWidth), overlayExtents.minY),
              xmax: Math.max(this.connector.bounds.maxX + (lineWidth + outlineWidth), overlayExtents.maxX),
              ymax: Math.max(this.connector.bounds.maxY + (lineWidth + outlineWidth), overlayExtents.maxY)
            }; // window.jtimeEnd("connection overlays");
            // paint the connector.
            //window.jtime("connector paint");

            this.connector.paintExtents = extents;
            this.connector.paint(this._jsPlumb.paintStyleInUse, extents); //window.jtimeEnd("connector paint");
            // and then the overlays

            for (var j in this._jsPlumb.overlays) {
              if (this._jsPlumb.overlays.hasOwnProperty(j)) {
                var p = this._jsPlumb.overlays[j];

                if (p.isVisible()) {
                  p.paint(this._jsPlumb.overlayPlacements[j], extents);
                }
              }
            }
          }

          this._jsPlumb.lastPaintedAt = timestamp; //window.jtimeEnd("connection paint");
        }
      }
    }, {
      key: "repaint",
      value: function repaint(params) {
        var p = extend(params || {}, {});
        p.elId = this.sourceId;
        this.paint(p);
      }
    }, {
      key: "prepareEndpoint",
      value: function prepareEndpoint(existing, index, element, elementId, params) {
        //window.jtime("prepare endpoint");
        var e;
        params = params || this._jsPlumb;

        if (existing) {
          this.endpoints[index] = existing;
          existing.addConnection(this);
        } else {
          if (!params.endpoints) {
            params.endpoints = [null, null];
          }

          var ep = params.endpoints[index] || params.endpoint || this.instance.Defaults.endpoints[index] || this.instance.Defaults.endpoint;

          if (!params.endpointStyles) {
            params.endpointStyles = [null, null];
          }

          if (!params.endpointHoverStyles) {
            params.endpointHoverStyles = [null, null];
          }

          var es = params.endpointStyles[index] || params.endpointStyle || this.instance.Defaults.endpointStyles[index] || this.instance.Defaults.endpointStyle; // Endpoints derive their fill from the connector's stroke, if no fill was specified.

          if (es.fill == null && params.paintStyle != null) {
            es.fill = params.paintStyle.stroke;
          }

          if (es.outlineStroke == null && params.paintStyle != null) {
            es.outlineStroke = params.paintStyle.outlineStroke;
          }

          if (es.outlineWidth == null && params.paintStyle != null) {
            es.outlineWidth = params.paintStyle.outlineWidth;
          }

          var ehs = params.endpointHoverStyles[index] || params.endpointHoverStyle || this.instance.Defaults.endpointHoverStyles[index] || this.instance.Defaults.endpointHoverStyle; // endpoint hover fill style is derived from connector's hover stroke style

          if (params.hoverPaintStyle != null) {
            if (ehs == null) {
              ehs = {};
            }

            if (ehs.fill == null) {
              ehs.fill = params.hoverPaintStyle.stroke;
            }
          }

          var a = this.anchors ? this.anchors[index] : this.anchor ? this.anchor : this._makeAnchor(this.instance.Defaults.anchors[index], elementId) || this._makeAnchor(this.instance.Defaults.anchor, elementId),
              u = params.uuids ? params.uuids[index] : null;
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

          this.endpoints[index] = e; // if (params.drawEndpoints === false) {
          //     e.setVisible(false, true, true);
          // }
        } //   window.jtimeEnd("prepare endpoint");


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
        this.instance.deleteObject({
          endpoint: current,
          deleteAttachedObjects: false
        });
        this.instance.fire("endpointReplaced", {
          previous: current,
          current: _new
        });
        this.instance.anchorManager.updateOtherEndpoint(this.endpoints[0].elementId, this.endpoints[1].elementId, this.endpoints[1].elementId, this);
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
      minX: 0,
      maxX: 0,
      minY: 0,
      maxY: 0
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
       * Infinity for distance and null values for everything else;
       * subclasses are expected to override.
       */

    }, {
      key: "findClosestPointOnPath",
      value: function findClosestPointOnPath(x, y) {
        return noSuchPoint();
      } // getBounds ():SegmentBounds {
      //     return {
      //         minX: Math.min(this.params.x1, this.params.x2),
      //         minY: Math.min(this.params.y1, this.params.y2),
      //         maxX: Math.max(this.params.x1, this.params.x2),
      //         maxY: Math.max(this.params.y1, this.params.y2)
      //     };
      // }

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

      _defineProperty(this, "renderer", void 0);

      _defineProperty(this, "x", void 0);

      _defineProperty(this, "y", void 0);

      _defineProperty(this, "w", void 0);

      _defineProperty(this, "h", void 0);

      _defineProperty(this, "computedValue", void 0);

      _defineProperty(this, "bounds", EMPTY_BOUNDS());

      _defineProperty(this, "instance", void 0);

      this.instance = endpoint.instance;
      this.renderer = this.instance.renderer.assignRenderer(endpoint, this);
    }

    _createClass(EndpointRepresentation, [{
      key: "addClass",
      value: function addClass(c) {
        this.renderer.addClass(c);
      }
    }, {
      key: "removeClass",
      value: function removeClass(c) {
        this.renderer.removeClass(c);
      }
    }, {
      key: "paint",
      value: function paint(paintStyle) {
        this.renderer.paint(paintStyle);
      }
    }, {
      key: "clone",
      value: function clone() {
        return null;
      }
    }, {
      key: "cleanup",
      value: function cleanup(force) {
        this.renderer.cleanup(force);
      }
    }, {
      key: "destroy",
      value: function destroy(force) {
        this.renderer.destroy(force);
      }
    }, {
      key: "setHover",
      value: function setHover(h) {
        this.renderer.setHover(h);
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
      key: "applyType",
      value: function applyType(t) {
        this.renderer.applyType(t);
      }
    }, {
      key: "setVisible",
      value: function setVisible(v) {
        this.renderer.setVisible(v);
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
      key: "getDefaultOverlayKeys",
      value: function getDefaultOverlayKeys() {
        return ["overlays", "endpointOverlays"];
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

      _defineProperty(_assertThisInitialized(_this), "connectorClass", void 0);

      _defineProperty(_assertThisInitialized(_this), "connectorHoverClass", void 0);

      _defineProperty(_assertThisInitialized(_this), "_originalAnchor", void 0);

      _defineProperty(_assertThisInitialized(_this), "deleteAfterDragStop", void 0);

      _defineProperty(_assertThisInitialized(_this), "finalEndpoint", void 0);

      _defineProperty(_assertThisInitialized(_this), "isSource", void 0);

      _defineProperty(_assertThisInitialized(_this), "isTarget", void 0);

      _defineProperty(_assertThisInitialized(_this), "isTemporarySource", void 0);

      _defineProperty(_assertThisInitialized(_this), "connectionsDetachable", void 0);

      _defineProperty(_assertThisInitialized(_this), "reattachConnections", void 0);

      _defineProperty(_assertThisInitialized(_this), "referenceEndpoint", void 0);

      _defineProperty(_assertThisInitialized(_this), "connectionType", void 0);

      _defineProperty(_assertThisInitialized(_this), "connector", void 0);

      _defineProperty(_assertThisInitialized(_this), "connectorOverlays", void 0);

      _defineProperty(_assertThisInitialized(_this), "connectorStyle", void 0);

      _defineProperty(_assertThisInitialized(_this), "connectorHoverStyle", void 0);

      _defineProperty(_assertThisInitialized(_this), "dragProxy", void 0);

      _defineProperty(_assertThisInitialized(_this), "deleteOnEmpty", void 0);

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

      _this._jsPlumb.enabled = !(params.enabled === false);
      _this._jsPlumb.visible = true;
      _this.element = _this.instance.getElement(params.source);
      _this._jsPlumb.uuid = params.uuid;
      _this._jsPlumb.floatingEndpoint = null;

      if (_this._jsPlumb.uuid) {
        _this.instance.endpointsByUUID[_this._jsPlumb.uuid] = _assertThisInitialized(_this);
      }

      _this.elementId = params.elementId;
      _this.dragProxy = params.dragProxy;
      _this._jsPlumb.connectionCost = params.connectionCost;
      _this._jsPlumb.connectionsDirected = params.connectionsDirected;
      _this._jsPlumb.currentAnchorClass = "";
      _this._jsPlumb.events = {};
      _this.connectorOverlays = params.connectorOverlays;
      _this._jsPlumb.scope = params.scope;
      _this.connectionsDetachable = params.connectionsDetachable;
      _this.reattachConnections = params.reattachConnections;
      _this.connectorStyle = params.connectorStyle;
      _this.connectorHoverStyle = params.connectorHoverStyle;
      _this.connector = params.connector;
      _this.connectionType = params.connectionType;
      _this.connectorClass = params.connectorClass;
      _this.connectorHoverClass = params.connectorHoverClass;
      _this.deleteOnEmpty = params.deleteOnEmpty === true;

      var internalHover = function internalHover(state) {
        if (_this.connections.length > 0) {
          for (var i = 0; i < _this.connections.length; i++) {
            _this.connections[i].setHover(state);
          }
        } else {
          _this.setHover(state);
        }
      };

      _this.bind("mouseover", function () {
        internalHover(true);
      });

      _this.bind("mouseout", function () {
        internalHover(false);
      });

      if (!params._transient) {
        // in place copies, for example, are transient.  they will never need to be retrieved during a paint cycle, because they dont move, and then they are deleted.
        _this.instance.anchorManager.add(_assertThisInitialized(_this), _this.elementId);
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
        // stash old, get new
        var oldAnchorClass = this.instance.endpointAnchorClassPrefix + "-" + this._jsPlumb.currentAnchorClass;
        this._jsPlumb.currentAnchorClass = this.anchor.getCssClass();
        var anchorClass = this.instance.endpointAnchorClassPrefix + (this._jsPlumb.currentAnchorClass ? "-" + this._jsPlumb.currentAnchorClass : "");
        this.removeClass(oldAnchorClass);
        this.addClass(anchorClass);
        this.instance.removeClass(this.element, oldAnchorClass);
        this.instance.addClass(this.element, anchorClass);
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
      value: function setPreparedAnchor(anchor, doNotRepaint) {
        this.instance.anchorManager.continuousAnchorFactory.clear(this.elementId);
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
        this.connections.push(conn);
        this[(this.connections.length > 0 ? "add" : "remove") + "Class"](this.instance.endpointConnectedClass);
        this[(this.isFull() ? "add" : "remove") + "Class"](this.instance.endpointFullClass);
      }
    }, {
      key: "detachFromConnection",
      value: function detachFromConnection(connection, idx, doNotCleanup) {
        idx = idx == null ? this.connections.indexOf(connection) : idx;

        if (idx >= 0) {
          this.connections.splice(idx, 1);
          this[(this.connections.length > 0 ? "add" : "remove") + "Class"](this.instance.endpointConnectedClass);
          this[(this.isFull() ? "add" : "remove") + "Class"](this.instance.endpointFullClass);
        }

        if (!doNotCleanup && this.deleteOnEmpty && this.connections.length === 0) {
          this.instance.deleteObject({
            endpoint: this,
            fireEvent: false,
            deleteAttachedObjects: doNotCleanup !== true
          });
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
      key: "getAttachedElements",
      value: function getAttachedElements() {
        return this.connections;
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
          this._jsPlumb.maxConnections = t.maxConnections;
        }

        if (t.scope) {
          this.scope = t.scope;
        }

        extend(t, typeParameters);
        this.endpoint.applyType(t);
      }
    }, {
      key: "isEnabled",
      value: function isEnabled() {
        return this._jsPlumb.enabled;
      }
    }, {
      key: "setEnabled",
      value: function setEnabled(e) {
        this._jsPlumb.enabled = e;
      }
    }, {
      key: "cleanup",
      value: function cleanup(force) {
        _get(_getPrototypeOf(Endpoint.prototype), "cleanup", this).call(this, force);

        var anchorClass = this.instance.endpointAnchorClassPrefix + (this._jsPlumb.currentAnchorClass ? "-" + this._jsPlumb.currentAnchorClass : "");
        this.instance.removeClass(this.element, anchorClass);
        this.anchor = null;
        this.endpoint.cleanup(true);
        this.endpoint.destroy();
        this.endpoint = null;
      }
    }, {
      key: "setHover",
      value: function setHover(hover, ignoreAttachedElements, timestamp) {
        _get(_getPrototypeOf(Endpoint.prototype), "setHover", this).call(this, hover, ignoreAttachedElements);

        if (this.endpoint && this._jsPlumb && !this.instance.isConnectionBeingDragged) {
          this.endpoint.setHover(hover);
        }
      }
    }, {
      key: "isFull",
      value: function isFull() {
        return this._jsPlumb.maxConnections === 0 ? true : !(this.isFloating() || this._jsPlumb.maxConnections < 0 || this.connections.length < this._jsPlumb.maxConnections);
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
      key: "getConnectionCost",
      value: function getConnectionCost() {
        return this._jsPlumb.connectionCost;
      }
    }, {
      key: "setConnectionCost",
      value: function setConnectionCost(c) {
        this._jsPlumb.connectionCost = c;
      }
    }, {
      key: "areConnectionsDirected",
      value: function areConnectionsDirected() {
        return this._jsPlumb.connectionsDirected;
      }
    }, {
      key: "setConnectionsDirected",
      value: function setConnectionsDirected(b) {
        this._jsPlumb.connectionsDirected = b;
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
        return this._jsPlumb.uuid;
      }
    }, {
      key: "computeAnchor",
      value: function computeAnchor(params) {
        return this.anchor.compute(params);
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
        this.instance.anchorManager.rehomeEndpoint(this, curId, this.element); //this.instance.dragManager.endpointAdded(this.element);

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
          //    window.jtime("endpoint paint");
          var info = this.instance.updateOffset({
            elId: this.elementId,
            timestamp: timestamp
          });
          var xy = params.offset ? params.offset.o : info.o;

          if (xy != null) {
            var ap = params.anchorLoc,
                connectorPaintStyle = params.connectorPaintStyle;

            if (ap == null) {
              var wh = params.dimensions || info.s,
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
                    oInfo = this.instance.getCachedData(oId),
                    oOffset = oInfo.o,
                    oWH = oInfo.s;
                anchorParams.index = oIdx === 0 ? 1 : 0;
                anchorParams.connection = c;
                anchorParams.txy = [oOffset.left, oOffset.top];
                anchorParams.twh = oWH;
                anchorParams.tElement = c.endpoints[oIdx];
              } else if (this.connections.length > 0) {
                anchorParams.connection = this.connections[0];
              }

              ap = this.anchor.compute(anchorParams);
            }

            this.endpoint.compute(ap, this.anchor.getOrientation(this), this._jsPlumb.paintStyleInUse);
            this.endpoint.paint(this._jsPlumb.paintStyleInUse);
            this.timestamp = timestamp; // paint overlays

            for (var i in this._jsPlumb.overlays) {
              if (this._jsPlumb.overlays.hasOwnProperty(i)) ;
            }
          } //window.jtimeEnd("endpoint paint");

        }
      }
    }, {
      key: "prepareEndpoint",
      value: function prepareEndpoint(ep, typeId) {
        var _this4 = this;

        var endpointArgs = {
          _jsPlumb: this._jsPlumb.instance,
          cssClass: this._jsPlumb.cssClass,
          // container: params.container,
          // tooltip: params.tooltip,
          // connectorTooltip: params.connectorTooltip,
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
        //var argsForClone = jsPlumb.extend({}, endpointArgs);


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
          this.endpoint.cleanup();
          this.endpoint.destroy();
        }

        this.endpoint = ep; //this.type = this.endpoint.type;
        //this.canvas = this.endpoint.canvas;
        // let scopes = this.scope.split(/\s/);
        // for (let i = 0; i < scopes.length; i++) {
        //     this.instance.setAttribute(this.canvas, "jtk-scope-" + scopes[i], "true");
        // }
      }
    }, {
      key: "addClass",
      value: function addClass(clazz, dontUpdateOverlays) {
        _get(_getPrototypeOf(Endpoint.prototype), "addClass", this).call(this, clazz, dontUpdateOverlays);

        this.endpoint.addClass(clazz);
      }
    }, {
      key: "removeClass",
      value: function removeClass(clazz, dontUpdateOverlays) {
        _get(_getPrototypeOf(Endpoint.prototype), "removeClass", this).call(this, clazz, dontUpdateOverlays);

        this.endpoint.removeClass(clazz);
      }
    }, {
      key: "moveParent",
      value: function moveParent(newParent) {
        this.endpoint.renderer.moveParent(newParent);

        _get(_getPrototypeOf(Endpoint.prototype), "moveParent", this).call(this, newParent);
      }
    }]);

    return Endpoint;
  }(OverlayCapableComponent);

  function placeAnchorsOnLine(desc, elementDimensions, elementPosition, connections, horizontal, otherMultiplier, reverse) {
    var a = [],
        step = elementDimensions[horizontal ? 0 : 1] / (connections.length + 1);

    for (var i = 0; i < connections.length; i++) {
      var val = (i + 1) * step,
          other = otherMultiplier * elementDimensions[horizontal ? 1 : 0];

      if (reverse) {
        val = elementDimensions[horizontal ? 0 : 1] - val;
      }

      var dx = horizontal ? val : other,
          x = elementPosition[0] + dx,
          xp = dx / elementDimensions[0],
          dy = horizontal ? other : val,
          y = elementPosition[1] + dy,
          yp = dy / elementDimensions[1];
      a.push([x, y, xp, yp, connections[i][1], connections[i][2]]);
    }

    return a;
  } // used by edgeSortFunctions


  function currySort(reverseAngles) {
    return function (a, b) {
      var r = true;

      if (reverseAngles) {
        r = a[0][0] < b[0][0];
      } else {
        r = a[0][0] > b[0][0];
      }

      return r === false ? -1 : 1;
    };
  } // used by edgeSortFunctions


  function leftSort(a, b) {
    // first get adjusted values
    var p1 = a[0][0] < 0 ? -Math.PI - a[0][0] : Math.PI - a[0][0],
        p2 = b[0][0] < 0 ? -Math.PI - b[0][0] : Math.PI - b[0][0];

    if (p1 > p2) {
      return 1;
    } else {
      return -1;
    }
  } // used by placeAnchors


  var edgeSortFunctions = {
    "top": function top(a, b) {
      return a[0] > b[0] ? 1 : -1;
    },
    "right": currySort(true),
    "bottom": currySort(true),
    "left": leftSort
  };
  var ContinuousAnchorFactory =
  /*#__PURE__*/
  function () {
    function ContinuousAnchorFactory(manager) {
      _classCallCheck(this, ContinuousAnchorFactory);

      this.manager = manager;

      _defineProperty(this, "continuousAnchorLocations", {});
    }

    _createClass(ContinuousAnchorFactory, [{
      key: "clear",
      value: function clear(endpointId) {
        delete this.continuousAnchorLocations[endpointId];
      }
    }, {
      key: "set",
      value: function set(endpointId, pos) {
        this.continuousAnchorLocations[endpointId] = pos;
      }
    }, {
      key: "get",
      value: function get(instance, params) {
        return new ContinuousAnchor(instance, params);
      }
    }]);

    return ContinuousAnchorFactory;
  }();
  var AnchorManager =
  /*#__PURE__*/
  function () {
    function AnchorManager(instance, params) {
      _classCallCheck(this, AnchorManager);

      this.instance = instance;

      _defineProperty(this, "_amEndpoints", {});

      _defineProperty(this, "continuousAnchorLocations", {});

      _defineProperty(this, "continuousAnchorOrientations", {});

      _defineProperty(this, "connectionsByElementId", {});

      _defineProperty(this, "anchorLists", {});

      _defineProperty(this, "floatingConnections", {});

      _defineProperty(this, "continuousAnchorFactory", void 0);

      this.continuousAnchorFactory = new ContinuousAnchorFactory(this);
    }

    _createClass(AnchorManager, [{
      key: "reset",
      value: function reset() {
        this._amEndpoints = {};
        this.connectionsByElementId = {};
        this.anchorLists = {};
      }
    }, {
      key: "placeAnchors",
      value: function placeAnchors(instance, elementId, _anchorLists) {
        var _this = this;

        var cd = instance.getCachedData(elementId),
            sS = cd.s,
            sO = cd.o,
            placeSomeAnchors = function placeSomeAnchors(desc, elementDimensions, elementPosition, unsortedConnections, isHorizontal, otherMultiplier, orientation) {
          if (unsortedConnections.length > 0) {
            var sc = sortHelper(unsortedConnections, edgeSortFunctions[desc]),
                // puts them in order based on the target element's pos on screen
            reverse = desc === "right" || desc === "top",
                anchors = placeAnchorsOnLine(desc, elementDimensions, elementPosition, sc, isHorizontal, otherMultiplier, reverse); // takes a computed anchor position and adjusts it for parent offset and scroll, then stores it.

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

        placeSomeAnchors("bottom", sS, [sO.left, sO.top], _anchorLists.bottom, true, 1, [0, 1]);
        placeSomeAnchors("top", sS, [sO.left, sO.top], _anchorLists.top, true, 0, [0, -1]);
        placeSomeAnchors("left", sS, [sO.left, sO.top], _anchorLists.left, false, 0, [-1, 0]);
        placeSomeAnchors("right", sS, [sO.left, sO.top], _anchorLists.right, false, 1, [1, 0]);
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
            registerConnection = function registerConnection(otherIndex, otherEndpoint, otherAnchor, elId, c) {
          if (sourceId === targetId && otherAnchor.isContinuous) {
            // remove the target endpoint's canvas.  we dont need it.
            _this2.instance.removeElement(ep[1].endpoint.renderer.getElement());

            doRegisterTarget = false;
          }

          addToList(_this2.connectionsByElementId, elId, [c, otherEndpoint, otherAnchor instanceof DynamicAnchor]);
        };

        registerConnection(0, ep[0], ep[0].anchor, targetId, conn);

        if (doRegisterTarget) {
          registerConnection(1, ep[1], ep[1].anchor, sourceId, conn);
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
      value: function connectionDetached(connInfo, doNotRedraw) {
        var _this3 = this;

        var connection = connInfo.connection || connInfo,
            sourceId = connInfo.sourceId,
            targetId = connInfo.targetId,
            ep = connection.endpoints,
            removeConnection = function removeConnection(otherIndex, otherEndpoint, otherAnchor, elId, c) {
          removeWithFunction(_this3.connectionsByElementId[elId], function (_c) {
            return _c[0].id === c.id;
          });
        };

        removeConnection(1, ep[1], ep[1].anchor, sourceId, connection);
        removeConnection(0, ep[0], ep[0].anchor, targetId, connection);

        if (connection.floatingId) {
          removeConnection(connection.floatingIndex, connection.floatingEndpoint, connection.floatingEndpoint.anchor, connection.floatingId, connection);
          this.removeEndpointFromAnchorLists(connection.floatingEndpoint);
        } // remove from anchorLists


        this.removeEndpointFromAnchorLists(connection.endpoints[0]);
        this.removeEndpointFromAnchorLists(connection.endpoints[1]);

        if (!doNotRedraw) {
          this.redraw(connection.sourceId);

          if (connection.targetId !== connection.sourceId) {
            this.redraw(connection.targetId);
          }
        }
      }
    }, {
      key: "add",
      value: function add(endpoint, elementId) {
        addToList(this._amEndpoints, elementId, endpoint);
      }
    }, {
      key: "changeId",
      value: function changeId(oldId, newId) {
        this.connectionsByElementId[newId] = this.connectionsByElementId[oldId];
        this._amEndpoints[newId] = this._amEndpoints[oldId];
        delete this.connectionsByElementId[oldId];
        delete this._amEndpoints[oldId];
      }
    }, {
      key: "getConnectionsFor",
      value: function getConnectionsFor(elementId) {
        return this.connectionsByElementId[elementId] || [];
      }
    }, {
      key: "getEndpointsFor",
      value: function getEndpointsFor(elementId) {
        return this._amEndpoints[elementId] || [];
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
      }
    }, {
      key: "_updateAnchorList",
      // updates the given anchor list by either updating an existing anchor's info, or adding it. this function
      // also removes the anchor from its previous list, if the edge it is on has changed.
      // all connections found along the way (those that are connected to one of the faces this function
      // operates on) are added to the connsToPaint list, as are their endpoints. in this way we know to repaint
      // them wthout having to calculate anything else about them.
      value: function _updateAnchorList(lists, theta, order, conn, aBoolean, otherElId, idx, reverse, edgeId, elId, connsToPaint, endpointsToPaint) {
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

            for (var _i = 0; _i < listToRemoveFrom.length; _i++) {
              candidate = listToRemoveFrom[_i][1]; // jsPlumbUtil.addWithFunction(connsToPaint, candidate, function (c) {
              //     return c.id === candidate.id;
              // });
              //connsToPaint.add(candidate);

              this.hashAdd(connsToPaint, candidate);
              addWithFunction(endpointsToPaint, listToRemoveFrom[_i][1].endpoints[idx], function (e) {
                return e.id === candidate.endpoints[idx].id;
              });
              addWithFunction(endpointsToPaint, listToRemoveFrom[_i][1].endpoints[oIdx], function (e) {
                return e.id === candidate.endpoints[oIdx].id;
              });
            }
          }
        }

        for (var _i2 = 0; _i2 < listToAddTo.length; _i2++) {
          candidate = listToAddTo[_i2][1];
          this.hashAdd(connsToPaint, candidate);
          addWithFunction(endpointsToPaint, listToAddTo[_i2][1].endpoints[idx], function (e) {
            return e.id === candidate.endpoints[idx].id;
          });
          addWithFunction(endpointsToPaint, listToAddTo[_i2][1].endpoints[oIdx], function (e) {
            return e.id === candidate.endpoints[oIdx].id;
          });
        }

        {
          var insertIdx = reverse ?  0 : listToAddTo.length; // of course we will get this from having looked through the array shortly.

          listToAddTo.splice(insertIdx, 0, values);
        } // store this for next time.


        endpoint._continuousAnchorEdge = edgeId;
      }
    }, {
      key: "updateOtherEndpoint",
      //
      // find the entry in an endpoint's list for this connection and update its target endpoint
      // with the current target in the connection.
      // This method and sourceChanged need to be folder into one.
      //
      value: function updateOtherEndpoint(sourceElId, oldTargetId, newTargetId, connection) {
        var sIndex = findWithFunction(this.connectionsByElementId[sourceElId], function (i) {
          return i[0].id === connection.id;
        }),
            tIndex = findWithFunction(this.connectionsByElementId[oldTargetId], function (i) {
          return i[0].id === connection.id;
        }); // update or add data for source

        if (sIndex !== -1) {
          this.connectionsByElementId[sourceElId][sIndex][0] = connection;
          this.connectionsByElementId[sourceElId][sIndex][1] = connection.endpoints[1];
          this.connectionsByElementId[sourceElId][sIndex][2] = connection.endpoints[1].anchor instanceof DynamicAnchor;
        } // remove entry for previous target (if there)


        if (tIndex > -1) {
          this.connectionsByElementId[oldTargetId].splice(tIndex, 1); // add entry for new target

          addToList(this.connectionsByElementId, newTargetId, [connection, connection.endpoints[0], connection.endpoints[0].anchor instanceof DynamicAnchor]);
        }

        connection.updateConnectedClass();
      }
    }, {
      key: "sourceChanged",
      //
      // notification that the connection given has changed source from the originalId to the newId.
      // This involves:
      // 1. removing the connection from the list of connections stored for the originalId
      // 2. updating the source information for the target of the connection
      // 3. re-registering the connection in connectionsByElementId with the newId
      //
      value: function sourceChanged(originalId, newId, connection, newElement) {
        if (originalId !== newId) {
          connection.sourceId = newId;
          connection.source = newElement; // remove the entry that points from the old source to the target

          removeWithFunction(this.connectionsByElementId[originalId], function (info) {
            return info[0].id === connection.id;
          }); // find entry for target and update it

          var tIdx = findWithFunction(this.connectionsByElementId[connection.targetId], function (i) {
            return i[0].id === connection.id;
          });

          if (tIdx > -1) {
            this.connectionsByElementId[connection.targetId][tIdx][0] = connection;
            this.connectionsByElementId[connection.targetId][tIdx][1] = connection.endpoints[0];
            this.connectionsByElementId[connection.targetId][tIdx][2] = connection.endpoints[0].anchor instanceof DynamicAnchor;
          } // add entry for new source


          addToList(this.connectionsByElementId, newId, [connection, connection.endpoints[1], connection.endpoints[1].anchor instanceof DynamicAnchor]); // TODO SP not final on this yet. when a user drags an existing connection and it turns into a self
          // loop, then this code hides the target endpoint (by removing it from the DOM) But I think this should
          // occur only if the anchor is Continuous
          // TODO 4.x - anchor manager should not be meddling with the render here. need some other means of doing this.
          // it doesnt even need to be done in a headless environment, only in the DOM.
          // if (connection.endpoints[1].anchor.isContinuous) {
          //     if (connection.source === connection.target) {
          //         this.instance.removeElement(connection.endpoints[1].canvas);
          //     }
          //     else {
          //         if (connection.endpoints[1].canvas.parentNode == null) {
          //             this.instance.appendElement(connection.endpoints[1].canvas);
          //         }
          //     }
          // }

          connection.updateConnectedClass();
        }
      }
    }, {
      key: "rehomeEndpoint",
      //
      // moves the given endpoint from `currentId` to `element`.
      // This involves:
      //
      // 1. changing the key in _amEndpoints under which the endpoint is stored
      // 2. changing the source or target values in all of the endpoint's connections
      // 3. changing the array in connectionsByElementId in which the endpoint's connections
      //    are stored (done by either sourceChanged or updateOtherEndpoint)
      //
      value: function rehomeEndpoint(ep, currentId, element) {
        var eps = this._amEndpoints[currentId] || [],
            elementId = this.instance.getId(element);

        if (elementId !== currentId) {
          var idx = eps.indexOf(ep);

          if (idx > -1) {
            var _ep = eps.splice(idx, 1)[0];
            this.add(_ep, elementId);
          }
        }

        for (var i = 0; i < ep.connections.length; i++) {
          if (ep.connections[i].sourceId === currentId) {
            this.sourceChanged(currentId, ep.elementId, ep.connections[i], ep.element);
          } else if (ep.connections[i].targetId === currentId) {
            ep.connections[i].targetId = ep.elementId;
            ep.connections[i].target = ep.element;
            this.updateOtherEndpoint(ep.connections[i].sourceId, currentId, ep.elementId, ep.connections[i]);
          }
        }
      }
    }, {
      key: "hashAdd",
      value: function hashAdd(list, item) {
        if (findWithFunction(list, function (o) {
          return o.id === item.id;
        }) === -1) {
          list.push(item);
        }
      }
    }, {
      key: "directAdd",
      value: function directAdd(list, item) {
        if (findWithFunction(list, function (o) {
          return o === item;
        }) === -1) {
          list.push(item);
        }
      }
    }, {
      key: "redraw",
      value: function redraw(elementId, ui, timestamp, offsetToUI, doNotRecalcEndpoint) {
        if (!this.instance.isSuspendDrawing()) {
          var connectionsToPaint = [],
              endpointsToPaint = [],
              anchorsToUpdate = []; //window.jtime("anchor redraw");
          // get all the endpoints for this element

          var ep = this._amEndpoints[elementId] || [],
              endpointConnections = this.connectionsByElementId[elementId] || [];
          anchorsToUpdate.length = 0;
          connectionsToPaint.length = 0;
          endpointsToPaint.length = 0;
          timestamp = timestamp || _timestamp(); // offsetToUI are values that would have been calculated in the dragManager when registering
          // an endpoint for an element that had a parent (somewhere in the hierarchy) that had been
          // registered as draggable.

          offsetToUI = offsetToUI || {
            left: 0,
            top: 0
          };

          if (ui) {
            ui = {
              left: ui.left + offsetToUI.left,
              top: ui.top + offsetToUI.top
            };
          } // valid for one paint cycle.


          var myOffset = this.instance.updateOffset({
            elId: elementId,
            offset: ui,
            recalc: false,
            timestamp: timestamp
          }),
              orientationCache = {}; // actually, first we should compute the orientation of this element to all other elements to which
          // this element is connected with a continuous anchor (whether both ends of the connection have
          // a continuous anchor or just one)

          for (var i = 0; i < endpointConnections.length; i++) {
            var conn = endpointConnections[i][0],
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
                this._updateAnchorList(this.anchorLists[sourceId], -Math.PI / 2, 0, conn, false, targetId, 0, false, "top", sourceId, connectionsToPaint, endpointsToPaint);

                this._updateAnchorList(this.anchorLists[targetId], -Math.PI / 2, 0, conn, false, sourceId, 1, false, "top", targetId, connectionsToPaint, endpointsToPaint);
              } else {
                if (!o) {
                  o = this.calculateOrientation(sourceId, targetId, sd.o, td.o, conn.endpoints[0].anchor, conn.endpoints[1].anchor, conn);
                  orientationCache[oKey] = o; // this would be a performance enhancement, but the computed angles need to be clamped to
                  //the (-PI/2 -> PI/2) range in order for the sorting to work properly.

                  /*  orientationCache[oKey2] = {
                   orientation:o.orientation,
                   a:[o.a[1], o.a[0]],
                   theta:o.theta + Math.PI,
                   theta2:o.theta2 + Math.PI
                   };*/
                }

                if (sourceContinuous) {
                  this._updateAnchorList(this.anchorLists[sourceId], o.theta, 0, conn, false, targetId, 0, false, o.a[0], sourceId, connectionsToPaint, endpointsToPaint);
                }

                if (targetContinuous) {
                  this._updateAnchorList(this.anchorLists[targetId], o.theta2, -1, conn, true, sourceId, 1, true, o.a[1], targetId, connectionsToPaint, endpointsToPaint);
                }
              }

              if (sourceContinuous) {
                this.directAdd(anchorsToUpdate, sourceId);
              }

              if (targetContinuous) {
                this.directAdd(anchorsToUpdate, targetId);
              }

              this.hashAdd(connectionsToPaint, conn);

              if (sourceContinuous && oIdx === 0 || targetContinuous && oIdx === 1) {
                this.hashAdd(endpointsToPaint, conn.endpoints[oIdx]);
              }
            }
          } // place Endpoints whose anchors are continuous but have no Connections


          for (var _i3 = 0; _i3 < ep.length; _i3++) {
            if (ep[_i3].connections.length === 0 && ep[_i3].anchor.isContinuous) {
              if (!this.anchorLists[elementId]) {
                this.anchorLists[elementId] = {
                  top: [],
                  right: [],
                  bottom: [],
                  left: []
                };
              }

              this._updateAnchorList(this.anchorLists[elementId], -Math.PI / 2, 0, {
                endpoints: [ep[_i3], ep[_i3]],
                paint: function paint() {}
              }, false, elementId, 0, false, ep[_i3].anchor.getDefaultFace(), elementId, connectionsToPaint, endpointsToPaint); // jsPlumbUtil.addWithFunction(anchorsToUpdate, elementId, function (a) {
              //     return a === elementId;
              // });


              this.directAdd(anchorsToUpdate, elementId);
            }
          } // now place all the continuous anchors we need to;


          for (var _i4 = 0; _i4 < anchorsToUpdate.length; _i4++) {
            this.placeAnchors(this.instance, anchorsToUpdate[_i4], this.anchorLists[anchorsToUpdate[_i4]]);
          } // now that continuous anchors have been placed, paint all the endpoints for this element


          for (var _i5 = 0; _i5 < ep.length; _i5++) {
            ep[_i5].paint({
              timestamp: timestamp,
              offset: myOffset,
              dimensions: myOffset.s,
              recalc: doNotRecalcEndpoint !== true
            });
          } // ... and any other endpoints we came across as a result of the continuous anchors.


          for (var _i6 = 0; _i6 < endpointsToPaint.length; _i6++) {
            var cd = this.instance.getCachedData(endpointsToPaint[_i6].elementId);

            endpointsToPaint[_i6].paint({
              timestamp: timestamp,
              offset: cd,
              dimensions: cd.s
            }); //endpointsToPaint[i].paint({ timestamp: null, offset: cd, dimensions: cd.s });

          } // paint all the standard and "dynamic connections", which are connections whose other anchor is
          // static and therefore does need to be recomputed; we make sure that happens only one time.
          // TODO we could have compiled a list of these in the first pass through connections; might save some time.


          for (var _i7 = 0; _i7 < endpointConnections.length; _i7++) {
            var otherEndpoint = endpointConnections[_i7][1];

            if (otherEndpoint.anchor.constructor === DynamicAnchor) {
              otherEndpoint.paint({
                elementWithPrecedence: elementId,
                timestamp: timestamp
              });
              this.hashAdd(connectionsToPaint, endpointConnections[_i7][0]); // all the connections for the other endpoint now need to be repainted

              for (var k = 0; k < otherEndpoint.connections.length; k++) {
                if (otherEndpoint.connections[k] !== endpointConnections[_i7][0]) {
                  this.hashAdd(connectionsToPaint, otherEndpoint.connections[k]);
                }
              }
            } else {
              this.hashAdd(connectionsToPaint, endpointConnections[_i7][0]);
            }
          } // paint current floating connection for this element, if there is one.


          var fc = this.floatingConnections[elementId];

          if (fc) {
            fc.paint({
              timestamp: timestamp,
              recalc: false,
              elId: elementId
            });
          } // paint all the connections
          //console.log("there are " + connectionsToPaint.length  + " connections to paint");


          for (var _i8 = 0; _i8 < connectionsToPaint.length; _i8++) {
            //connectionsToPaint[i].paint({elId: elementId, timestamp: null, recalc: false, clearEdits: clearEdits});
            //window.jtime("conn paint " + connectionsToPaint[i].id);
            connectionsToPaint[_i8].paint({
              elId: elementId,
              timestamp: timestamp,
              recalc: false
            }); //window.jtimeEnd("conn paint " + connectionsToPaint[i].id);

          } //window.jtimeEnd("anchor redraw");

        }
      }
    }, {
      key: "calculateOrientation",
      value: function calculateOrientation(sourceId, targetId, sd, td, sourceAnchor, targetAnchor, connection) {
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

        var theta = Math.atan2(td.centery - sd.centery, td.centerx - sd.centerx),
            theta2 = Math.atan2(sd.centery - td.centery, sd.centerx - td.centerx); // --------------------------------------------------------------------------------------
        // improved face calculation. get midpoints of each face for source and target, then put in an array with all combinations of
        // source/target faces. sort this array by distance between midpoints. the entry at index 0 is our preferred option. we can
        // go through the array one by one until we find an entry in which each requested face is supported.

        var candidates = [],
            midpoints = {};

        (function (types, dim) {
          for (var i = 0; i < types.length; i++) {
            midpoints[types[i]] = {
              "left": [dim[i].left, dim[i].centery],
              "right": [dim[i].right, dim[i].centery],
              "top": [dim[i].centerx, dim[i].top],
              "bottom": [dim[i].centerx, dim[i].bottom]
            };
          }
        })(["source", "target"], [sd, td]);

        var FACES = ["top", "right", "left", "bottom"];

        for (var sf = 0; sf < FACES.length; sf++) {
          for (var tf = 0; tf < FACES.length; tf++) {
            candidates.push({
              source: FACES[sf],
              target: FACES[tf],
              dist: Biltong.lineLength(midpoints.source[FACES[sf]], midpoints.target[FACES[tf]])
            });
          }
        }

        candidates.sort(function (a, b) {
          return a.dist < b.dist ? -1 : a.dist > b.dist ? 1 : 0;
        }); // now go through this list and try to get an entry that satisfies both (there will be one, unless one of the anchors
        // declares no available faces)

        var sourceEdge = candidates[0].source,
            targetEdge = candidates[0].target;

        for (var i = 0; i < candidates.length; i++) {
          if (!sourceAnchor.isContinuous || sourceAnchor.isEdgeSupported(candidates[i].source)) {
            sourceEdge = candidates[i].source;
          } else {
            sourceEdge = null;
          }

          if (!targetAnchor.isContinuous || targetAnchor.isEdgeSupported(candidates[i].target)) {
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
      } // continuous anchors
      // jsPlumbInstance.continuousAnchorFactory = {
      //     get: function (params) {
      //         return new ContinuousAnchor(params);
      //     },
      //     clear: function (elementId) {
      //         delete continuousAnchorLocations[elementId];
      //     }
      // };

    }]);

    return AnchorManager;
  }();

  function cls(className) {
    return "." + className;
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
  var IS_GROUP_KEY = "_isJsPlumbGroup";
  var ATTRIBUTE_MANAGED = "jtk-managed";
  var ATTRIBUTE_GROUP = "jtk-group";
  var ATTRIBUTE_SOURCE = "jtk-source";
  var ATTRIBUTE_TARGET = "jtk-target";
  var ATTRIBUTE_CONTAINER = "jtk-container";
  var ATTRIBUTE_NOT_DRAGGABLE = "jtk-not-draggable";
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
  var EVENT_ENDPOINT_CLICK = "endpointClick";
  var EVENT_ENDPOINT_DBL_CLICK = "endpointDblClick";
  var EVENT_CHILD_ADDED = "group:addMember";
  var EVENT_CHILD_REMOVED = "group:removeMember";
  var EVENT_GROUP_ADDED = "group:add";
  var EVENT_GROUP_REMOVED = "group:remove";
  var EVENT_EXPAND = "group:expand";
  var EVENT_COLLAPSE = "group:collapse";
  var EVENT_GROUP_DRAG_STOP = "groupDragStop";
  var EVENT_MAX_CONNECTIONS = "maxConnections";
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

  var Group =
  /*#__PURE__*/
  function () {
    function Group(instance, el, options) {
      _classCallCheck(this, Group);

      this.instance = instance;

      _defineProperty(this, "children", []);

      _defineProperty(this, "el", void 0);

      _defineProperty(this, "collapsed", false);

      _defineProperty(this, "droppable", void 0);

      _defineProperty(this, "enabled", void 0);

      _defineProperty(this, "orphan", void 0);

      _defineProperty(this, "constrain", void 0);

      _defineProperty(this, "proxied", void 0);

      _defineProperty(this, "ghost", void 0);

      _defineProperty(this, "revert", void 0);

      _defineProperty(this, "prune", void 0);

      _defineProperty(this, "dropOverride", void 0);

      _defineProperty(this, "anchor", void 0);

      _defineProperty(this, "endpoint", void 0);

      _defineProperty(this, "connections", {
        source: [],
        target: [],
        internal: []
      });

      _defineProperty(this, "groups", []);

      _defineProperty(this, "manager", void 0);

      _defineProperty(this, "id", void 0);

      this.el = el;
      this.el[IS_GROUP_KEY] = true;
      this.el[GROUP_KEY] = this;
      this.revert = options.revert !== false;
      this.droppable = options.droppable !== false;
      this.ghost = options.ghost === true;
      this.enabled = options.enabled !== false;
      this.orphan = options.orphan === true;
      this.prune = options.prune === true;
      this.constrain = this.ghost || options.constrain === true;
      this.proxied = options.proxied !== false;
      this.id = options.id || uuid();
      this.dropOverride = options.dropOverride === true;
      this.anchor = options.anchor;
      this.endpoint = options.endpoint;
      this.anchor = options.anchor;
      instance.setAttribute(el, ATTRIBUTE_GROUP, "");
    }

    _createClass(Group, [{
      key: "overrideDrop",
      value: function overrideDrop(el, targetGroup) {
        return this.dropOverride && (this.revert || this.prune || this.orphan);
      }
    }, {
      key: "getDragArea",
      value: function getDragArea() {
        var da = this.instance.getSelector(this.el, SELECTOR_GROUP_CONTAINER);
        return da && da.length > 0 ? da[0] : this.el;
      }
    }, {
      key: "getAnchor",
      // this function, and getEndpoint below, are stubs for a future setup in which we can choose endpoint
      // and anchor based upon the connection and the index (source/target) of the endpoint to be proxied.
      value: function getAnchor(conn, endpointIndex) {
        return this.anchor || "Continuous";
      }
    }, {
      key: "getEndpoint",
      value: function getEndpoint(conn, endpointIndex) {
        return this.endpoint || ["Dot", {
          radius: 10
        }];
      }
    }, {
      key: "add",
      value: function add(_el, doNotFireEvent) {
        var _this = this;

        var dragArea = this.getDragArea();
        this.instance.each(_el, function (__el) {
          if (__el[GROUP_KEY] != null) {
            if (__el[GROUP_KEY] === _this) {
              return;
            } else {
              __el[GROUP_KEY].remove(__el, true, doNotFireEvent, false);
            }
          }

          __el[GROUP_KEY] = _this;

          _this.children.push(__el);

          _this.manager.instance.appendElement(__el, dragArea); // if (!doNotFireEvent) {
          //     var p = {group: self, el: __el};
          //     if (sourceGroup) {
          //         p.sourceGroup = sourceGroup;
          //     }
          //     //_jsPlumb.fire(EVT_CHILD_ADDED, p);
          // }

        });

        this.manager._updateConnectionsForGroup(this);
      }
    }, {
      key: "remove",
      value: function remove(el, manipulateDOM, doNotFireEvent, doNotUpdateConnections, targetGroup) {
        var _this2 = this;

        this.instance.each(el, function (__el) {
          delete __el[GROUP_KEY];
          removeWithFunction(_this2.children, function (e) {
            return e === __el;
          });

          if (manipulateDOM) {
            try {
              _this2.getDragArea().removeChild(__el);
            } catch (e) {
              log("Could not remove element from Group " + e);
            }
          }

          if (!doNotFireEvent) {
            var p = {
              group: _this2,
              el: __el
            };

            if (targetGroup) {
              p.targetGroup = targetGroup;
            }

            _this2.manager.instance.fire(EVENT_CHILD_REMOVED, p);
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
          var el = this.children[0];
          this.remove(el, manipulateDOM, doNotFireEvent, true);
          this.manager.instance.remove(el, true);
        }

        this.children.length = 0;

        this.manager._updateConnectionsForGroup(this);
      }
    }, {
      key: "_orphan",
      value: function _orphan(_el) {
        var id = this.manager.instance.getId(_el);
        var pos = this.manager.instance.getOffset(_el);

        _el.parentNode.removeChild(_el);

        this.instance.appendElement(_el); // set back as child of container

        this.instance.setPosition(_el, pos);
        delete _el[GROUP_KEY];
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
        return orphanedPositions;
      }
    }]);

    return Group;
  }();

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
        if (p.source[GROUP_KEY] != null && p.target[GROUP_KEY] != null && p.source[GROUP_KEY] === p.target[GROUP_KEY]) {
          _this._connectionSourceMap[p.connection.id] = p.source[GROUP_KEY];
          _this._connectionTargetMap[p.connection.id] = p.source[GROUP_KEY];
        } else {
          if (p.source[GROUP_KEY] != null) {
            suggest(p.source[GROUP_KEY].connections.source, p.connection);
            _this._connectionSourceMap[p.connection.id] = p.source[GROUP_KEY];
          }

          if (p.target[GROUP_KEY] != null) {
            suggest(p.target[GROUP_KEY].connections.target, p.connection);
            _this._connectionTargetMap[p.connection.id] = p.target[GROUP_KEY];
          }
        }
      });
      instance.bind(EVENT_INTERNAL_CONNECTION_DETACHED, function (p) {
        _this._cleanupDetachedConnection(p.connection);
      });
      instance.bind(EVENT_CONNECTION_MOVED, function (p) {
        var connMap = p.index === 0 ? _this._connectionSourceMap : _this._connectionTargetMap;
        var group = connMap[p.connection.id];

        if (group) {
          var list = group.connections[p.index === 0 ? SOURCE : TARGET];
          var idx = list.indexOf(p.connection);

          if (idx !== -1) {
            list.splice(idx, 1);
          }
        }
      });
    }

    _createClass(GroupManager, [{
      key: "_cleanupDetachedConnection",
      value: function _cleanupDetachedConnection(conn) {
        delete conn.proxies;
        var group = this._connectionSourceMap[conn.id],
            f;

        if (group != null) {
          f = function f(c) {
            return c.id === conn.id;
          };

          removeWithFunction(group.connections.source, f);
          removeWithFunction(group.connections.target, f);
          delete this._connectionSourceMap[conn.id];
        }

        group = this._connectionTargetMap[conn.id];

        if (group != null) {
          f = function f(c) {
            return c.id === conn.id;
          };

          removeWithFunction(group.connections.source, f);
          removeWithFunction(group.connections.target, f);
          delete this._connectionTargetMap[conn.id];
        }
      }
    }, {
      key: "addGroup",
      value: function addGroup(params) {
        if (this.groupMap[params.id] != null) {
          throw new TypeError("cannot create Group [" + params.id + "]; a Group with that ID exists");
        }

        if (params.el[IS_GROUP_KEY] != null) {
          throw new TypeError("cannot create Group [" + params.id + "]; the given element is already a Group");
        }

        var group = new Group(this.instance, params.el, params);
        this.groupMap[group.id] = group;

        if (params.collapsed) {
          this.collapseGroup(group);
        }

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

        return _el != null ? _el[GROUP_KEY] : null;
      }
    }, {
      key: "removeGroup",
      value: function removeGroup(group, deleteMembers, manipulateDOM, doNotFireEvent) {
        var actualGroup = this.getGroup(group);
        this.expandGroup(actualGroup, true); // this reinstates any original connections and removes all proxies, but does not fire an event.

        var newPositions = actualGroup[deleteMembers ? CMD_REMOVE_ALL : CMD_ORPHAN_ALL](manipulateDOM, doNotFireEvent);
        this.instance.remove(actualGroup.el);
        delete this.groupMap[actualGroup.id];
        this.instance.fire(EVENT_GROUP_REMOVED, {
          group: actualGroup
        });
        return newPositions; // this will be null in the case or remove, but be a map of {id->[x,y]} in the case of orphan
      }
    }, {
      key: "removeAllGroups",
      value: function removeAllGroups(deleteMembers, manipulateDOM, doNotFireEvent) {
        for (var _g in this.groupMap) {
          this.removeGroup(this.groupMap[_g], deleteMembers, manipulateDOM, doNotFireEvent);
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
      value: function orphan(_el) {
        if (_el[GROUP_KEY]) {
          var id = this.instance.getId(_el);
          var pos = this.instance.getOffset(_el);

          _el.parentNode.removeChild(_el);

          this.instance.appendElement(_el);
          this.instance.setPosition(_el, pos);
          delete _el[GROUP_KEY];
          return [id, pos];
        }
      }
    }, {
      key: "_setGroupVisible",
      value: function _setGroupVisible(group, state) {
        var m = group.children;

        for (var i = 0; i < m.length; i++) {
          this.instance[state ? CMD_SHOW : CMD_HIDE](m[i], true);
        }
      }
    }, {
      key: "_updateConnectionsForGroup",
      value: function _updateConnectionsForGroup(group) {
        var _this2 = this;

        var members = group.children;
        var c1 = this.instance.getConnections({
          source: members,
          scope: WILDCARD
        }, true);
        var c2 = this.instance.getConnections({
          target: members,
          scope: WILDCARD
        }, true);
        var processed = {};
        group.connections.source.length = 0;
        group.connections.target.length = 0;

        var oneSet = function oneSet(c) {
          for (var i = 0; i < c.length; i++) {
            if (processed[c[i].id]) {
              continue;
            }

            processed[c[i].id] = true;

            if (c[i].source[GROUP_KEY] === group) {
              if (c[i].target[GROUP_KEY] !== group) {
                group.connections.source.push(c[i]);
              }

              _this2._connectionSourceMap[c[i].id] = group;
            } else if (c[i].target[GROUP_KEY] === group) {
              group.connections.target.push(c[i]);
              _this2._connectionTargetMap[c[i].id] = group;
            }
          }
        };

        oneSet(c1);
        oneSet(c2);
      }
    }, {
      key: "_collapseConnection",
      value: function _collapseConnection(conn, index, group) {
        var otherEl = conn.endpoints[index === 0 ? 1 : 0].element;

        if (otherEl[GROUP_KEY] && !otherEl[GROUP_KEY].proxied && otherEl[GROUP_KEY].collapsed) {
          return;
        }

        var groupEl = group.el,
            groupElId = this.instance.getId(groupEl);
        this.instance.proxyConnection(conn, index, groupEl, groupElId, function (conn, index) {
          return group.getEndpoint(conn, index);
        }, function (conn, index) {
          return group.getAnchor(conn, index);
        });
      }
    }, {
      key: "_expandConnection",
      value: function _expandConnection(c, index, group) {
        this.instance.unproxyConnection(c, index, this.instance.getId(group.el));
      }
    }, {
      key: "collapseGroup",
      value: function collapseGroup(group) {
        var _this3 = this;

        var actualGroup = this.getGroup(group);

        if (actualGroup == null || actualGroup.collapsed) {
          return;
        }

        var groupEl = actualGroup.el; // hide all connections

        this._setGroupVisible(actualGroup, false);

        if (actualGroup.proxied) {
          // collapses all connections in a group.
          var _collapseSet = function _collapseSet(conns, index) {
            for (var i = 0; i < conns.length; i++) {
              var c = conns[i];

              _this3._collapseConnection(c, index, actualGroup);
            }
          }; // setup proxies for sources and targets


          _collapseSet(actualGroup.connections.source, 0);

          _collapseSet(actualGroup.connections.target, 1);
        }

        actualGroup.collapsed = true;
        this.instance.removeClass(groupEl, GROUP_EXPANDED_CLASS);
        this.instance.addClass(groupEl, GROUP_COLLAPSED_CLASS);
        this.instance.revalidate(groupEl);
        this.instance.fire(EVENT_COLLAPSE, {
          group: actualGroup
        });
      }
    }, {
      key: "expandGroup",
      value: function expandGroup(group, doNotFireEvent) {
        var _this4 = this;

        var actualGroup = this.getGroup(group);

        if (actualGroup == null || !actualGroup.collapsed) {
          return;
        }

        var groupEl = actualGroup.el;

        this._setGroupVisible(actualGroup, true);

        if (actualGroup.proxied) {
          // collapses all connections in a group.
          var _expandSet = function _expandSet(conns, index) {
            for (var i = 0; i < conns.length; i++) {
              var c = conns[i];

              _this4._expandConnection(c, index, actualGroup);
            }
          }; // setup proxies for sources and targets


          _expandSet(actualGroup.connections.source, 0);

          _expandSet(actualGroup.connections.target, 1);
        }

        actualGroup.collapsed = false;
        this.instance.addClass(groupEl, GROUP_EXPANDED_CLASS);
        this.instance.removeClass(groupEl, GROUP_COLLAPSED_CLASS);
        this.instance.revalidate(groupEl);
        this.repaintGroup(actualGroup);

        if (!doNotFireEvent) {
          this.instance.fire(EVENT_EXPAND, {
            group: group
          });
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
        var _this5 = this;

        var actualGroup = this.getGroup(group);

        if (actualGroup) {
          var groupEl = actualGroup.el;

          var _one = function _one(el) {
            if (el[IS_GROUP_KEY] != null) {
              console.log("the thing being added is a group! is it possible to support nested groups");
            }

            var currentGroup = el[GROUP_KEY]; // if already a member of this group, do nothing

            if (currentGroup !== actualGroup) {
              var elpos = _this5.instance.getOffset(el, true);

              var cpos = actualGroup.collapsed ? _this5.instance.getOffset(groupEl, true) : _this5.instance.getOffset(actualGroup.getDragArea(), true); // otherwise, transfer to this group.

              if (currentGroup != null) {
                currentGroup.remove(el, false, doNotFireEvent, false, actualGroup);

                _this5._updateConnectionsForGroup(currentGroup);
              }

              actualGroup.add(el, doNotFireEvent);

              var handleDroppedConnections = function handleDroppedConnections(list, index) {
                var oidx = index === 0 ? 1 : 0;
                list.each(function (c) {
                  c.setVisible(false);

                  if (c.endpoints[oidx].element[GROUP_KEY] === actualGroup) {
                    c.endpoints[oidx].setVisible(false);

                    _this5._expandConnection(c, oidx, actualGroup);
                  } else {
                    c.endpoints[index].setVisible(false);

                    _this5._collapseConnection(c, index, actualGroup);
                  }
                });
              };

              if (actualGroup.collapsed) {
                handleDroppedConnections(_this5.instance.select({
                  source: el
                }), 0);
                handleDroppedConnections(_this5.instance.select({
                  target: el
                }), 1);
              }

              var elId = _this5.instance.getId(el);

              var newPosition = {
                left: elpos.left - cpos.left,
                top: elpos.top - cpos.top
              };

              _this5.instance.setPosition(el, newPosition);

              _this5._updateConnectionsForGroup(actualGroup);

              _this5.instance.revalidate(elId);

              if (!doNotFireEvent) {
                var p = {
                  group: actualGroup,
                  el: el,
                  pos: newPosition
                };

                if (currentGroup) {
                  p.sourceGroup = currentGroup;
                }

                _this5.instance.fire(EVENT_CHILD_ADDED, p);
              }
            }
          };

          this.instance.each(el, _one);
        }
      }
    }, {
      key: "removeFromGroup",
      value: function removeFromGroup(group, el, doNotFireEvent) {
        var actualGroup = this.getGroup(group);

        if (actualGroup) {
          actualGroup.remove(el, null, doNotFireEvent);
        }
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

  function _setOperation(list, func, args, selector) {
    for (var i = 0, j = list.length; i < j; i++) {
      list[i][func].apply(list[i], args);
    }

    return selector(list);
  }

  function _getOperation(list, func, args) {
    var out = [];

    for (var i = 0, j = list.length; i < j; i++) {
      out.push([list[i][func].apply(list[i], args), list[i]]);
    }

    return out;
  }

  function setter(list, func, selector) {
    return function () {
      return _setOperation(list, func, arguments, selector);
    };
  }

  function getter(list, func) {
    return function () {
      return _getOperation(list, func, arguments);
    };
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
          if (input.length) {
            for (var i = 0, j = input.length; i < j; i++) {
              r.push(instance._info(input[i]).id);
            }
          } else {
            r.push(instance._info(input).id);
          }
        }
      }
    }

    return r;
  }

  function filterList(list, value, missingIsFalse) {
    if (list === "*") {
      return true;
    }

    return list.length > 0 ? list.indexOf(value) !== -1 : !missingIsFalse;
  }
  /**
   * creates a timestamp, using milliseconds since 1970, but as a string.
   */


  function _timestamp() {
    return "" + new Date().getTime();
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

  function _curryEach(list, executor) {
    return function (f) {
      for (var i = 0, ii = list.length; i < ii; i++) {
        f(list[i]);
      }

      return executor(list);
    };
  }

  function _curryGet(list) {
    return function (idx) {
      return list[idx];
    };
  }
  var jsPlumbInstance =
  /*#__PURE__*/
  function (_EventGenerator) {
    _inherits(jsPlumbInstance, _EventGenerator);

    function jsPlumbInstance(_instanceIndex, renderer, defaults, helpers) {
      var _this;

      _classCallCheck(this, jsPlumbInstance);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(jsPlumbInstance).call(this));
      _this._instanceIndex = _instanceIndex;
      _this.renderer = renderer;

      _defineProperty(_assertThisInitialized(_this), "Defaults", void 0);

      _defineProperty(_assertThisInitialized(_this), "_initialDefaults", {});

      _defineProperty(_assertThisInitialized(_this), "_containerDelegations", []);

      _defineProperty(_assertThisInitialized(_this), "eventManager", void 0);

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

      _defineProperty(_assertThisInitialized(_this), "Anchors", {});

      _defineProperty(_assertThisInitialized(_this), "Connectors", {
        "svg": {}
      });

      _defineProperty(_assertThisInitialized(_this), "Endpoints", {
        "svg": {}
      });

      _defineProperty(_assertThisInitialized(_this), "Overlays", {
        "svg": {}
      });

      _defineProperty(_assertThisInitialized(_this), "ConnectorRenderers", {});

      _defineProperty(_assertThisInitialized(_this), "SVG", "svg");

      _defineProperty(_assertThisInitialized(_this), "connections", []);

      _defineProperty(_assertThisInitialized(_this), "endpointsByElement", {});

      _defineProperty(_assertThisInitialized(_this), "endpointsByUUID", {});

      _defineProperty(_assertThisInitialized(_this), "_curIdStamp", 1);

      _defineProperty(_assertThisInitialized(_this), "_offsetTimestamps", {});

      _defineProperty(_assertThisInitialized(_this), "_offsets", {});

      _defineProperty(_assertThisInitialized(_this), "_sizes", {});

      _defineProperty(_assertThisInitialized(_this), "anchorManager", void 0);

      _defineProperty(_assertThisInitialized(_this), "groupManager", void 0);

      _defineProperty(_assertThisInitialized(_this), "_connectionTypes", {});

      _defineProperty(_assertThisInitialized(_this), "_endpointTypes", {});

      _defineProperty(_assertThisInitialized(_this), "_container", void 0);

      _defineProperty(_assertThisInitialized(_this), "_managedElements", {});

      _defineProperty(_assertThisInitialized(_this), "_floatingConnections", {});

      _defineProperty(_assertThisInitialized(_this), "DEFAULT_SCOPE", void 0);

      _defineProperty(_assertThisInitialized(_this), "_helpers", void 0);

      _defineProperty(_assertThisInitialized(_this), "_zoom", 1);

      _this._helpers = helpers || {};
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
        overlays: [],
        maxConnections: 1,
        paintStyle: {
          strokeWidth: 2,
          stroke: "#456"
        },
        reattachConnections: false,
        scope: "jsPlumb_DefaultScope"
      };

      if (defaults) {
        extend(_this.Defaults, defaults);
      }

      extend(_this._initialDefaults, _this.Defaults);
      _this.DEFAULT_SCOPE = _this.Defaults.scope;
      _this.anchorManager = new AnchorManager(_assertThisInitialized(_this));
      _this.groupManager = new GroupManager(_assertThisInitialized(_this));

      _this.setContainer(_this._initialDefaults.container);

      return _this;
    }

    _createClass(jsPlumbInstance, [{
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
        this.fire("zoom", this._zoom);

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
      key: "_info",
      value: function _info(el) {
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
      key: "getId",
      value: function getId(element, uuid, doNotCreateIfNotFound) {
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

          if (!doNotCreateIfNotFound) {
            this.setAttribute(element, "id", id);
          }
        }

        return id;
      }
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
        var o = this._offsets[elId];

        if (!o) {
          return this.updateOffset({
            elId: elId
          });
        } else {
          return {
            o: o,
            s: this._sizes[elId]
          };
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
      key: "_makeCommonSelectHandler",
      value: function _makeCommonSelectHandler(list, executor) {
        var out = {
          length: list.length,
          each: _curryEach(list, executor),
          get: _curryGet(list)
        },
            setters = ["setHover", "removeAllOverlays", "setLabel", "addClass", "addOverlay", "removeOverlay", "removeOverlays", "showOverlay", "hideOverlay", "showOverlays", "hideOverlays", "setPaintStyle", "setHoverPaintStyle", "setSuspendEvents", "setParameter", "setParameters", "setVisible", "repaint", "addType", "toggleType", "removeType", "removeClass", "setType", "bind", "unbind"],
            getters = ["getLabel", "getOverlay", "isHover", "getParameter", "getParameters", "getPaintStyle", "getHoverPaintStyle", "isVisible", "hasType", "getType", "isSuspendEvents"],
            i,
            ii;

        for (i = 0, ii = setters.length; i < ii; i++) {
          out[setters[i]] = setter(list, setters[i], executor);
        }

        for (i = 0, ii = getters.length; i < ii; i++) {
          out[getters[i]] = getter(list, getters[i]);
        }

        return out;
      }
    }, {
      key: "_makeConnectionSelectHandler",
      value: function _makeConnectionSelectHandler(list) {
        var _this2 = this;

        var common = this._makeCommonSelectHandler(list, this._makeConnectionSelectHandler.bind(this));

        var connectionFunctions = {
          // setters
          setDetachable: setter(list, "setDetachable", this._makeConnectionSelectHandler.bind(this)),
          setReattach: setter(list, "setReattach", this._makeConnectionSelectHandler.bind(this)),
          setConnector: setter(list, "setConnector", this._makeConnectionSelectHandler.bind(this)),
          "delete": function _delete() {
            for (var i = 0, ii = list.length; i < ii; i++) {
              _this2.deleteConnection(list[i]);
            }
          },
          // getters
          isDetachable: getter(list, "isDetachable"),
          isReattach: getter(list, "isReattach")
        };
        return extend(common, connectionFunctions);
      }
    }, {
      key: "_makeEndpointSelectHandler",
      value: function _makeEndpointSelectHandler(list) {
        var _this3 = this;

        var common = this._makeCommonSelectHandler(list, this._makeEndpointSelectHandler.bind(this));

        var endpointFunctions = {
          setEnabled: setter(list, "setEnabled", this._makeEndpointSelectHandler.bind(this)),
          setAnchor: setter(list, "setAnchor", this._makeEndpointSelectHandler.bind(this)),
          isEnabled: getter(list, "isEnabled"),
          deleteEveryConnection: function deleteEveryConnection() {
            for (var i = 0, ii = list.length; i < ii; i++) {
              list[i].deleteEveryConnection();
            }
          },
          "delete": function _delete() {
            for (var i = 0, ii = list.length; i < ii; i++) {
              _this3.deleteEndpoint(list[i]);
            }
          }
        };
        return extend(common, endpointFunctions);
      }
    }, {
      key: "select",
      value: function select(params) {
        params = params || {};
        params.scope = params.scope || "*";
        return this._makeConnectionSelectHandler(params.connections || this.getConnections(params, true));
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

        return this._makeEndpointSelectHandler(ep);
      } //
      // TODO this knows about the DOM. refactor
      //

    }, {
      key: "setContainer",
      value: function setContainer(c) {
        // get container as dom element.
        var _c = this.getElement(c); // set container.


        var previousContainer = this._container;
        this._container = _c; // move existing connections and endpoints, if any.

        this.select().each(function (conn) {
          conn.moveParent(_c);
        });
        this.selectEndpoints().each(function (ep) {
          ep.moveParent(_c);
        }); // managed elements

        for (var elId in this._managedElements) {
          var _el3 = this._managedElements[elId].el;

          if (_el3.parentNode === previousContainer) {
            previousContainer.removeChild(_el3);

            this._container.appendChild(_el3);
          }
        }

        this.setAttribute(this._container, ATTRIBUTE_CONTAINER, uuid().replace("-", ""));
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
            cEl = c[_st.el],
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

            ep = sep.endpoint != null && sep.endpoint._jsPlumb ? sep.endpoint : this.addEndpoint(el, sep.def);

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
            c.repaint();
          }
        }

        evtParams.element = el;
        return evtParams;
      }
    }, {
      key: "setSource",
      value: function setSource(connection, el, doNotRepaint) {
        var p = this._set(connection, el, 0, doNotRepaint);

        this.anchorManager.sourceChanged(p.originalSourceId, p.newSourceId, connection, p.el);
      }
    }, {
      key: "setTarget",
      value: function setTarget(connection, el, doNotRepaint) {
        var p = this._set(connection, el, 1, doNotRepaint);

        this.anchorManager.updateOtherEndpoint(p.originalSourceId, p.originalTargetId, p.newTargetId, connection);
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
      } // returns whether or not drawing is currently suspended.

    }, {
      key: "isSuspendDrawing",
      value: function isSuspendDrawing() {
        return this._suspendDrawing;
      } // return time for when drawing was suspended.

    }, {
      key: "getSuspendedAt",
      value: function getSuspendedAt() {
        return this._suspendedAt;
      }
    }, {
      key: "batch",
      value: function batch(fn, doNotRepaintAfterwards) {
        var _wasSuspended = this.isSuspendDrawing();

        if (!_wasSuspended) {
          this.setSuspendDrawing(true);
        }

        try {
          fn();
        } catch (e) {
          log("Function run while suspended failed", e);
        }

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
       * @param fn
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
            return {
              o: params.offset || this._offsets[elId],
              s: this._sizes[elId]
            };
          }
        }

        if (recalc || !offset && this._offsets[elId] == null) {
          // if forced repaint or no offset available, we recalculate.
          // get the current size and offset, and store them
          s = this._managedElements[elId] ? this._managedElements[elId].el : null;

          if (s != null) {
            this._sizes[elId] = this.getSize(s);
            this._offsets[elId] = this.getOffset(s);
            this._offsetTimestamps[elId] = timestamp;
          }
        } else {
          this._offsets[elId] = offset || this._offsets[elId];

          if (this._sizes[elId] == null) {
            s = this._managedElements[elId].el;

            if (s != null) {
              this._sizes[elId] = this.getSize(s);
            }
          }

          this._offsetTimestamps[elId] = timestamp;
        }

        if (this._offsets[elId] && !this._offsets[elId].right) {
          this._offsets[elId].right = this._offsets[elId].left + this._sizes[elId][0];
          this._offsets[elId].bottom = this._offsets[elId].top + this._sizes[elId][1];
          this._offsets[elId].width = this._sizes[elId][0];
          this._offsets[elId].height = this._sizes[elId][1];
          this._offsets[elId].centerx = this._offsets[elId].left + this._offsets[elId].width / 2;
          this._offsets[elId].centery = this._offsets[elId].top + this._offsets[elId].height / 2;
        }

        return {
          o: this._offsets[elId],
          s: this._sizes[elId]
        };
      }
    }, {
      key: "deleteConnection",
      value: function deleteConnection(connection, params) {
        if (connection != null) {
          params = params || {};

          if (params.force || functionChain(true, false, [[connection.endpoints[0], IS_DETACH_ALLOWED, [connection]], [connection.endpoints[1], IS_DETACH_ALLOWED, [connection]], [connection, IS_DETACH_ALLOWED, [connection]], [this, CHECK_CONDITION, [BEFORE_DETACH, connection]]])) {
            connection.setHover(false);
            this.fireDetachEvent(connection, !connection.pending && params.fireEvent !== false, params.originalEvent);
            connection.endpoints[0].detachFromConnection(connection);
            connection.endpoints[1].detachFromConnection(connection);
            removeWithFunction(this.connections, function (_c) {
              return connection.id === _c.id;
            });
            connection.cleanup();
            connection.destroy();
            return true;
          }
        }

        return false;
      }
    }, {
      key: "deleteEveryConnection",
      value: function deleteEveryConnection(params) {
        var _this4 = this;

        params = params || {};
        var count = this.connections.length,
            deletedCount = 0;
        this.batch(function () {
          for (var i = 0; i < count; i++) {
            deletedCount += _this4.deleteConnection(_this4.connections[0], params) ? 1 : 0;
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
        this.anchorManager.connectionDetached(params);
      }
    }, {
      key: "fireMoveEvent",
      value: function fireMoveEvent(params, evt) {
        this.fire(EVENT_CONNECTION_MOVED, params, evt);
      }
    }, {
      key: "manage",
      value: function manage(id, element) {
        var _this5 = this;

        var _one = function _one(id, element) {
          var _id, _element;

          if (!isString(id)) {
            _id = _this5.getId(id);
            _element = id;
          } else {
            _id = id;
            _element = element;
          }

          if (!_this5._managedElements[_id]) {
            _this5._managedElements[_id] = {
              el: _element,
              endpoints: [],
              connections: []
            }; // dont compute size now if drawing suspend (to avoid any reflows)

            if (_this5.isSuspendDrawing()) {
              _this5._sizes[_id] = [0, 0];
              _this5._offsets[_id] = {
                left: 0,
                top: 0
              };
              _this5._managedElements[_id].info = {
                o: _this5._offsets[_id],
                s: _this5._sizes[_id]
              };
            } else {
              _this5._managedElements[_id].info = _this5.updateOffset({
                elId: _id,
                timestamp: _this5._suspendedAt
              });
            }

            _this5.setAttribute(_element, ATTRIBUTE_MANAGED, "");
          }
        };

        if (id.length != null && !IS.aString(id)) {
          for (var i = 0; i < id.length; i++) {
            _one(id[i]);
          }
        } else {
          _one(id, element);
        }
      }
    }, {
      key: "unmanage",
      value: function unmanage(id) {
        if (this._managedElements[id]) {
          this.removeAttribute(this._managedElements[id].el, ATTRIBUTE_MANAGED);
          delete this._managedElements[id];
        }
      }
    }, {
      key: "newEndpoint",
      value: function newEndpoint(params, id) {
        var _p = extend({}, params);

        _p._jsPlumb = this;
        _p.elementId = id || this.getId(_p.source);
        var ep = new Endpoint(this, _p);
        ep.id = "ep_" + this._idstamp();
        this.manage(_p.elementId, _p.source);
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
        var _this6 = this;

        return this.each(el, function (_el) {
          _this6._draw(_el, ui, timestamp);
        });
      }
    }, {
      key: "revalidate",
      value: function revalidate(el, timestamp, isIdAlready) {
        var _this7 = this;

        return this.each(el, function (_el) {
          var elId = isIdAlready ? _el : _this7.getId(_el);

          _this7.updateOffset({
            elId: elId,
            recalc: true,
            timestamp: timestamp
          });

          _this7.repaint(_el);
        });
      } // repaint every endpoint and connection.

    }, {
      key: "repaintEverything",
      value: function repaintEverything() {
        // TODO this timestamp causes continuous anchors to not repaint properly.
        // fix this. do not just take out the timestamp. it runs a lot faster with
        // the timestamp included.
        var timestamp = _timestamp(),
            elId;

        for (elId in this.endpointsByElement) {
          this.updateOffset({
            elId: elId,
            recalc: true,
            timestamp: timestamp
          });
        }

        for (elId in this.endpointsByElement) {
          this._draw(elId, null, timestamp);
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
      value: function _draw(element, ui, timestamp) {
        if (!this._suspendDrawing) {
          var _id2 = this.getId(element),
              _el4 = this.getElement(element),
              repaintEls = this._getAssociatedElements(_el4),
              repaintOffsets = [];

          if (timestamp == null) {
            timestamp = _timestamp();
          } // update the offset of everything _before_ we try to draw anything.


          this.updateOffset({
            elId: _id2,
            offset: ui,
            recalc: false,
            timestamp: timestamp
          });

          for (var i = 0; i < repaintEls.length; i++) {
            repaintOffsets.push(this.updateOffset({
              elId: this.getId(repaintEls[i]),
              recalc: true,
              timestamp: timestamp
            }).o);
          }

          this.anchorManager.redraw(_id2, ui, timestamp, null);

          if (repaintEls.length > 0) {
            for (var j = 0; j < repaintEls.length; j++) {
              this.anchorManager.redraw(this.getId(repaintEls[j]), repaintOffsets[j], timestamp, null, true);
            }
          }
        }
      }
    }, {
      key: "deleteObject",
      value: function deleteObject(params) {
        var _this8 = this;

        var result = {
          endpoints: {},
          connections: {},
          endpointCount: 0,
          connectionCount: 0
        },
            deleteAttachedObjects = params.deleteAttachedObjects !== false;

        var unravelConnection = function unravelConnection(connection) {
          if (connection != null && result.connections[connection.id] == null) {
            if (!params.dontUpdateHover && connection._jsPlumb != null) {
              connection.setHover(false);
            }

            result.connections[connection.id] = connection;
            result.connectionCount++;
          }
        };

        var unravelEndpoint = function unravelEndpoint(endpoint) {
          if (endpoint != null && result.endpoints[endpoint.id] == null) {
            if (!params.dontUpdateHover && endpoint._jsPlumb != null) {
              endpoint.setHover(false);
            }

            result.endpoints[endpoint.id] = endpoint;
            result.endpointCount++;

            if (deleteAttachedObjects) {
              for (var i = 0; i < endpoint.connections.length; i++) {
                var _c3 = endpoint.connections[i];
                unravelConnection(_c3);
              }
            }
          }
        };

        if (params.connection) {
          unravelConnection(params.connection);
        } else {
          unravelEndpoint(params.endpoint);
        } // loop through connections


        var _loop = function _loop(i) {
          var c = result.connections[i];

          if (c._jsPlumb) {
            removeWithFunction(_this8.connections, function (_c) {
              return c.id === _c.id;
            });

            _this8.fireDetachEvent(c, params.fireEvent === false ? false : !c.pending, params.originalEvent);

            var doNotCleanup = params.deleteAttachedObjects == null ? null : !params.deleteAttachedObjects;
            c.endpoints[0].detachFromConnection(c, null, doNotCleanup);
            c.endpoints[1].detachFromConnection(c, null, doNotCleanup);
            c.cleanup(true);
            c.destroy(true);
          }
        };

        for (var i in result.connections) {
          _loop(i);
        } // loop through endpoints


        for (var j in result.endpoints) {
          var _e = result.endpoints[j];

          if (_e._jsPlumb) {
            this.unregisterEndpoint(_e); // FIRE some endpoint deleted event?

            _e.cleanup(true);

            _e.destroy(true);
          }
        }

        return result;
      }
    }, {
      key: "unregisterEndpoint",
      value: function unregisterEndpoint(endpoint) {
        if (endpoint._jsPlumb.uuid) {
          delete this.endpointsByUUID[endpoint._jsPlumb.uuid];
        }

        this.anchorManager.deleteEndpoint(endpoint); // TODO at least replace this with a removeWithFunction call.

        for (var _e2 in this.endpointsByElement) {
          var endpoints = this.endpointsByElement[_e2];

          if (endpoints) {
            var newEndpoints = [];

            for (var i = 0, j = endpoints.length; i < j; i++) {
              if (endpoints[i] !== endpoint) {
                newEndpoints.push(endpoints[i]);
              }
            }

            this.endpointsByElement[_e2] = newEndpoints;
          }

          if (this.endpointsByElement[_e2].length < 1) {
            delete this.endpointsByElement[_e2];
          }
        }
      }
    }, {
      key: "deleteEndpoint",
      value: function deleteEndpoint(object, dontUpdateHover, deleteAttachedObjects) {
        var endpoint = typeof object === "string" ? this.endpointsByUUID[object] : object;

        if (endpoint) {
          this.deleteObject({
            endpoint: endpoint,
            dontUpdateHover: dontUpdateHover,
            deleteAttachedObjects: deleteAttachedObjects
          });
        }

        return this;
      }
    }, {
      key: "deleteEveryEndpoint",
      value: function deleteEveryEndpoint() {
        var _is = this.setSuspendDrawing(true);

        for (var _id3 in this.endpointsByElement) {
          var endpoints = this.endpointsByElement[_id3];

          if (endpoints && endpoints.length) {
            for (var i = 0, j = endpoints.length; i < j; i++) {
              this.deleteEndpoint(endpoints[i], true);
            }
          }
        }

        this.endpointsByElement = {};
        this._managedElements = {};
        this.endpointsByUUID = {};
        this._offsets = {};
        this._offsetTimestamps = {};
        this.anchorManager.reset();

        if (!_is) {
          this.setSuspendDrawing(false);
        }

        return this;
      }
    }, {
      key: "addEndpoint",
      value: function addEndpoint(el, params, referenceParams) {
        var _this9 = this;

        referenceParams = referenceParams || {};
        var p = extend({}, referenceParams);
        extend(p, params);
        p.endpoint = p.endpoint || this.Defaults.endpoint;
        p.paintStyle = p.paintStyle || this.Defaults.endpointStyle; //delete p.label; // not supported on endpoint

        var ep = [];
        this.each(el, function (_el) {
          var _p = extend({
            source: _el
          }, p);

          var id = _this9.getId(_p.source);

          _this9.manage(id, _el);

          var e = _this9.newEndpoint(_p, id);

          addToList(_this9.endpointsByElement, id, e);

          if (!_this9._suspendDrawing) {
            var myOffset = _this9._managedElements[id].info.o;
            e.paint({
              anchorLoc: e.anchor.compute({
                xy: [myOffset.left, myOffset.top],
                wh: _this9._sizes[id],
                element: e,
                timestamp: _this9._suspendedAt
              }),
              timestamp: _this9._suspendedAt
            });
          }

          ep.push(e);
        });
        return ep[0];
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
        var _this10 = this;

        this.silently(function () {
          if (!silently) {
            _this10.deleteEveryEndpoint();
          }

          _this10.endpointsByElement = {};
          _this10._managedElements = {};
          _this10.endpointsByUUID = {};
          _this10._offsets = {};
          _this10._offsetTimestamps = {};

          _this10.anchorManager.reset();

          _this10.groupManager.reset();

          _this10._connectionTypes = {};
          _this10._endpointTypes = {};
          _this10.connections.length = 0;
        });
      } // clears the instance (without firing any events) and unbinds any listeners on the instance.

    }, {
      key: "destroy",
      value: function destroy() {
        this.reset(true);
        this.unbind();
      }
    }, {
      key: "getEndpoints",
      value: function getEndpoints(el) {
        return this.endpointsByElement[this._info(el).id] || [];
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
        var _this11 = this;

        var _p = extend({}, params);

        if (referenceParams) {
          extend(_p, referenceParams);
        } // hotwire endpoints passed as source or target to sourceEndpoint/targetEndpoint, respectively.


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
            hoverPaintStyle: _p.endpointHoverStyles ? _p.endpointHoverStyles[idx] : _p.endpointHoverStyle
          });

          return _this11.addEndpoint(el, params);
        }; // check for makeSource/makeTarget specs.


        var _oneElementDef = function _oneElementDef(type, idx, matchType) {
          // `type` is "source" or "target". Check that it exists, and is not already an Endpoint.
          if (_p[type] && !_p[type].endpoint && !_p[type + "Endpoint"] && !_p.newConnection) {
            var elDefs = _p[type][type === SOURCE ? SOURCE_DEFINITION_LIST : TARGET_DEFINITION_LIST];

            if (elDefs) {
              var defIdx = findWithFunction(elDefs, function (d) {
                return d.def.connectionType == null || d.def.connectionType === matchType;
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
                  var newEndpoint = tep.endpoint != null && tep.endpoint._jsPlumb ? tep.endpoint : _addEndpoint(_p[type], epDef, idx);

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

        if (_oneElementDef(SOURCE, 0, _p.type || DEFAULT) === false) {
          return;
        }

        if (_oneElementDef(TARGET, 1, _p.type || DEFAULT) === false) {
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
        return new Connection(this, params);
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
          this.anchorManager.newConnection(jpc);
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
        var _this12 = this;

        this.removeAllEndpoints(info.id, true, affectedElements);

        var _one = function _one(_info) {
          if (info.el != null) {
            _this12.anchorManager.clearFor(_info.id);

            _this12.anchorManager.removeFloatingConnection(_info.id);

            if (_this12.isSource(_info.el)) {
              _this12.unmakeSource(_info.el);
            }

            if (_this12.isTarget(_info.el)) {
              _this12.unmakeTarget(_info.el);
            }

            delete _this12._floatingConnections[_info.id];
            delete _this12._managedElements[_info.id];
            delete _this12._offsets[_info.id];

            if (_info.el) {
              _this12.removeElement(_info.el);
            }
          }
        }; // remove all affected child elements


        for (var ae = 1; ae < affectedElements.length; ae++) {
          _one(affectedElements[ae]);
        } // and always remove the requested one from the dom.


        _one(info);
      }
    }, {
      key: "remove",
      value: function remove(el, doNotRepaint) {
        var _this13 = this;

        var info = this._info(el),
            affectedElements = [];

        if (info.text && info.el.parentNode) {
          info.el.parentNode.removeChild(info.el);
        } else if (info.id) {
          this.batch(function () {
            _this13._doRemove(info, affectedElements);
          }, doNotRepaint === true);
        }

        return this;
      }
    }, {
      key: "removeAllEndpoints",
      value: function removeAllEndpoints(el, recurse, affectedElements) {
        var _this14 = this;

        affectedElements = affectedElements || [];

        var _one = function _one(_el) {
          var info = _this14._info(_el),
              ebe = _this14.endpointsByElement[info.id],
              i,
              ii;

          if (ebe) {
            affectedElements.push(info);

            for (i = 0, ii = ebe.length; i < ii; i++) {
              _this14.deleteEndpoint(ebe[i], false);
            }
          }

          delete _this14.endpointsByElement[info.id]; // TODO DOM specific

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
        var _this15 = this;

        var originalState = [],
            newState,
            os;
        connectionType = connectionType || DEFAULT;
        this.each(el, function (_el) {
          var defs = _el[type === SOURCE ? SOURCE_DEFINITION_LIST : TARGET_DEFINITION_LIST];

          if (defs) {
            _this15.each(defs, function (def) {
              if (def.def.connectionType == null || def.def.connectionType === connectionType) {
                os = def.enabled;
                originalState.push(os);
                newState = toggle ? !os : state;
                def.enabled = newState;

                _this15[newState ? "removeClass" : "addClass"](_el, "jtk-" + type + "-disabled");
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
      } // really just exposed for testing

    }, {
      key: "makeAnchor",
      value: function makeAnchor(spec, elementId) {
        return makeAnchorFromSpec(this, spec, elementId);
      }
    }, {
      key: "_unmake",
      value: function _unmake(type, key, el, connectionType) {
        var _this16 = this;

        connectionType = connectionType || DEFAULT;
        this.each(el, function (_el) {
          if (_el[key]) {
            if (connectionType === "*") {
              delete _el[key];

              _this16.removeAttribute(_el, "jtk-" + type);
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

                _this16.removeAttribute(_el, "jtk-" + type);
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
        var _this17 = this;

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
          var elInfo = _this17._info(_el); // get the element's id and store the endpoint definition for it.  jsPlumb.connect calls will look for one of these,
          // and use the endpoint definition if found.


          var elid = elInfo.id,
              _del = elInfo.el;

          _this17.manage(_del);

          _this17.setAttribute(_del, ATTRIBUTE_SOURCE, "");

          _this17._writeScopeAttribute(elInfo.el, p.scope || _this17.Defaults.scope);

          _this17.setAttribute(_del, [ATTRIBUTE_SOURCE, p.connectionType].join("-"), "");

          elInfo.el[SOURCE_DEFINITION_LIST] = elInfo.el[SOURCE_DEFINITION_LIST] || []; // TODO find the interface that pertains to this

          var _def = {
            def: extend({}, p),
            uniqueEndpoint: p.uniqueEndpoint,
            maxConnections: maxConnections,
            enabled: true,
            endpoint: null
          };

          if (p.createEndpoint) {
            _def.uniqueEndpoint = true;
            _def.endpoint = _this17.addEndpoint(_del, _def.def);
            _def.endpoint.deleteOnEmpty = false;
          }

          elInfo.def = _def;
          elInfo.el[SOURCE_DEFINITION_LIST].push(_def);
        };

        this.each(el, _one);
        return this;
      }
    }, {
      key: "_getScope",
      value: function _getScope(el, defKey) {
        var elInfo = this._info(el);

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
        var elInfo = this._info(el);

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
        var _this18 = this;

        // put jsplumb ref into params without altering the params passed in
        var p = extend({
          _jsPlumb: this
        }, referenceParams);
        extend(p, params);
        p.connectionType = p.connectionType || DEFAULT;
        var maxConnections = p.maxConnections || -1; //,

        var _one = function _one(_el) {
          // get the element's id and store the endpoint definition for it.  jsPlumb.connect calls will look for one of these,
          // and use the endpoint definition if found.
          // decode the info for this element (id and element)
          var elInfo = _this18._info(_el),
              dropOptions = extend({}, p.dropOptions || {});

          _this18.manage(elInfo.el);

          _this18.setAttribute(elInfo.el, ATTRIBUTE_TARGET, "");

          _this18._writeScopeAttribute(elInfo.el, p.scope || _this18.Defaults.scope);

          _this18.setAttribute(elInfo.el, [ATTRIBUTE_TARGET, p.connectionType].join("-"), "");

          elInfo.el[TARGET_DEFINITION_LIST] = elInfo.el[TARGET_DEFINITION_LIST] || []; // if this is a group and the user has not mandated a rank, set to -1 so that Nodes takes
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
            _def.endpoint = _this18.addEndpoint(elInfo.el, _def.def);
            _def.endpoint.deleteOnEmpty = false;
          }

          elInfo.el[TARGET_DEFINITION_LIST].push(_def);
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

        var info = this._info(el);

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
          }

          this._connectionTypes[id].overlayMap = to;
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

          this._endpointTypes[id].overlayMap = to;
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
        var proxyEp,
            originalElementId = connection.endpoints[index].elementId,
            originalEndpoint = connection.endpoints[index];
        connection.proxies = connection.proxies || [];

        if (connection.proxies[index]) {
          proxyEp = connection.proxies[index].ep;
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
          originalEp: originalEndpoint
        }; // and advise the anchor manager

        if (index === 0) {
          // TODO why are there two differently named methods? Why is there not one method that says "some end of this
          // connection changed (you give the index), and here's the new element and element id."
          this.anchorManager.sourceChanged(originalElementId, proxyElId, connection, proxyEl);
        } else {
          this.anchorManager.updateOtherEndpoint(connection.endpoints[0].elementId, originalElementId, proxyElId, connection);
          connection.target = proxyEl;
          connection.targetId = proxyElId;
        } // detach the original EP from the connection.


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
        connection.endpoints[index] = connection.proxies[index].originalEp; // and advise the anchor manager

        if (index === 0) {
          // TODO why are there two differently named methods? Why is there not one method that says "some end of this
          // connection changed (you give the index), and here's the new element and element id."
          this.anchorManager.sourceChanged(proxyElId, originalElementId, connection, originalElement);
        } else {
          this.anchorManager.updateOtherEndpoint(connection.endpoints[0].elementId, proxyElId, originalElementId, connection);
          connection.target = originalElement;
          connection.targetId = originalElementId;
        } // detach the proxy EP from the connection (which will cause it to be removed as we no longer need it)


        connection.proxies[index].ep.detachFromConnection(connection, null);
        connection.proxies[index].originalEp.addConnection(connection);

        if (connection.isVisible()) {
          connection.proxies[index].originalEp.setVisible(true);
        } // cleanup


        connection.proxies.length = 0;
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
      key: "removeGroup",
      value: function removeGroup(group, deleteMembers, manipulateDOM, doNotFireEvent) {
        this.groupManager.removeGroup(group, deleteMembers, manipulateDOM, doNotFireEvent);
      }
    }, {
      key: "removeAllGroups",
      value: function removeAllGroups(deleteMembers, manipulateDOM, doNotFireEvent) {
        this.groupManager.removeAllGroups(deleteMembers, manipulateDOM, doNotFireEvent);
      } // ------------ posses (not ported yet, may not be...)

      /*
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
        */

    }]);

    return jsPlumbInstance;
  }(EventGenerator);

  var HTMLElementOverlay =
  /*#__PURE__*/
  function () {
    function HTMLElementOverlay(instance, overlay) {
      _classCallCheck(this, HTMLElementOverlay);

      this.instance = instance;
      this.overlay = overlay;

      _defineProperty(this, "canvas", void 0);

      _defineProperty(this, "cachedDimensions", void 0);
    }

    _createClass(HTMLElementOverlay, [{
      key: "_createElement",
      value: function _createElement(component) {
        return this.instance.createElement("div", {}, this.instance.overlayClass + " " + (this.overlay.cssClass ? this.overlay.cssClass : ""));
      }
    }, {
      key: "getElement",
      value: function getElement(component) {
        if (this.canvas == null) {
          this.canvas = this._createElement(component);
          this.canvas.style.position = "absolute";
          this.instance.appendElement(this.canvas);
          this.instance.getId(this.canvas); // in IE the top left corner is what it placed at the desired location.  This will not
          // be fixed. IE8 is not going to be supported for much longer.

          var ts = "translate(-50%, -50%)";
          this.canvas.style.webkitTransform = ts;
          this.canvas.style.mozTransform = ts;
          this.canvas.style.msTransform = ts;
          this.canvas.style.oTransform = ts;
          this.canvas.style.transform = ts; // write the related component into the created element
          //div._jsPlumb = this;

          if (!this.overlay.isVisible()) {
            this.canvas.style.display = "none";
          }

          this.canvas.jtk = {
            overlay: this.overlay
          };
        }

        return this.canvas;
      }
    }, {
      key: "_getDimensions",
      value: function _getDimensions(forceRefresh) {
        if (this.cachedDimensions == null || forceRefresh) {
          this.cachedDimensions = this.getDimensions();
        }

        return this.cachedDimensions;
      }
    }, {
      key: "draw",
      value: function draw(component, currentConnectionPaintStyle, absolutePosition) {
        var td = this._getDimensions();

        if (td != null && td.length === 2) {
          var cxy = {
            x: 0,
            y: 0
          }; // absolutePosition would have been set by a call to connection.setAbsoluteOverlayPosition.

          if (absolutePosition) {
            cxy = {
              x: absolutePosition[0],
              y: absolutePosition[1]
            };
          } else if (component.pointOnPath != null) {
            var loc = this.overlay.location,
                absolute = false;

            if (IS.aString(this.overlay.location) || this.overlay.location < 0 || this.overlay.location > 1) {
              loc = parseInt("" + this.overlay.location, 10);
              absolute = true;
            }

            cxy = component.pointOnPath(loc, absolute); // a connection
          } else {
            var locToUse = this.overlay.location.constructor === Array ? this.overlay.location : this.overlay.endpointLocation;
            cxy = {
              x: locToUse[0] * component.w,
              y: locToUse[1] * component.h
            };
          }

          var minx = cxy.x - td[0] / 2,
              miny = cxy.y - td[1] / 2;
          return {
            component: this.overlay,
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
      }
    }, {
      key: "setVisible",
      value: function setVisible(v) {
        this.getElement(this.overlay.component).style.display = v ? "block" : "none";
      }
    }, {
      key: "destroy",
      value: function destroy(force) {
        var el = this.getElement(this.overlay.component);

        if (el) {
          el.parentNode.removeChild(el);
        }
      }
    }, {
      key: "setHover",
      value: function setHover(h) {
        var el = this.getElement(this.overlay.component);
        this.instance[h ? "addClass" : "removeClass"](el, this.instance.hoverClass);
      }
    }, {
      key: "getDimensions",
      value: function getDimensions() {
        return [1, 1];
      }
    }, {
      key: "paint",
      value: function paint(params, extents) {
        //console.log("PAINT on HTML overlay called")
        var el = this.getElement(this.overlay.component); //params.component.appendDisplayElement(this.canvas);   probably need this - it helps to know which elements should be hiddne/shown on visibility change
        // if (this.detached) {
        //     this._jsPlumb.div.parentNode.removeChild(this._jsPlumb.div);
        // }
        // this.canvas.style.left = (params.component.x + params.d.minx) + "px";
        // this.canvas.style.top = (params.component.y + params.d.miny) + "px";

        var XY = this.overlay.component.getXY();
        this.canvas.style.left = XY.x + params.d.minx + "px"; // wont work for endpoint. abstracts

        this.canvas.style.top = XY.y + params.d.miny + "px";
      }
    }, {
      key: "addClass",
      value: function addClass(clazz) {
        this.instance.addClass(this.canvas, clazz);
      }
    }, {
      key: "removeClass",
      value: function removeClass(clazz) {
        this.instance.removeClass(this.canvas, clazz);
      }
    }, {
      key: "moveParent",
      value: function moveParent(newParent) {
        this.instance.appendElement(this.canvas);
      }
    }]);

    return HTMLElementOverlay;
  }();
  var HTMLLabelElementOverlay =
  /*#__PURE__*/
  function (_HTMLElementOverlay) {
    _inherits(HTMLLabelElementOverlay, _HTMLElementOverlay);

    function HTMLLabelElementOverlay(instance, overlay) {
      var _this;

      _classCallCheck(this, HTMLLabelElementOverlay);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(HTMLLabelElementOverlay).call(this, instance, overlay));
      _this.instance = instance;
      _this.overlay = overlay;

      _this.setText(overlay.getLabel());

      return _this;
    }

    _createClass(HTMLLabelElementOverlay, [{
      key: "setText",
      value: function setText(t) {
        this.getElement(this.overlay.component).innerHTML = t;
      }
    }]);

    return HTMLLabelElementOverlay;
  }(HTMLElementOverlay);
  var HTMLCustomElementOverlay =
  /*#__PURE__*/
  function (_HTMLElementOverlay2) {
    _inherits(HTMLCustomElementOverlay, _HTMLElementOverlay2);

    function HTMLCustomElementOverlay(instance, overlay) {
      var _this2;

      _classCallCheck(this, HTMLCustomElementOverlay);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(HTMLCustomElementOverlay).call(this, instance, overlay));
      _this2.instance = instance;
      _this2.overlay = overlay;
      return _this2;
    }

    _createClass(HTMLCustomElementOverlay, [{
      key: "_createElement",
      value: function _createElement(component) {
        var el = this.overlay.create(component);
        el.classList.add("jtk-overlay");
        return el;
      }
    }]);

    return HTMLCustomElementOverlay;
  }(HTMLElementOverlay);

  var SVGElementOverlay =
  /*#__PURE__*/
  function () {
    function SVGElementOverlay(instance, overlay) {
      _classCallCheck(this, SVGElementOverlay);

      this.instance = instance;
      this.overlay = overlay;

      _defineProperty(this, "bgPath", void 0);

      _defineProperty(this, "path", void 0);

      this.path = _node(this.instance, "path", {});
      var parent = null;

      if (this.overlay.component instanceof Connection) {
        var connector = this.overlay.component.getConnector().renderer;
        parent = connector.svg;
      } else if (this.overlay.component instanceof Endpoint) {
        var endpoint = this.overlay.component.endpoint.renderer;
        parent = endpoint.svg;
      }

      if (parent != null) {
        _appendAtIndex(parent, this.path, 1); //params.paintStyle.outlineStroke ? 1 : 0);

      }

      this.instance.addClass(this.path, this.instance.overlayClass);
      this.path.jtk = {
        overlay: overlay
      };
    }

    _createClass(SVGElementOverlay, [{
      key: "setHover",
      value: function setHover(h) {}
    }, {
      key: "destroy",
      value: function destroy(force) {
        if (this.path != null) {
          this.path.parentNode.removeChild(this.path);
        }

        if (this.bgPath != null) {
          this.bgPath.parentNode.removeChild(this.bgPath);
        }

        this.path = null;
        this.bgPath = null;
      }
    }, {
      key: "setVisible",
      value: function setVisible(v) {} // setText(t: string): void {
      // }

    }, {
      key: "draw",
      value: function draw(component, currentConnectionPaintStyle, absolutePosition) {//    return this.renderer.draw(component, currentConnectionPaintStyle, absolutePosition);
      }
    }, {
      key: "paint",
      value: function paint(params, extents) {
        //return this.renderer.paint(params, extents);
        console.log("PAINt!"); // let a = {
        //     d: "",
        //     //transform: "translate(" + offset[0] + "," + offset[1] + ")",
        //     "pointer-events": "visibleStroke"
        // };

        var offset = [0, 0];

        if (extents.xmin < 0) {
          offset[0] = -extents.xmin;
        }

        if (extents.ymin < 0) {
          offset[1] = -extents.ymin;
        }

        var a = {
          "d": this.makePath(params.d),
          stroke: params.stroke ? params.stroke : null,
          fill: params.fill ? params.fill : null,
          transform: "translate(" + offset[0] + "," + offset[1] + ")",
          "pointer-events": "visibleStroke"
        }; // if (this.path == null) {
        //     this.path = _node(this.instance, "path", a);
        //     // here we're going to assume the overlay's component is a connection, rendered by this renderer.
        //     let connector = (this.overlay.component as Connection<HTMLElement>).getConnector().renderer as SvgElementConnector;
        //     _appendAtIndex(connector.svg, this.path, 1);//params.paintStyle.outlineStroke ? 1 : 0);
        // }
        // else {

        _attr(this.path, a); //}

      }
    }, {
      key: "addClass",
      value: function addClass(clazz) {}
    }, {
      key: "removeClass",
      value: function removeClass(clazz) {}
    }, {
      key: "getElement",
      value: function getElement(component) {
        return this.path;
      }
    }, {
      key: "moveParent",
      value: function moveParent(newParent) {// does nothing, as the DOM elements for this overlay type are children of the connector's dom element.
      }
    }]);

    return SVGElementOverlay;
  }();
  var ArrowSVGElementOverlay =
  /*#__PURE__*/
  function (_SVGElementOverlay) {
    _inherits(ArrowSVGElementOverlay, _SVGElementOverlay);

    function ArrowSVGElementOverlay() {
      _classCallCheck(this, ArrowSVGElementOverlay);

      return _possibleConstructorReturn(this, _getPrototypeOf(ArrowSVGElementOverlay).apply(this, arguments));
    }

    _createClass(ArrowSVGElementOverlay, [{
      key: "makePath",
      value: function makePath(d) {
        return isNaN(d.cxy.x) || isNaN(d.cxy.y) ? "" : "M" + d.hxy.x + "," + d.hxy.y + " L" + d.tail[0].x + "," + d.tail[0].y + " L" + d.cxy.x + "," + d.cxy.y + " L" + d.tail[1].x + "," + d.tail[1].y + " L" + d.hxy.x + "," + d.hxy.y;
      }
    }]);

    return ArrowSVGElementOverlay;
  }(SVGElementOverlay);

  var svgAttributeMap = {
    "stroke-linejoin": "stroke-linejoin",
    "stroke-dashoffset": "stroke-dashoffset",
    "stroke-linecap": "stroke-linecap"
  };
  var STROKE_DASHARRAY = "stroke-dasharray";
  var DASHSTYLE = "dashstyle";
  var LINEAR_GRADIENT = "linearGradient";
  var RADIAL_GRADIENT = "radialGradient";
  var DEFS = "defs";
  var FILL = "fill";
  var STOP = "stop";
  var STROKE = "stroke";
  var STROKE_WIDTH = "stroke-width";
  var STYLE = "style";
  var JSPLUMB_GRADIENT = "jsplumb_gradient_";
  var LINE_WIDTH = "strokeWidth";
  var ns = {
    svg: "http://www.w3.org/2000/svg"
  };
  function _attr(node, attributes) {
    for (var i in attributes) {
      node.setAttribute(i, "" + attributes[i]);
    }
  }
  function _node(instance, name, attributes) {
    attributes = attributes || {};
    attributes.version = "1.1";
    attributes.xmlns = ns.svg;
    return instance.createElementNS(ns.svg, name, null, null, attributes);
  }
  function _pos(d) {
    return "position:absolute;left:" + d[0] + "px;top:" + d[1] + "px";
  }
  function _clearGradient(parent) {
    var els = parent.querySelectorAll(" defs,linearGradient,radialGradient");

    for (var i = 0; i < els.length; i++) {
      els[i].parentNode.removeChild(els[i]);
    }
  }
  function _updateGradient(parent, node, style, dimensions, uiComponent) {
    var id = JSPLUMB_GRADIENT + uiComponent.instance._idstamp(); // first clear out any existing gradient


    _clearGradient(parent); // this checks for an 'offset' property in the gradient, and in the absence of it, assumes
    // we want a linear gradient. if it's there, we create a radial gradient.
    // it is possible that a more explicit means of defining the gradient type would be
    // better. relying on 'offset' means that we can never have a radial gradient that uses
    // some default offset, for instance.
    // issue 244 suggested the 'gradientUnits' attribute; without this, straight/flowchart connectors with gradients would
    // not show gradients when the line was perfectly horizontal or vertical.


    var g;

    if (!style.gradient.offset) {
      g = _node(uiComponent.instance, LINEAR_GRADIENT, {
        id: id,
        gradientUnits: "userSpaceOnUse"
      });
    } else {
      g = _node(uiComponent.instance, RADIAL_GRADIENT, {
        id: id
      });
    }

    var defs = _node(uiComponent.instance, DEFS);

    parent.appendChild(defs);
    defs.appendChild(g); // the svg radial gradient seems to treat stops in the reverse
    // order to how canvas does it.  so we want to keep all the maths the same, but
    // iterate the actual style declarations in reverse order, if the x indexes are not in order.

    for (var i = 0; i < style.gradient.stops.length; i++) {
      var styleToUse = uiComponent.segment === 1 || uiComponent.segment === 2 ? i : style.gradient.stops.length - 1 - i,
          stopColor = style.gradient.stops[styleToUse][1],
          s = _node(uiComponent.instance, STOP, {
        "offset": Math.floor(style.gradient.stops[i][0] * 100) + "%",
        "stop-color": stopColor
      });

      g.appendChild(s);
    }

    var applyGradientTo = style.stroke ? STROKE : FILL;
    node.setAttribute(applyGradientTo, "url(#" + id + ")");
  }
  function _applyStyles(parent, node, style, dimensions, uiComponent) {
    node.setAttribute(FILL, style.fill ? style.fill : NONE);
    node.setAttribute(STROKE, style.stroke ? style.stroke : NONE);

    if (style.gradient) {
      _updateGradient(parent, node, style, dimensions, uiComponent);
    } else {
      // make sure we clear any existing gradient
      _clearGradient(parent);

      node.setAttribute(STYLE, "");
    }

    if (style.strokeWidth) {
      node.setAttribute(STROKE_WIDTH, style.strokeWidth);
    } // in SVG there is a stroke-dasharray attribute we can set, and its syntax looks like
    // the syntax in VML but is actually kind of nasty: values are given in the pixel
    // coordinate space, whereas in VML they are multiples of the width of the stroked
    // line, which makes a lot more sense.  for that reason, jsPlumb is supporting both
    // the native svg 'stroke-dasharray' attribute, and also the 'dashstyle' concept from
    // VML, which will be the preferred method.  the code below this converts a dashstyle
    // attribute given in terms of stroke width into a pixel representation, by using the
    // stroke's lineWidth.


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
    } // extra attributes such as join type, dash offset.


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
  /*
   * Function: sizeElement
   * Helper to size and position an element. You would typically use
   * this when writing your own Connector or Endpoint implementation.
   *
   * Parameters:
   *  x - [int] x position for the element origin
   *  y - [int] y position for the element origin
   *  w - [int] width of the element
   *  h - [int] height of the element
   *
   */

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

  var SvgComponent =
  /*#__PURE__*/
  function () {
    //typeId:string;
    function SvgComponent(instance, refComponent, params) {
      _classCallCheck(this, SvgComponent);

      this.instance = instance;
      this.refComponent = refComponent;

      _defineProperty(this, "pointerEventsSpec", void 0);

      _defineProperty(this, "svg", void 0);

      _defineProperty(this, "renderer", {});

      _defineProperty(this, "clazz", void 0);

      _defineProperty(this, "useDivWrapper", void 0);

      _defineProperty(this, "canvas", void 0);

      _defineProperty(this, "bgCanvas", void 0);

      params = params || {};
      this.pointerEventsSpec = params.pointerEventsSpec || "all";
      this.useDivWrapper = params.useDivWrapper === true;
      this.svg = _node(this.instance, "svg", {
        "style": "",
        "width": "0",
        "height": "0",
        "pointer-events": "none",
        "position": "absolute"
      });
      this.clazz = params.cssClass;

      if (params.useDivWrapper) {
        this.canvas = this.instance.createElement("div", {
          position: "absolute"
        }); // if (!params._jsPlumb.isSuspendDrawing()) {

        sizeElement(this.canvas, 0, 0, 1, 1); //}

        this.canvas.className = this.clazz;
      } else {
        _attr(this.svg, {
          "class": this.clazz
        });

        this.canvas = this.svg;
      }

      this.instance.appendElement(this.canvas, this.instance.getContainer());

      if (params.useDivWrapper) {
        this.canvas.appendChild(this.svg);
      } // this.displayElements = [ this.canvas ];

    } //    _jp.jsPlumbUIComponent.apply(this, params.originalArgs);


    _createClass(SvgComponent, [{
      key: "paint",
      value: function paint(style, extents) {
        if (style != null) {
          var xy = [this.refComponent.x, this.refComponent.y],
              wh = [this.refComponent.w, this.refComponent.h],
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

          if (this.useDivWrapper) {
            sizeElement(this.canvas, xy[0], xy[1], wh[0], wh[1]);
            xy[0] = 0;
            xy[1] = 0;
            p = _pos([0, 0]);
          } else {
            p = _pos([xy[0], xy[1]]);
          } //renderer.paint.apply(this, arguments);


          _attr(this.svg, {
            "style": p,
            "width": "" + (wh[0] || 0),
            "height": "" + (wh[1] || 0)
          });
        }
      }
    }, {
      key: "cleanup",
      value: function cleanup(force) {
        //super.cleanup(force);
        if (force) {
          if (this.canvas) {
            this.canvas._jsPlumb = null;
          }

          if (this.svg) {
            this.svg._jsPlumb = null;
          }

          if (this.bgCanvas) {
            this.bgCanvas._jsPlumb = null;
          }

          if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
          }

          if (this.bgCanvas && this.bgCanvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
          }

          this.svg = null;
          this.canvas = null;
          this.bgCanvas = null; //this.path = null;
          //this.group = null;
        } else {
          // if not a forced cleanup, just detach from DOM for now.
          if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
          }

          if (this.bgCanvas && this.bgCanvas.parentNode) {
            this.bgCanvas.parentNode.removeChild(this.bgCanvas);
          }
        }
      }
    }, {
      key: "reattach",
      value: function reattach(instance) {
        var c = instance.getContainer();

        if (this.canvas && this.canvas.parentNode == null) {
          c.appendChild(this.canvas);
        }

        if (this.bgCanvas && this.bgCanvas.parentNode == null) {
          c.appendChild(this.bgCanvas);
        }
      }
    }, {
      key: "setVisible",
      value: function setVisible(v) {
        if (this.canvas) {
          this.canvas.style.display = v ? "block" : "none";
        }

        if (this.bgCanvas) {
          this.bgCanvas.style.display = v ? "block" : "none";
        }
      }
    }, {
      key: "setHover",
      value: function setHover(b) {
        this.instance[b ? "addClass" : "removeClass"](this.canvas, this.instance.hoverClass);
      }
    }, {
      key: "destroy",
      value: function destroy(force) {
        //console.log("destroy svg component");
        if (this.canvas != null) {
          this.instance.removeElement(this.canvas);
        }

        if (this.bgCanvas != null) {
          this.instance.removeElement(this.bgCanvas);
        }
      }
    }, {
      key: "addClass",
      value: function addClass(clazz) {
        this.instance.addClass(this.canvas, clazz);
      }
    }, {
      key: "removeClass",
      value: function removeClass(clazz) {
        this.instance.removeClass(this.canvas, clazz);
      }
    }, {
      key: "getClass",
      value: function getClass() {
        return this.instance.getClass(this.canvas);
      }
    }, {
      key: "moveParent",
      value: function moveParent(newParent) {
        this.instance.appendElement(this.canvas);
      }
    }]);

    return SvgComponent;
  }();

  /**
   * Renderer for a connector that uses an `svg` element in the DOM.
   */

  var SvgElementConnector =
  /*#__PURE__*/
  function (_SvgComponent) {
    _inherits(SvgElementConnector, _SvgComponent);

    function SvgElementConnector(instance, connector) {
      var _this;

      _classCallCheck(this, SvgElementConnector);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SvgElementConnector).call(this, instance, connector, null));
      _this.instance = instance;
      _this.connector = connector;

      _defineProperty(_assertThisInitialized(_this), "bgPath", void 0);

      _defineProperty(_assertThisInitialized(_this), "path", void 0);

      if (connector.cssClass != null) {
        instance.addClass(_this.canvas, connector.cssClass);
      }

      instance.addClass(_this.canvas, instance.connectorClass);
      _this.canvas.jtk = _this.canvas.jtk || {};
      _this.canvas.jtk.connector = connector;
      return _this;
    }

    _createClass(SvgElementConnector, [{
      key: "paint",
      value: function paint(paintStyle, extents) {
        _get(_getPrototypeOf(SvgElementConnector.prototype), "paint", this).call(this, paintStyle, extents);

        var segments = this.connector.segments;
        var p = "",
            offset = [0, 0];

        if (extents.xmin < 0) {
          offset[0] = -extents.xmin;
        }

        if (extents.ymin < 0) {
          offset[1] = -extents.ymin;
        }

        if (segments.length > 0) {
          p = this.connector.getPathData();
          var a = {
            d: p,
            transform: "translate(" + offset[0] + "," + offset[1] + ")",
            "pointer-events": "visibleStroke"
          },
              outlineStyle = null,
              d = [this.connector.x, this.connector.y, this.connector.w, this.connector.h]; // outline style.  actually means drawing an svg object underneath the main one.

          if (paintStyle.outlineStroke) {
            var outlineWidth = paintStyle.outlineWidth || 1,
                outlineStrokeWidth = paintStyle.strokeWidth + 2 * outlineWidth;
            outlineStyle = extend({}, paintStyle);
            delete outlineStyle.gradient;
            outlineStyle.stroke = paintStyle.outlineStroke;
            outlineStyle.strokeWidth = outlineStrokeWidth;

            if (this.bgPath == null) {
              this.bgPath = _node(this.instance, "path", a);
              this.instance.addClass(this.bgPath, this.instance.connectorOutlineClass);

              _appendAtIndex(this.svg, this.bgPath, 0);
            } else {
              _attr(this.bgPath, a);
            }

            _applyStyles(this.svg, this.bgPath, outlineStyle, d, null);
          }

          if (this.path == null) {
            this.path = _node(this.instance, "path", a);

            _appendAtIndex(this.svg, this.path, paintStyle.outlineStroke ? 1 : 0);
          } else {
            _attr(this.path, a);
          }

          _applyStyles(this.svg, this.path, paintStyle, d, this);
        }
      }
    }, {
      key: "applyType",
      value: function applyType(t) {
        if (t.cssClass != null && this.svg) {
          this.instance.addClass(this.svg, t.cssClass);
        }
      }
    }]);

    return SvgElementConnector;
  }(SvgComponent);

  var DOMImageEndpointRenderer =
  /*#__PURE__*/
  function () {
    function DOMImageEndpointRenderer(endpoint, ep, options) {
      var _this = this;

      _classCallCheck(this, DOMImageEndpointRenderer);

      this.endpoint = endpoint;
      this.ep = ep;

      _defineProperty(this, "canvas", void 0);

      _defineProperty(this, "instance", void 0);

      _defineProperty(this, "_initialized", false);

      _defineProperty(this, "img", void 0);

      this.instance = endpoint.instance;
      this.canvas = endpoint.instance.createElement("img", {
        position: "absolute",
        margin: 0,
        padding: 0,
        outline: 0
      }, this.instance.endpointClass + " " + ep.cssClass);
      this.instance.appendElement(this.canvas);
      this.img = new Image();

      this.img.onload = function () {
        this.ep._imageLoaded = true;
        this.ep._imageWidth = this.ep._imageWidth || this.img.width;
        this.ep._imageHeight = this.ep._imageHeight || this.img.height;

        if (this.ep.onload) {
          this.ep.onload(this);
        }
      }.bind(this);

      this.endpoint.setImage = function (_img) {
        var s = _img.constructor === String ? _img : _img.src;
        _this.img.src = s;

        if (_this.canvas != null) {
          _this.canvas.setAttribute("src", _this.img.src);
        }
      };

      setTimeout(function () {
        this.endpoint.setImage(this.ep.src);
      }.bind(this), 0);
    }

    _createClass(DOMImageEndpointRenderer, [{
      key: "addClass",
      value: function addClass(c) {
        this.instance.addClass(this.canvas, c);
      }
    }, {
      key: "removeClass",
      value: function removeClass(c) {
        this.instance.removeClass(this.canvas, c);
      }
    }, {
      key: "moveParent",
      value: function moveParent(newParent) {
        this.instance.appendElement(this.canvas);
      }
    }, {
      key: "applyType",
      value: function applyType(t) {}
    }, {
      key: "cleanup",
      value: function cleanup(force) {}
    }, {
      key: "destroy",
      value: function destroy(force) {
        this.instance.removeElement(this.canvas);
      }
    }, {
      key: "getElement",
      value: function getElement() {
        return this.canvas;
      }
    }, {
      key: "actuallyPaint",
      value: function actuallyPaint(paintStyle) {
        if (this.ep._imageLoaded) {
          if (!this._initialized) {
            this.canvas.setAttribute("src", this.img.src);
            this.instance.appendElement(this.canvas);
            this._initialized = true;
          }

          var x = this.ep.anchorPoint[0] - this.ep._imageWidth / 2,
              y = this.ep.anchorPoint[1] - this.ep._imageHeight / 2;
          this.canvas.style.left = x + "px";
          this.canvas.style.top = y + "px";
          this.canvas.style.width = this.ep._imageWidth + "px";
          this.canvas.style.height = this.ep._imageHeight + "px";
        }
      }
    }, {
      key: "paint",
      value: function paint(paintStyle) {
        if (this.ep._imageLoaded) {
          this.actuallyPaint(paintStyle);
        } else {
          setTimeout(function () {
            this.paint(paintStyle);
          }.bind(this), 200);
        }
      }
    }, {
      key: "setHover",
      value: function setHover(h) {
        this.instance[h ? "addClass" : "removeClass"](this.canvas, this.instance.hoverClass);
      }
    }, {
      key: "setVisible",
      value: function setVisible(v) {
        this.canvas.style.display = v ? "block" : "none";
      }
    }]);

    return DOMImageEndpointRenderer;
  }();

  var endpointMap$1 = {};
  function registerEndpointRenderer(name, ep) {
    endpointMap$1[name] = ep;
  }
  var BrowserRenderer =
  /*#__PURE__*/
  function () {
    function BrowserRenderer() {
      _classCallCheck(this, BrowserRenderer);
    }

    _createClass(BrowserRenderer, [{
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
      key: "repaint",
      value: function repaint(component, typeDescriptor, options) {
        console.log("doing a repaint of " + typeDescriptor);
      }
    }, {
      key: "assignRenderer",
      value: function assignRenderer(endpoint, ep, options) {
        var t = ep.getType();

        if (t === "Image") {
          return new DOMImageEndpointRenderer(endpoint, ep, options);
        }

        var c = endpointMap$1[t];

        if (!c) {
          throw {
            message: "jsPlumb: no render for endpoint of type '" + t + "'"
          };
        } else {
          return new c(endpoint, ep, options);
        }
      }
    }, {
      key: "assignOverlayRenderer",
      value: function assignOverlayRenderer(instance, o) {
        if (o.type === "Label") {
          return new HTMLLabelElementOverlay(instance, o);
        } else if (o.type === "Arrow") {
          return new ArrowSVGElementOverlay(instance, o);
        } else if (o.type === "Custom") {
          return new HTMLCustomElementOverlay(instance, o);
        } else {
          throw "Could not assign renderer for overlay of type [" + o.type + "]";
        }
      }
    }, {
      key: "assignConnectorRenderer",
      value: function assignConnectorRenderer(instance, c) {
        return new SvgElementConnector(instance, c);
      }
    }]);

    return BrowserRenderer;
  }();

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

  var CLASS_DRAG_ACTIVE = "jtk-drag-active";
  var CLASS_DRAGGED = "jtk-dragged";
  var CLASS_DRAG_HOVER = "jtk-drag-hover";
  var ATTR_NOT_DRAGGABLE = "jtk-not-draggable";
  var EVT_DRAG_MOVE = "drag:move";
  var EVT_DRAG_STOP = "drag:stop";
  var EVT_DRAG_START = "drag:start";
  var EVT_MOUSEDOWN = "mousedown";
  var EVT_MOUSEUP = "mouseup";
  var EVT_REVERT = "revert";
  var DragManager =
  /*#__PURE__*/
  function () {
    // elementids mapped to the draggable to which they belong.
    function DragManager(instance) {
      var _this = this;

      _classCallCheck(this, DragManager);

      this.instance = instance;

      _defineProperty(this, "katavorio", void 0);

      _defineProperty(this, "katavorioDraggable", void 0);

      _defineProperty(this, "_draggables", {});

      _defineProperty(this, "_dlist", []);

      _defineProperty(this, "_elementsWithEndpoints", {});

      _defineProperty(this, "_draggablesForElements", {});

      _defineProperty(this, "handlers", []);

      var e = instance.eventManager; // create a delegated drag handler

      this.katavorio = new Katavorio({
        bind: e.on,
        unbind: e.off,
        getSize: this.instance.getSize.bind(instance),
        getConstrainingRectangle: function getConstrainingRectangle(el) {
          return [el.parentNode.scrollWidth, el.parentNode.scrollHeight];
        },
        getPosition: function getPosition(el, relativeToRoot) {
          // if this is a nested draggable then compute the offset against its own offsetParent, otherwise
          // compute against the Container's origin. see also the getUIPosition method below.
          //var o = _currentInstance.getOffset(el, relativeToRoot, el._katavorioDrag ? el.offsetParent : null);
          //var o = _currentInstance.getOffset(el, relativeToRoot, el._jsPlumbGroup ? el.offsetParent : null);
          var o = _this.instance.getOffset(el, relativeToRoot, el.offsetParent); //console.log("get position ", el.id, o.left, o.top);


          return [o.left, o.top];
        },
        setPosition: function setPosition(el, xy) {
          el.style.left = xy[0] + "px";
          el.style.top = xy[1] + "px";
        },
        addClass: this.instance.addClass.bind(instance),
        removeClass: this.instance.removeClass.bind(instance),
        intersects: Biltong.intersects,
        indexOf: function indexOf(l, i) {
          return l.indexOf(i);
        },
        scope: this.instance.getDefaultScope(),
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
        zoom: this.instance.getZoom(),
        constrain: function constrain(desiredLoc, dragEl, constrainRect, size) {
          var x = desiredLoc[0],
              y = desiredLoc[1];

          if (dragEl._jsPlumbGroup && dragEl._jsPlumbGroup.constrain) {
            x = Math.max(desiredLoc[0], 0);
            y = Math.max(desiredLoc[1], 0);
            x = Math.min(x, constrainRect.w - size[0]);
            y = Math.min(y, constrainRect.h - size[1]);
          }

          return [x, y];
        },
        revert: function revert(dragEl, pos) {
          var _el = dragEl; // if drag el not removed from DOM (pruned by a group), and it has a group which has revert:true, then revert.

          return _el.parentNode != null && _el._jsPlumbGroup && _el._jsPlumbGroup.revert ? !_isInsideParent(_this.instance, _el, pos) : false;
        }
      }); //(<any>this._katavorio_main = katavorio;

      this.instance.bind("zoom", function (z) {
        _this.katavorio.setZoom(z);
      }); //
      // ------------ drag handler for elements (and elements inside groups). this is added as a selector on the endpoint drag handler below ------------------
      //
      //const elementDragOptions = extend({selector:"> [jtk-managed]"}, this.instance.Defaults.dragOptions || {});
      // const elementDragOptions:any = extend({selector:"> [jtk-managed]"}, {});  // we dont have dragOptions in the defaults for the time being
      //
      // elementDragOptions.start = wrap(elementDragOptions.start, (p:any) => { return this.instance._dragStart(p); });
      // elementDragOptions.drag = wrap(elementDragOptions.drag, (p:any) => { return this.instance._dragMove(p); });
      // elementDragOptions.stop = wrap(elementDragOptions.stop, (p:any) => { return this.instance._dragStop(p); });
      //
      // this.katavorio.draggable(this.instance.getContainer(), elementDragOptions);
    }

    _createClass(DragManager, [{
      key: "addHandler",
      value: function addHandler(handler, dragOptions) {
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

        if (handler.useGhostProxy) {
          o.useGhostProxy = handler.useGhostProxy;
          o.makeGhostProxy = handler.makeGhostProxy;
        }

        if (this.katavorioDraggable == null) {
          this.katavorioDraggable = this.katavorio.draggable(this.instance.getContainer(), o)[0];
        } else {
          this.katavorioDraggable.addSelector(o);
        }

        handler.init(this.katavorioDraggable);
      }
    }, {
      key: "reset",
      value: function reset() {
        this.handlers.forEach(function (handler) {
          handler.reset();
        });

        if (this.katavorioDraggable != null) {
          this.katavorio.destroyDraggable(this.instance.getContainer());
        }
      }
    }]);

    return DragManager;
  }();

  var ElementDragHandler =
  /*#__PURE__*/
  function () {
    function ElementDragHandler(instance) {
      _classCallCheck(this, ElementDragHandler);

      this.instance = instance;

      _defineProperty(this, "selector", "> [jtk-managed]");

      _defineProperty(this, "_dragOffset", null);

      _defineProperty(this, "_groupLocations", []);

      _defineProperty(this, "_intersectingGroups", []);
    }

    _createClass(ElementDragHandler, [{
      key: "onStop",
      value: function onStop(params) {
        var _this = this;

        var elements = params.selection,
            uip;

        if (elements.length === 0) {
          elements = [[params.el, {
            left: params.finalPos[0],
            top: params.finalPos[1]
          }, params.drag]];
        }

        var _one = function _one(_e) {
          var dragElement = _e[2].getDragElement();

          if (_e[1] != null) {
            // run the reported offset through the code that takes parent containers
            // into account, to adjust if necessary (issue 554)
            uip = _this.instance.getUIPosition([{
              el: dragElement,
              pos: [_e[1].left, _e[1].top]
            }]);

            if (_this._dragOffset) {
              uip.left += _this._dragOffset.left;
              uip.top += _this._dragOffset.top;
            }

            _this.instance._draw(dragElement, uip);

            _this.instance.fire(EVT_DRAG_STOP, {
              el: dragElement,
              e: params.e,
              pos: uip
            });
          }

          _this.instance.removeClass(_e[0], CLASS_DRAGGED);

          _this.instance.select({
            source: dragElement
          }).removeClass(_this.instance.elementDraggingClass + " " + _this.instance.sourceElementDraggingClass, true);

          _this.instance.select({
            target: dragElement
          }).removeClass(_this.instance.elementDraggingClass + " " + _this.instance.targetElementDraggingClass, true);
        };

        for (var i = 0; i < elements.length; i++) {
          _one(elements[i]);
        }

        if (this._intersectingGroups.length > 0) {
          // we only support one for the time being
          var targetGroup = this._intersectingGroups[0].group;
          var currentGroup = params.el._jsPlumbGroup;

          if (currentGroup !== targetGroup) {
            if (currentGroup != null) {
              if (currentGroup.overrideDrop(params.el, targetGroup)) {
                return;
              }
            }

            this.instance.groupManager.addToGroup(targetGroup, params.el, false);
          }
        }

        this._groupLocations.forEach(function (groupLoc) {
          _this.instance.removeClass(groupLoc.el, CLASS_DRAG_ACTIVE);

          _this.instance.removeClass(groupLoc.el, CLASS_DRAG_HOVER);
        });

        this._groupLocations.length = 0;
        this.instance.hoverSuspended = false;
        this.instance.isConnectionBeingDragged = false;
        this._dragOffset = null;
      }
    }, {
      key: "reset",
      value: function reset() {}
    }, {
      key: "init",
      value: function init(katavorioDraggable) {}
    }, {
      key: "onDrag",
      value: function onDrag(params) {
        var _this2 = this;

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

        var bounds = {
          x: ui.left,
          y: ui.top,
          w: elSize[0],
          h: elSize[1]
        }; // TODO  calculate if there is a target group

        this._groupLocations.forEach(function (groupLoc) {
          if (Biltong.intersects(bounds, groupLoc.r)) {
            _this2.instance.addClass(groupLoc.el, CLASS_DRAG_HOVER);

            _this2._intersectingGroups.push(groupLoc);
          } else {
            _this2.instance.removeClass(groupLoc.el, CLASS_DRAG_HOVER);
          }
        });

        this.instance._draw(el, ui, null);

        this.instance.fire(EVT_DRAG_MOVE, {
          el: el,
          e: params.e,
          pos: ui
        });
      }
    }, {
      key: "onStart",
      value: function onStart(params) {
        var _this3 = this;

        var el = params.drag.getDragElement();

        if (el._jsPlumbGroup) {
          this._dragOffset = this.instance.getOffset(el.offsetParent);
        }

        var cont = true;
        var nd = el.getAttribute(ATTR_NOT_DRAGGABLE);

        if (nd != null && nd !== "false") {
          cont = false;
        }

        if (cont) {
          this._groupLocations.length = 0;
          this._intersectingGroups.length = 0; // if drag el not a group

          if (!el._isJsPlumbGroup) {
            var isNotInAGroup = !el._jsPlumbGroup;
            var membersAreDroppable = isNotInAGroup || el._jsPlumbGroup.dropOverride !== true;
            var isGhostOrNotConstrained = !isNotInAGroup && (el._jsPlumbGroup.ghost || el._jsPlumbGroup.constrain !== true); // in order that there could be other groups this element can be dragged to, it must satisfy these conditions:
            // it's not in a group, OR
            // it hasnt mandated its element can't be dropped on other groups
            // it hasn't mandated its elements are constrained to the group, unless ghost proxying is turned on.

            if (isNotInAGroup || membersAreDroppable && isGhostOrNotConstrained) {
              this.instance.groupManager.forEach(function (group) {
                // prepare a list of potential droppable groups.
                if (group.droppable !== false && group.enabled !== false && group !== el._jsPlumbGroup) {
                  var groupEl = group.el,
                      s = _this3.instance.getSize(groupEl),
                      o = _this3.instance.getOffset(groupEl),
                      boundingRect = {
                    x: o.left,
                    y: o.top,
                    w: s[0],
                    h: s[1]
                  };

                  _this3._groupLocations.push({
                    el: groupEl,
                    r: boundingRect,
                    group: group
                  });

                  _this3.instance.addClass(groupEl, CLASS_DRAG_ACTIVE);
                }
              });
            }
          }

          this.instance.hoverSuspended = true;
          this.instance.select({
            source: el
          }).addClass(this.instance.elementDraggingClass + " " + this.instance.sourceElementDraggingClass, true);
          this.instance.select({
            target: el
          }).addClass(this.instance.elementDraggingClass + " " + this.instance.targetElementDraggingClass, true);
          this.instance.isConnectionBeingDragged = true;
          this.instance.fire(EVT_DRAG_START, {
            el: el,
            e: params.e
          });
        }

        return cont;
      }
    }]);

    return ElementDragHandler;
  }();

  var FloatingAnchor =
  /*#__PURE__*/
  function (_Anchor) {
    _inherits(FloatingAnchor, _Anchor);

    function FloatingAnchor(instance, params) {
      var _this;

      _classCallCheck(this, FloatingAnchor);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(FloatingAnchor).call(this, instance, params)); // this is the anchor that this floating anchor is referenced to for
      // purposes of calculating the orientation.

      _this.instance = instance;

      _defineProperty(_assertThisInitialized(_this), "ref", void 0);

      _defineProperty(_assertThisInitialized(_this), "refCanvas", void 0);

      _defineProperty(_assertThisInitialized(_this), "size", void 0);

      _defineProperty(_assertThisInitialized(_this), "xDir", void 0);

      _defineProperty(_assertThisInitialized(_this), "yDir", void 0);

      _defineProperty(_assertThisInitialized(_this), "_lastResult", void 0);

      _this.ref = params.reference; // the canvas this refers to.

      _this.refCanvas = params.referenceCanvas;
      _this.size = instance.getSize(_this.refCanvas); // these are used to store the current relative position of our
      // anchor wrt the reference anchor. they only indicate
      // direction, so have a value of 1 or -1 (or, very rarely, 0). these
      // values are written by the compute method, and read
      // by the getOrientation method.

      _this.xDir = 0;
      _this.yDir = 0; // temporary member used to store an orientation when the floating
      // anchor is hovering over another anchor.
      // clear from parent. we want floating anchor orientation to always be computed.

      _this.orientation = null;
      _this._lastResult = null; // set these to 0 each; they are used by certain types of connectors in the loopback case,
      // when the connector is trying to clear the element it is on. but for floating anchor it's not
      // very important.

      _this.x = 0;
      _this.y = 0;
      _this.isFloating = true;
      return _this;
    }

    _createClass(FloatingAnchor, [{
      key: "compute",
      value: function compute(params) {
        var xy = params.xy,
            result = [xy[0] + this.size[0] / 2, xy[1] + this.size[1] / 2, 0, 0]; // return origin of the element. we may wish to improve this so that any object can be the drag proxy.

        this._lastResult = result;
        return this._lastResult;
      }
    }, {
      key: "getOrientation",
      value: function getOrientation(_endpoint) {
        if (this.orientation) {
          return this.orientation;
        } else {
          var o = this.ref.getOrientation(_endpoint); // here we take into account the orientation of the other
          // anchor: if it declares zero for some direction, we declare zero too. this might not be the most awesome. perhaps we can come
          // up with a better way. it's just so that the line we draw looks like it makes sense. maybe this wont make sense.

          return [Math.abs(o[0]) * this.xDir * -1, Math.abs(o[1]) * this.yDir * -1];
        }
      }
      /**
       * notification the endpoint associated with this anchor is hovering
       * over another anchor; we want to assume that anchor's orientation
       * for the duration of the hover.
       */

    }, {
      key: "over",
      value: function over(anchor, endpoint) {
        this.orientation = anchor.getOrientation(endpoint);
      }
      /**
       * notification the endpoint associated with this anchor is no
       * longer hovering over another anchor; we should resume calculating
       * orientation as we normally do.
       */

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
    }); //setting the scope here should not be the way to fix that mootools issue.  it should be fixed by not
    // adding the floating endpoint as a droppable.  that makes more sense anyway!
    // TRANSIENT MANAGE

    var ep = instance.newEndpoint({
      paintStyle: paintStyle,
      endpoint: endpoint,
      anchor: floatingAnchor,
      source: sourceElement,
      scope: scope
    });
    ep.paint({});
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

  var EndpointDragHandler =
  /*#__PURE__*/
  function () {
    function EndpointDragHandler(instance) {
      _classCallCheck(this, EndpointDragHandler);

      this.instance = instance;

      _defineProperty(this, "jpc", void 0);

      _defineProperty(this, "existingJpc", void 0);

      _defineProperty(this, "ep", void 0);

      _defineProperty(this, "endpointRepresentation", void 0);

      _defineProperty(this, "existingJpcParams", void 0);

      _defineProperty(this, "placeholderInfo", {
        id: null,
        element: null
      });

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

      _defineProperty(this, "_mousedownHandler", void 0);

      _defineProperty(this, "_mouseupHandler", void 0);

      _defineProperty(this, "selector", ".jtk-endpoint");

      var container = instance.getContainer();
      var self = this;

      this._mousedownHandler = function (e) {
        if (e.which === 3 || e.button === 2) {
          return;
        }

        var targetEl = findParent(e.target || e.srcElement, "[jtk-managed]", container);

        if (targetEl == null) {
          return;
        }

        var elid = instance.getId(targetEl),
            sourceDef = self._getSourceDefinition(targetEl, e),
            sourceElement = e.currentTarget,
            def;

        if (sourceDef) {
          consume(e);
          def = sourceDef.def; // if maxConnections reached

          var sourceCount = instance.select({
            source: elid
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
          } // find the position on the element at which the mouse was pressed; this is where the endpoint
          // will be located.


          var elxy = instance.getPositionOnElement(e, targetEl, instance.getZoom()); // we need to override the anchor in here, and force 'isSource', but we don't want to mess with
          // the params passed in, because after a connection is established we're going to reset the endpoint
          // to have the anchor we were given.

          var tempEndpointParams = {};
          extend(tempEndpointParams, def);
          tempEndpointParams.isTemporarySource = true;
          tempEndpointParams.anchor = [elxy[0], elxy[1], 0, 0];

          if (def.scope) {
            tempEndpointParams.scope = def.scope;
          }

          this.ep = instance.addEndpoint(elid, tempEndpointParams);
          this.ep.deleteOnEmpty = true; // keep a reference to the anchor we want to use if the connection is finalised.

          this.ep._originalAnchor = def.anchor || instance.Defaults.anchor; // if unique endpoint and it's already been created, push it onto the endpoint we create. at the end
          // of a successful connection we'll switch to that endpoint.
          // TODO this is the same code as the programmatic endpoints create on line 1050 ish

          if (def.uniqueEndpoint) {
            if (!def.endpoint) {
              def.endpoint = this.ep;
              this.ep.deleteOnEmpty = false;
            } else {
              this.ep.finalEndpoint = def.endpoint;
            }
          } // add to the list of endpoints that are a candidate for deletion if no activity has occurred on them.


          sourceElement._jsPlumbOrphanedEndpoints = sourceElement._jsPlumbOrphanedEndpoints || [];

          sourceElement._jsPlumbOrphanedEndpoints.push(this.ep); // optionally check for attributes to extract from the source element


          var payload = {};

          if (def.extract) {
            for (var att in def.extract) {
              var v = targetEl.getAttribute(att);

              if (v) {
                payload[def.extract[att]] = v;
              }
            }
          } // and then trigger its mousedown event, which will kick off a drag, which will start dragging
          // a new connection from this endpoint.


          instance.trigger(this.ep.endpoint.renderer.getElement(), EVT_MOUSEDOWN, e, payload);
          consume(e);
        }
      };

      instance.on(container, EVT_MOUSEDOWN, "[jtk-source]", this._mousedownHandler); //
      // cleans up any endpoints added from a mousedown on a source that did not result in a connection drag
      // replaces what in previous versions was a mousedown/mouseup handler per element.
      //

      this._mouseupHandler = function (e) {
        console.log("a mouse up event occurred on a source element");
        console.dir(e);
        var el = e.currentTarget || e.srcElement;

        if (el._jsPlumbOrphanedEndpoints) {
          each(el._jsPlumbOrphanedEndpoints, function (ep) {
            if (!ep.deleteOnEmpty && ep.connections.length === 0) {
              instance.deleteEndpoint(ep);
            }
          });
          el._jsPlumbOrphanedEndpoints.length = 0;
        }
      };

      instance.on(container, "mouseup", "[jtk-source]", this._mouseupHandler);
    }

    _createClass(EndpointDragHandler, [{
      key: "_makeDraggablePlaceholder",
      value: function _makeDraggablePlaceholder(ipco, ips) {
        this.placeholderInfo = this.placeholderInfo || {};
        var n = this.instance.createElement("div", {
          position: "absolute"
        });
        this.instance.appendElement(n);
        var id = this.instance.getId(n);
        this.instance.setPosition(n, ipco);
        n.style.width = ips[0] + "px";
        n.style.height = ips[1] + "px";
        this.instance.manage(id, n); // TRANSIENT MANAGE
        // create and assign an id, and initialize the offset.

        this.placeholderInfo.id = id;
        this.placeholderInfo.element = n;
        return n;
      }
    }, {
      key: "_cleanupDraggablePlaceholder",
      value: function _cleanupDraggablePlaceholder() {
        if (this.placeholderInfo.element) {
          this.instance.unmanage(this.placeholderInfo.id);
          this.instance.removeElement(this.placeholderInfo.element);
          delete this.placeholderInfo.element;
          delete this.placeholderInfo.id;
        }
      }
    }, {
      key: "reset",
      value: function reset() {
        this.instance.off(this.instance.getContainer(), EVT_MOUSEUP, this._mouseupHandler);
        this.instance.off(this.instance.getContainer(), EVT_MOUSEDOWN, this._mousedownHandler);
      }
    }, {
      key: "init",
      value: function init(katavorioDraggable) {}
    }, {
      key: "onStart",
      value: function onStart(p) {
        var _this = this;

        this.currentDropTarget = null;
        this._stopped = false;
        var dragEl = p.drag.getDragElement();
        this.ep = dragEl._jsPlumb.endpoint;
        this.endpointRepresentation = dragEl._jsPlumb.ep;

        if (!this.ep) {
          return false;
        }

        this.jpc = this.ep.connectorSelector(); // -------------------------------- now a bunch of tests about whether or not to proceed -------------------------

        var _continue = true; // if not enabled, return

        if (!this.ep.isEnabled()) {
          _continue = false;
        } // if no connection and we're not a source - or temporarily a source, as is the case with makeSource - return.


        if (this.jpc == null && !this.ep.isSource && !this.ep.isTemporarySource) {
          _continue = false;
        } // otherwise if we're full and not allowed to drag, also return false.


        if (this.ep.isSource && this.ep.isFull() && !(this.jpc != null && this.ep.dragAllowedWhenFull)) {
          _continue = false;
        } // if the connection was setup as not detachable or one of its endpoints
        // was setup as connectionsDetachable = false, or Defaults.connectionsDetachable
        // is set to false...


        if (this.jpc != null && !this.jpc.isDetachable(this.ep)) {
          // .. and the endpoint is full
          if (this.ep.isFull()) {
            _continue = false;
          } else {
            // otherwise, if not full, set the connection to null, and we will now proceed
            // to drag a new connection.
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
        } // else we might have been given some data. we'll pass it in to a new connection as 'data'.
        // here we also merge in the optional payload we were given on mousedown.
        else if (_typeof(beforeDrag) === "object") {
            extend(beforeDrag, this.payload || {});
          } else {
            // or if no beforeDrag data, maybe use the payload on its own.
            beforeDrag = this.payload || {};
          }

        if (_continue === false) {
          this._stopped = true;
          return false;
        } // ---------------------------------------------------------------------------------------------------------------------
        // ok to proceed.
        // clear hover for all connections for this endpoint before continuing.


        for (var i = 0; i < this.ep.connections.length; i++) {
          this.ep.connections[i].setHover(false);
        } // clear this list. we'll reconstruct it based on whether its an existing or new connection.s


        this.endpointDropTargets.length = 0;
        this.ep.addClass("endpointDrag");
        this.instance.isConnectionBeingDragged = true; // if we're not full but there was a connection, make it null. we'll create a new one.

        if (this.jpc && !this.ep.isFull() && this.ep.isSource) {
          this.jpc = null;
        }

        this.instance.updateOffset({
          elId: this.ep.elementId
        }); // ----------------    make the element we will drag around, and position it -----------------------------

        var canvasElement = this.endpointRepresentation.renderer.canvas,
            ipco = this.instance.getOffset(canvasElement),
            ips = this.instance.getSize(canvasElement);

        this._makeDraggablePlaceholder(ipco, ips); // store the id of the dragging div and the source element. the drop function will pick these up.


        this.instance.setAttributes(canvasElement, {
          "dragId": this.placeholderInfo.id,
          "elId": this.ep.elementId
        }); // ------------------- create an endpoint that will be our floating endpoint ------------------------------------

        var endpointToFloat = this.ep.dragProxy || this.ep.endpoint;

        if (this.ep.dragProxy == null && this.ep.connectionType != null) {
          var aae = this.instance.deriveEndpointAndAnchorSpec(this.ep.connectionType);

          if (aae.endpoints[1]) {
            endpointToFloat = aae.endpoints[1];
          }
        }

        var centerAnchor = this.instance.makeAnchor("Center");
        centerAnchor.isFloating = true;
        this.floatingEndpoint = _makeFloatingEndpoint(this.ep.getPaintStyle(), centerAnchor, endpointToFloat, canvasElement, this.placeholderInfo.element, this.instance, this.ep.scope);
        var _savedAnchor = this.floatingEndpoint.anchor;
        this.floatingElement = this.floatingEndpoint.endpoint.renderer.getElement();
        var scope = this.ep._jsPlumb.scope;
        var boundingRect; // get the list of potential drop targets for this endpoint, which excludes the source of the new connection.

        this.instance.getSelector(this.instance.getContainer(), ".jtk-endpoint[jtk-scope-" + this.ep.scope + "]").forEach(function (candidate) {
          //if (candidate !== this.ep.canvas && candidate !== _currentInstance.floatingEndpoint.canvas) {
          if ((_this.jpc != null || candidate !== canvasElement) && candidate !== _this.floatingElement) {
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
              endpoint: candidate._jsPlumb
            });

            _this.instance.addClass(candidate,
            /*this.instance.Defaults.dropOptions.activeClass ||*/
            "jtk-drag-active"); // TODO get from defaults.

          }
        }); // at this point we are in fact uncertain about whether or not the given endpoint is a source/target. it may not have been
        // specifically configured as one

        var selectors = []; //,
        // this.epIsSource = this.ep.isSource || (existingthis.jpc && this.jpc.endpoints[0] === this.ep),
        // this.epIsTarget = this.ep.isTarget || (existingthis.jpc && this.jpc.endpoints[1] === this.ep);
        // if (this.epIsSource) {

        selectors.push("[jtk-target][jtk-scope-" + this.ep.scope + "]"); //}
        //if (this.epIsTarget) {

        selectors.push("[jtk-source][jtk-scope-" + this.ep.scope + "]"); //}

        this.instance.getSelector(this.instance.getContainer(), selectors.join(",")).forEach(function (candidate) {
          //if (candidate !== this.ep.element) {
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
          }; // targetDefinitionIdx = -1,
          // sourceDefinitionIdx = -1;
          //  if (this.epIsSource) {
          // look for at least one target definition that is not disabled on the given element.

          var targetDefinitionIdx = findWithFunction(candidate._jsPlumbTargetDefinitions, function (tdef) {
            return tdef.enabled !== false;
          }); //}
          //if (this.epIsTarget) {
          // look for at least one target definition that is not disabled on the given element.

          var sourceDefinitionIdx = findWithFunction(candidate._jsPlumbSourceDefinitions, function (tdef) {
            return tdef.enabled !== false;
          }); //}
          // if there is at least one enabled target definition (if appropriate), add this element to the drop targets

          if (targetDefinitionIdx !== -1) {
            if (candidate._jsPlumbTargetDefinitions[targetDefinitionIdx].def.rank != null) {
              d.rank = candidate._jsPlumbTargetDefinitions[targetDefinitionIdx].def.rank;
            }

            _this.endpointDropTargets.push(d);

            _this.instance.addClass(candidate,
            /*this.instance.Defaults.dropOptions.activeClass || */
            "jtk-drag-active"); // TODO get from defaults.

          } // if there is at least one enabled source definition (if appropriate), add this element to the drop targets


          if (sourceDefinitionIdx !== -1) {
            if (candidate._jsPlumbSourceDefinitions[sourceDefinitionIdx].def.rank != null) {
              d.rank = candidate._jsPlumbSourceDefinitions[sourceDefinitionIdx].def.rank;
            }

            _this.endpointDropTargets.push(d);

            _this.instance.addClass(candidate,
            /*this.instance.Defaults.dropOptions.activeClass ||*/
            "jtk-drag-active"); // TODO get from defaults.

          } //}

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
              }
            } else {
              return 0;
            }
          }
        });
        this.ep.setHover(false, false);

        if (this.jpc == null) {
          // create a connection. one end is this endpoint, the other is a floating endpoint.
          // TODO - get
          this.jpc = this.instance._newConnection({
            sourceEndpoint: this.ep,
            targetEndpoint: this.floatingEndpoint,
            source: this.ep.element,
            // for makeSource with parent option.  ensure source element is rthis.epresented correctly.
            target: this.placeholderInfo.element,
            anchors: [this.ep.anchor, this.floatingEndpoint.anchor],
            paintStyle: this.ep.connectorStyle,
            // this can be null. Connection will use the default.
            hoverPaintStyle: this.ep.connectorHoverStyle,
            connector: this.ep.connector,
            // this can also be null. Connection will use the default.
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
          this.floatingEndpoint.anchor = _savedAnchor; // fire an event that informs that a connection is being dragged

          this.instance.fire("connectionDrag", this.jpc); // register the new connection on the drag manager. This connection, at this point, is 'pending',
          // and has as its target a temporary element (the 'placeholder'). If the connection subsequently
          // becomes established, the anchor manager is informed that the target of the connection has
          // changed.
          // TODO is this still necessary.

          this.instance.anchorManager.newConnection(this.jpc);
        } else {
          // get the list of potential drop targets for this endpoint, which includes the this.ep from which the connection has been dragged?
          // TODO
          // Array.prototype.push.apply(endpointDropTargets, _currentInstance.getSelector(_currentInstance.getContainer(), ".jtk-endpoint[jtk-scope-" + this.ep.scope + "]"));
          // endpointDropTargets = endpointDropTargets.filter(function(candidate) { return candidate !== this.ep.canvas; });
          // console.log(endpointDropTargets);
          this.existingJpc = true;
          this.jpc.setHover(false); // new anchor idx

          var anchorIdx = this.jpc.endpoints[0].id === this.ep.id ? 0 : 1;
          this.ep.detachFromConnection(this.jpc, null, true); // detach from the connection while dragging is occurring. but dont cleanup automatically.
          // store the original scope (issue 57)

          var dragScope = this.instance.getDragScope(canvasElement);
          this.instance.setAttribute(this.ep.endpoint.renderer.getElement(), "originalScope", dragScope); // fire an event that informs that a connection is being dragged. we do this before
          // rthis.eplacing the original target with the floating element info.

          this.instance.fire("connectionDrag", this.jpc); // now we rthis.eplace ourselves with the temporary div we created above:

          if (anchorIdx === 0) {
            this.existingJpcParams = [this.jpc.source, this.jpc.sourceId, canvasElement, dragScope];
            this.instance.anchorManager.sourceChanged(this.jpc.endpoints[anchorIdx].elementId, this.placeholderInfo.id, this.jpc, this.placeholderInfo.element);
          } else {
            this.existingJpcParams = [this.jpc.target, this.jpc.targetId, canvasElement, dragScope];
            this.jpc.target = this.placeholderInfo.element;
            this.jpc.targetId = this.placeholderInfo.id;
            this.instance.anchorManager.updateOtherEndpoint(this.jpc.sourceId, this.jpc.endpoints[anchorIdx].elementId, this.jpc.targetId, this.jpc);
          } // store the original endpoint and assign the new floating endpoint for the drag.


          this.jpc.suspendedEndpoint = this.jpc.endpoints[anchorIdx]; // PROVIDE THE SUSPENDED ELEMENT, BE IT A SOURCE OR TARGET (ISSUE 39)

          this.jpc.suspendedElement = this.jpc.endpoints[anchorIdx].element;
          this.jpc.suspendedElementId = this.jpc.endpoints[anchorIdx].elementId;
          this.jpc.suspendedElementType = anchorIdx === 0 ? "source" : "target";
          this.jpc.suspendedEndpoint.setHover(false);
          this.floatingEndpoint.referenceEndpoint = this.jpc.suspendedEndpoint;
          this.jpc.endpoints[anchorIdx] = this.floatingEndpoint;
          this.jpc.addClass(this.instance.draggingClass);
          this.jpc.floatingIndex = anchorIdx;
          this.jpc.floatingEndpoint = this.floatingEndpoint;
          this.jpc.floatingId = this.placeholderInfo.id;
          this.jpc.floatingEndpoint.addClass(this.instance.draggingClass);
        }

        this._registerFloatingConnection(this.placeholderInfo, this.jpc, this.floatingEndpoint); // tell jsplumb about it


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
          var _ui = {
            left: params.pos[0],
            top: params.pos[1]
          };
          this.instance.repaint(this.placeholderInfo.element, _ui);

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
            if (Biltong.intersects(boundingRect, this.endpointDropTargets[i].r)) {
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
              _cont = newDropTarget.endpoint.endpoint.isTarget && idx !== 0 || this.jpc.suspendedEndpoint && newDropTarget.endpoint.endpoint.referenceEndpoint && newDropTarget.endpoint.endpoint.referenceEndpoint.id === this.jpc.suspendedEndpoint.id;

              if (_cont) {
                var bb = this.instance.checkCondition("checkDropAllowed", {
                  sourceEndpoint: this.jpc.endpoints[idx],
                  targetEndpoint: newDropTarget.endpoint.endpoint,
                  connection: this.jpc
                });
                newDropTarget.endpoint.endpoint[(bb ? "add" : "remove") + "Class"](this.instance.endpointDropAllowedClass);
                newDropTarget.endpoint.endpoint[(bb ? "remove" : "add") + "Class"](this.instance.endpointDropForbiddenClass);
                this.jpc.endpoints[idx].anchor.over(newDropTarget.endpoint.endpoint.anchor, newDropTarget.endpoint.endpoint);
              }
            }
          }

          this.currentDropTarget = newDropTarget; // always repaint the source endpoint, because only continuous/dynamic anchors cause the endpoint
          // to be repainted, so static anchors need to be told (or the endpoint gets dragged around)

          this.ep.paint({
            anchorLoc: this.ep.anchor.getCurrentLocation({
              element: this.ep
            })
          });
        }
      }
    }, {
      key: "maybeCleanup",
      value: function maybeCleanup(ep) {
        if (ep._mtNew && ep.connections.length === 0) {
          this.instance.deleteObject({
            endpoint: ep
          });
        } else {
          delete ep._mtNew;
        }
      }
    }, {
      key: "_reattachOrDiscard",
      value: function _reattachOrDiscard(originalEvent) {
        var existingConnection = this.jpc.suspendedEndpoint != null;
        var idx = this.getFloatingAnchorIndex(this.jpc); // if no drop target,

        if (existingConnection && this._shouldReattach(originalEvent)) {
          if (idx === 0) {
            this.jpc.source = this.jpc.suspendedElement;
            this.jpc.sourceId = this.jpc.suspendedElementId;
          } else {
            this.jpc.target = this.jpc.suspendedElement;
            this.jpc.targetId = this.jpc.suspendedElementId;
          } // is this an existing connection? try to reattach, if desired.
          //this._maybeReattach(idx, originalEvent);


          this._doForceReattach(idx, originalEvent);
        } else {
          // otherwise throw it away (and throw away any endpoints attached to it that should be thrown away when they are no longer
          // connected to any edges.
          this._discard(idx, originalEvent);
        }
      }
    }, {
      key: "onStop",
      value: function onStop(p) {
        var originalEvent = p.e;
        console.log("drag ended on endpoint");
        this.instance.isConnectionBeingDragged = false;

        if (this.jpc && this.jpc.endpoints != null) {
          var existingConnection = this.jpc.suspendedEndpoint != null;
          var idx = this.getFloatingAnchorIndex(this.jpc);
          var suspendedEndpoint = this.jpc.suspendedEndpoint;
          var dropEndpoint; // 1. is there a drop target?

          if (this.currentDropTarget != null) {
            // get the drop endpoint.
            dropEndpoint = this._getDropEndpoint(p, this.jpc);

            if (dropEndpoint == null) {
              // no drop endpoint resolved. either reattach, or discard.
              this._reattachOrDiscard(p.e);
            } else {
              // if we are dropping back on the original endpoint, force a reattach.
              if (suspendedEndpoint && suspendedEndpoint.id === dropEndpoint.id) {
                //this.jpc._forceReattach = true;
                //this._maybeReattach(idx, originalEvent);
                this._doForceReattach(idx, originalEvent);
              } else {
                if (!dropEndpoint.isEnabled()) {
                  // if endpoint disabled, either reattach or discard
                  this._reattachOrDiscard(p.e);
                } else if (dropEndpoint.isFull()) {
                  // if endpoint full, fire an event, then either reattach or discard
                  dropEndpoint.fire(EVENT_MAX_CONNECTIONS, {
                    endpoint: this,
                    connection: this.jpc,
                    maxConnections: this.instance.Defaults.maxConnections
                  }, originalEvent);

                  this._reattachOrDiscard(p.e);
                } else {
                  if (idx === 0) {
                    this.jpc.floatingElement = this.jpc.source;
                    this.jpc.floatingId = this.jpc.sourceId;
                    this.jpc.floatingEndpoint = this.jpc.endpoints[0];
                    this.jpc.floatingIndex = 0;
                    this.jpc.source = dropEndpoint.element;
                    this.jpc.sourceId = dropEndpoint.elementId;
                  } else {
                    this.jpc.floatingElement = this.jpc.target;
                    this.jpc.floatingId = this.jpc.targetId;
                    this.jpc.floatingEndpoint = this.jpc.endpoints[1];
                    this.jpc.floatingIndex = 1;
                    this.jpc.target = dropEndpoint.element;
                    this.jpc.targetId = dropEndpoint.elementId;
                  }

                  var _doContinue = true;
                  /*
                      if this is an existing connection and detach is not allowed we won't continue. The connection's
                      endpoints have been reinstated; everything is back to how it was.
                  */

                  if (existingConnection && this.jpc.suspendedEndpoint.id !== dropEndpoint.id) {
                    if (!this.jpc.isDetachAllowed(this.jpc) || !this.jpc.endpoints[idx].isDetachAllowed(this.jpc) || !this.jpc.suspendedEndpoint.isDetachAllowed(this.jpc) || !this.instance.checkCondition("beforeDetach", this.jpc)) {
                      _doContinue = false;
                    }
                  }
                  /*
                      now check beforeDrop.  this will be available only on Endpoints that are setup to
                      have a beforeDrop condition (although, secretly, under the hood all Endpoints and
                      the Connection have them, because they are on jsPlumbUIComponent.  shhh!), because
                      it only makes sense to have it on a target endpoint.
                  */


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
            // no drop target: either reattach, or discard.
            this._reattachOrDiscard(p.e);
          } // common clean up


          this.instance.deleteObject({
            endpoint: this.floatingEndpoint
          });

          this._cleanupDraggablePlaceholder();

          delete this.jpc.suspendedEndpoint;
          delete this.jpc.suspendedElement;
          delete this.jpc.suspendedElementType;
          delete this.jpc.suspendedElementId;
          delete this.jpc.suspendedIndex;
          delete this.jpc.floatingElement;
          delete this.jpc.floatingEndpoint;
          delete this.jpc.floatingId;
          delete this.jpc.floatingIndex;

          if (dropEndpoint != null) {
            this.maybeCleanup(dropEndpoint);
            /* makeTarget sets this flag, to tell us we have been replaced and should delete this object. */

            if (dropEndpoint.deleteAfterDragStop) {
              this.instance.deleteObject({
                endpoint: dropEndpoint
              });
            } else {
              if (dropEndpoint._jsPlumb) {
                dropEndpoint.paint({
                  recalc: false
                });
              }
            }
          }
        }
      }
    }, {
      key: "_getSourceDefinition",
      value: function _getSourceDefinition(fromElement, evt) {
        var sourceDef;

        if (fromElement._jsPlumbSourceDefinitions) {
          for (var i = 0; i < fromElement._jsPlumbSourceDefinitions.length; i++) {
            sourceDef = fromElement._jsPlumbSourceDefinitions[i];

            if (sourceDef.enabled !== false) {
              if (sourceDef.def.filter) {
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
          // find a suitable target definition, by matching the source of the drop element with the targets registered on the
          // drop target, and also the floating index (if set) of the connection
          var targetDefinition = jpc.floatingIndex == null || jpc.floatingIndex === 1 ? this._getTargetDefinition(this.currentDropTarget.el, p.e) : null; // need to figure the conditions under which each of these should be tested

          if (targetDefinition == null) {
            targetDefinition = jpc.floatingIndex == null || jpc.floatingIndex === 0 ? this._getSourceDefinition(this.currentDropTarget.el, p.e) : null;
          }

          if (targetDefinition == null) {
            return null;
          } // if no cached endpoint, or there was one but it has been cleaned up
          // (ie. detached), create a new one


          var eps = this.instance.deriveEndpointAndAnchorSpec(jpc.getType().join(" "), true);
          var pp = eps.endpoints ? extend(p, {
            endpoint: targetDefinition.def.endpoint || eps.endpoints[1]
          }) : p;

          if (eps.anchors) {
            pp = extend(pp, {
              anchor: targetDefinition.def.anchor || eps.anchors[1]
            });
          }

          dropEndpoint = this.instance.addEndpoint(this.currentDropTarget.el, pp);
          dropEndpoint._mtNew = true;
          dropEndpoint.deleteOnEmpty = true;

          if (dropEndpoint.anchor.positionFinder != null) {
            var dropPosition = this.instance.getUIPosition(arguments),
                elPosition = this.instance.getOffset(this.currentDropTarget.el),
                elSize = this.instance.getSize(this.currentDropTarget.el),
                ap = dropPosition == null ? [0, 0] : dropEndpoint.anchor.positionFinder(dropPosition, elPosition, elSize, dropEndpoint.anchor.constructorParams);
            dropEndpoint.anchor.x = ap[0];
            dropEndpoint.anchor.y = ap[1]; // now figure an orientation for it..kind of hard to know what to do actually. probably the best thing i can do is to
            // support specifying an orientation in the anchor's spec. if one is not supplied then i will make the orientation
            // be what will cause the most natural link to the source: it will be pointing at the source, but it needs to be
            // specified in one axis only, and so how to make that choice? i think i will use whichever axis is the one in which
            // the target is furthest away from the source.
          }
        } else {
          dropEndpoint = this.currentDropTarget.endpoint.endpoint;
        }

        if (dropEndpoint) {
          dropEndpoint.removeClass(this.instance.endpointDropAllowedClass);
          dropEndpoint.removeClass(this.instance.endpointDropForbiddenClass);
        }

        return dropEndpoint;
      }
    }, {
      key: "_doForceReattach",
      value: function _doForceReattach(idx, originalEvent) {
        this.jpc.endpoints[idx] = this.jpc.suspendedEndpoint;
        this.jpc.setHover(false);
        this.jpc._forceDetach = true;

        if (idx === 0) {
          this.jpc.source = this.jpc.suspendedEndpoint.element;
          this.jpc.sourceId = this.jpc.suspendedEndpoint.elementId;
        } else {
          this.jpc.target = this.jpc.suspendedEndpoint.element;
          this.jpc.targetId = this.jpc.suspendedEndpoint.elementId;
        }

        this.jpc.suspendedEndpoint.addConnection(this.jpc); // TODO checkSanity

        if (idx === 1) {
          this.instance.anchorManager.updateOtherEndpoint(this.jpc.sourceId, this.jpc.floatingId, this.jpc.targetId, this.jpc);
        } else {
          this.instance.anchorManager.sourceChanged(this.jpc.floatingId, this.jpc.sourceId, this.jpc, this.jpc.source);
        }

        this.instance.repaint(this.jpc.sourceId);
        delete this.jpc._forceDetach;
      }
    }, {
      key: "_shouldReattach",
      value: function _shouldReattach(originalEvent) {
        //return this.jpc.isReattach() || this.jpc._forceReattach || !this.instance.deleteConnection(this.jpc, {originalEvent: originalEvent});
        return this.jpc.isReattach() || this.jpc._forceReattach || !functionChain(true, false, [[this.jpc.endpoints[0], IS_DETACH_ALLOWED, [this.jpc]], [this.jpc.endpoints[1], IS_DETACH_ALLOWED, [this.jpc]], [this.jpc, IS_DETACH_ALLOWED, [this.jpc]], [this.instance, CHECK_CONDITION, [BEFORE_DETACH, this.jpc]]]);
      }
    }, {
      key: "_maybeReattach",
      value: function _maybeReattach(idx, originalEvent) {
        this.jpc.setHover(false);

        if (this.jpc.suspendedEndpoint) {
          // this.jpc._forceDetach ||  <-- why was this one of the tests in the line below?
          if (this.jpc.isReattach() || this.jpc._forceReattach || !this.instance.deleteConnection(this.jpc, {
            originalEvent: originalEvent
          })) {
            var floatingId;
            this.jpc.endpoints[idx] = this.jpc.suspendedEndpoint;
            this.jpc.setHover(false);
            this.jpc._forceDetach = true;

            if (idx === 0) {
              floatingId = this.jpc.sourceId;
              this.jpc.source = this.jpc.suspendedEndpoint.element;
              this.jpc.sourceId = this.jpc.suspendedEndpoint.elementId;
            } else {
              floatingId = this.jpc.targetId;
              this.jpc.target = this.jpc.suspendedEndpoint.element;
              this.jpc.targetId = this.jpc.suspendedEndpoint.elementId;
            }

            this.jpc.suspendedEndpoint.addConnection(this.jpc); // TODO checkSanity

            if (idx === 1) {
              this.instance.anchorManager.updateOtherEndpoint(this.jpc.sourceId, this.jpc.floatingId, this.jpc.targetId, this.jpc);
            } else {
              this.instance.anchorManager.sourceChanged(this.jpc.floatingId, this.jpc.sourceId, this.jpc, this.jpc.source);
            }

            this.instance.repaint(this.jpc.sourceId);
            this.jpc._forceDetach = false;
          }
        } else {
          this.instance.deleteObject({
            endpoint: this.jpc.endpoints[idx],
            originalEvent: originalEvent
          });

          if (this.jpc.pending) {
            // this.jpc.endpoints[idx === 1 ? 0 : 1].detachFromConnection(this.jpc);
            // this.instance.deleteObject({connection: this.jpc});
            this.instance.fire("connectionAborted", this.jpc, originalEvent);
          }
        }
      }
    }, {
      key: "_discard",
      value: function _discard(idx, originalEvent) {
        if (this.jpc.pending) {
          this.instance.fire("connectionAborted", this.jpc, originalEvent);
        } else {
          if (idx === 0) {
            this.jpc.source = this.jpc.suspendedEndpoint.element;
            this.jpc.sourceId = this.jpc.suspendedEndpoint.elementId;
          } else {
            this.jpc.target = this.jpc.suspendedEndpoint.element;
            this.jpc.targetId = this.jpc.suspendedEndpoint.elementId;
          }

          this.jpc.endpoints[idx] = this.jpc.suspendedEndpoint;
        } //this.instance.deleteObject({connection: this.jpc});


        if (this.jpc.floatingEndpoint) {
          this.jpc.floatingEndpoint.detachFromConnection(this.jpc); //delete this.jpc.floatingEndpoint;
        }

        this.instance.deleteObject({
          connection: this.jpc,
          originalEvent: originalEvent
        }); //console.log("placeholder..we're discarding the connection here");
      } //
      // drops the current connection on the given endpoint
      //

    }, {
      key: "_drop",
      value: function _drop(dropEndpoint, idx, originalEvent, optionalData) {
        // remove this jpc from the current endpoint, which is a floating endpoint that we will
        // subsequently discard.
        this.jpc.endpoints[idx].detachFromConnection(this.jpc); // if there's a suspended endpoint, detach it from the connection.

        if (this.jpc.suspendedEndpoint) {
          this.jpc.suspendedEndpoint.detachFromConnection(this.jpc);
        }

        this.jpc.endpoints[idx] = dropEndpoint;
        dropEndpoint.addConnection(this.jpc); // copy our parameters in to the connection:

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
          this.instance.anchorManager.updateOtherEndpoint(this.jpc.sourceId, this.jpc.floatingId, this.jpc.targetId, this.jpc);
        } else {
          this.instance.anchorManager.sourceChanged(this.jpc.floatingId, this.jpc.sourceId, this.jpc, this.jpc.source);
        } // when makeSource has uniqueEndpoint:true, we want to create connections with new endpoints
        // that are subsequently deleted. So makeSource sets `finalEndpoint`, which is the Endpoint to
        // which the connection should be attached. The `detachFromConnection` call below results in the
        // temporary endpoint being cleaned up.


        if (this.jpc.endpoints[0].finalEndpoint) {
          var _toDelete = this.jpc.endpoints[0];

          _toDelete.detachFromConnection(this.jpc);

          this.jpc.endpoints[0] = this.jpc.endpoints[0].finalEndpoint;
          this.jpc.endpoints[0].addConnection(this.jpc);
        } // if optionalData was given, merge it onto the connection's data.


        if (IS.anObject(optionalData)) {
          this.jpc.mergeData(optionalData);
        }

        if (this.jpc.endpoints[0]._originalAnchor) {
          var newSourceAnchor = this.instance.makeAnchor(this.jpc.endpoints[0]._originalAnchor, this.jpc.endpoints[0].elementId);
          this.jpc.endpoints[0].setAnchor(newSourceAnchor, true);
          delete this.jpc.endpoints[0]._originalAnchor;
        } // finalise will inform the anchor manager and also add to
        // connectionsByScope if necessary.


        this.instance._finaliseConnection(this.jpc, null, originalEvent, false);

        this.jpc.setHover(false); // SP continuous anchor flush

        this.instance.revalidate(this.jpc.endpoints[0].element);
      }
    }, {
      key: "_registerFloatingConnection",
      value: function _registerFloatingConnection(info, conn, ep) {
        this.floatingConnections[info.id] = conn; // only register for the target endpoint; we will not be dragging the source at any time
        // before this connection is either discarded or made into a permanent connection.

        addToList(this.instance.endpointsByElement, info.id, ep); // this.getFloatingConnectionFor = function(id) {
        //     return floatingConnections[id];
        // };
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
  /*#__PURE__*/
  function (_ElementDragHandler) {
    _inherits(GroupDragHandler, _ElementDragHandler);

    function GroupDragHandler(instance) {
      var _this;

      _classCallCheck(this, GroupDragHandler);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(GroupDragHandler).call(this, instance));
      _this.instance = instance;

      _defineProperty(_assertThisInitialized(_this), "selector", "> [jtk-group] [jtk-managed]");

      _defineProperty(_assertThisInitialized(_this), "katavorioDraggable", void 0);

      _defineProperty(_assertThisInitialized(_this), "doRevalidate", void 0);

      _this.doRevalidate = _this._revalidate.bind(_assertThisInitialized(_this));
      return _this;
    }

    _createClass(GroupDragHandler, [{
      key: "reset",
      value: function reset() {
        this.katavorioDraggable.off(EVT_REVERT, this.doRevalidate);
      }
    }, {
      key: "_revalidate",
      value: function _revalidate(el) {
        this.instance.revalidate(el);
      }
    }, {
      key: "init",
      value: function init(katavorioDraggable) {
        this.katavorioDraggable = katavorioDraggable;
        katavorioDraggable.on(EVT_REVERT, this.doRevalidate);
      }
    }, {
      key: "useGhostProxy",
      value: function useGhostProxy(container, dragEl) {
        var group = dragEl[GROUP_KEY];
        return group == null ? false : group.ghost === true;
      }
    }, {
      key: "makeGhostProxy",
      value: function makeGhostProxy(el) {
        var newEl = el.cloneNode(true);
        newEl[GROUP_KEY] = el[GROUP_KEY];
        return newEl;
      }
    }, {
      key: "onDrag",
      value: function onDrag(params) {
        console.log("on drag, inside a group");

        _get(_getPrototypeOf(GroupDragHandler.prototype), "onDrag", this).call(this, params);
      }
    }, {
      key: "onStop",
      value: function onStop(params) {
        var originalGroup = params.el[GROUP_KEY],
            out = _get(_getPrototypeOf(GroupDragHandler.prototype), "onStop", this).call(this, params),
            currentGroup = params.el[GROUP_KEY];

        if (currentGroup === originalGroup) {
          this._pruneOrOrphan(params);
        } else {
          if (originalGroup.ghost) {
            var o1 = this.instance.getOffset(currentGroup.getDragArea());
            var o2 = this.instance.getOffset(originalGroup.getDragArea());
            var o = {
              left: o2.left + params.pos[0] - o1.left,
              top: o2.top + params.pos[1] - o1.top
            };
            var originalElement = params.drag.getDragElement(true);
            originalElement.style.left = o.left + "px";
            originalElement.style.top = o.top + "px";
            this.instance.revalidate(originalElement);
          }
        }

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
        var orphanedPosition = null;

        if (!this._isInsideParent(params.el, params.pos)) {
          var group = params.el[GROUP_KEY];

          if (group.prune) {
            this.instance.remove(params.el);
            group.remove(params.el);
          } else if (group.orphan) {
            orphanedPosition = this.instance.groupManager.orphan(params.el);
            group.remove(params.el);
          }
        }

        return orphanedPosition;
      }
    }]);

    return GroupDragHandler;
  }(ElementDragHandler);

  function _setClassName(el, cn, classList) {
    cn = fastTrim(cn);

    if (typeof el.className.baseVal !== "undefined") {
      el.className.baseVal = cn;
    } else {
      el.className = cn;
    } // recent (i currently have  61.0.3163.100) version of chrome do not update classList when you set the base val
    // of an svg element's className. in the long run we'd like to move to just using classList anyway


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
      // not fatal
      log("JSPLUMB: cannot set class list", e);
    }
  } //
  // get the class name for either an html element or an svg element.


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

  function _genLoc(prefix, e) {
    if (e == null) {
      return [0, 0];
    }

    var ts = _touches(e),
        t = _getTouch(ts, 0);

    return [t[prefix + "X"], t[prefix + "Y"]];
  }

  var _pageLocation = _genLoc.bind(null, "page");

  function _getTouch(touches, idx) {
    return touches.item ? touches.item(idx) : touches[idx];
  }

  function _touches(e) {
    var _e = e;
    return _e.touches && _e.touches.length > 0 ? _e.touches : _e.changedTouches && _e.changedTouches.length > 0 ? _e.changedTouches : _e.targetTouches && _e.targetTouches.length > 0 ? _e.targetTouches : [_e];
  } // ------------------------------------------------------------------------------------------------------------


  var BrowserJsPlumbInstance =
  /*#__PURE__*/
  function (_jsPlumbInstance) {
    _inherits(BrowserJsPlumbInstance, _jsPlumbInstance);

    function BrowserJsPlumbInstance(_instanceIndex, defaults, helpers) {
      var _this;

      _classCallCheck(this, BrowserJsPlumbInstance);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(BrowserJsPlumbInstance).call(this, _instanceIndex, new BrowserRenderer(), defaults, helpers));
      _this._instanceIndex = _instanceIndex;

      _defineProperty(_assertThisInitialized(_this), "dragManager", void 0);

      _defineProperty(_assertThisInitialized(_this), "_connectorClick", void 0);

      _defineProperty(_assertThisInitialized(_this), "_connectorDblClick", void 0);

      _defineProperty(_assertThisInitialized(_this), "_endpointClick", void 0);

      _defineProperty(_assertThisInitialized(_this), "_endpointDblClick", void 0);

      _defineProperty(_assertThisInitialized(_this), "_overlayClick", void 0);

      _defineProperty(_assertThisInitialized(_this), "_overlayDblClick", void 0);

      _this.eventManager = new Mottle();
      _this.dragManager = new DragManager(_assertThisInitialized(_this));

      _this.dragManager.addHandler(new EndpointDragHandler(_assertThisInitialized(_this)));

      _this.dragManager.addHandler(new GroupDragHandler(_assertThisInitialized(_this)));

      _this.dragManager.addHandler(new ElementDragHandler(_assertThisInitialized(_this)));

      _this._connectorClick = function (e) {
        if (!e.defaultPrevented) {
          console.log("connector click " + e + " " + this._instanceIndex);
          var connectorElement = findParent(e.srcElement || e.target, SELECTOR_CONNECTOR, this.getContainer());
          console.log(connectorElement);
          this.fire(EVENT_CLICK, connectorElement.jtk.connector.connection, e);
        }
      }.bind(_assertThisInitialized(_this));

      _this._connectorDblClick = function (e) {
        if (!e.defaultPrevented) {
          console.log("connector dbl click " + e + " " + this._instanceIndex);
          var connectorElement = findParent(e.srcElement || e.target, SELECTOR_CONNECTOR, this.getContainer());
          console.log(connectorElement);
          this.fire(EVENT_DBL_CLICK, connectorElement.jtk.connector.connection, e);
        }
      }.bind(_assertThisInitialized(_this));

      _this._endpointClick = function (e) {
        if (!e.defaultPrevented) {
          console.log("endpoint click " + e + " " + this._instanceIndex);
          var endpointElement = findParent(e.srcElement || e.target, SELECTOR_ENDPOINT, this.getContainer());
          console.log(endpointElement);
          this.fire(EVENT_ENDPOINT_CLICK, endpointElement.jtk.endpoint, e);
        }
      }.bind(_assertThisInitialized(_this));

      _this._endpointDblClick = function (e) {
        if (!e.defaultPrevented) {
          console.log("endpoint dbl click " + e + " " + this._instanceIndex);
          var endpointElement = findParent(e.srcElement || e.target, SELECTOR_ENDPOINT, this.getContainer());
          console.log(endpointElement);
          this.fire(EVENT_ENDPOINT_DBL_CLICK, endpointElement.jtk.endpoint, e);
        }
      }.bind(_assertThisInitialized(_this));

      _this._overlayClick = function (e) {
        consume(e);
        console.log("overlay click " + e + " " + this._instanceIndex);
        var overlayElement = findParent(e.srcElement || e.target, SELECTOR_OVERLAY, this.getContainer());
        console.log(overlayElement);
        var overlay = overlayElement.jtk.overlay; //this.fire(Constants.EVENT_CLICK, overlay.component, e);
        //overlay.fire("click", e);

        overlay.click(e);
      }.bind(_assertThisInitialized(_this));

      _this._overlayDblClick = function (e) {
        consume(e);
        console.log("overlay dbl click " + e + " " + this._instanceIndex);
        var overlayElement = findParent(e.srcElement || e.target, SELECTOR_OVERLAY, this.getContainer());
        console.log(overlayElement);
        var overlay = overlayElement.jtk.overlay; //this.fire(Constants.EVENT_DBL_CLICK, overlay.component, e);
        //overlay.fire("dblclick", e);

        overlay.dblClick(e);
      }.bind(_assertThisInitialized(_this));

      _this._attachEventDelegates();

      return _this;
    }

    _createClass(BrowserJsPlumbInstance, [{
      key: "getElement",
      value: function getElement(el) {
        if (el == null) {
          return null;
        } // here we pluck the first entry if el was a list of entries.
        // this is not my favourite thing to do, but previous versions of
        // jsplumb supported jquery selectors, and it is possible a selector
        // will be passed in here.


        el = typeof el === "string" ? el : el.length != null && el.enctype == null ? el[0] : el;
        return typeof el === "string" ? document.getElementById(el) : el;
      }
    }, {
      key: "removeElement",
      value: function removeElement(element) {
        // seems to barf at the moment due to scoping. might need to produce a new
        // version of mottle.
        this.eventManager.remove(element);
      }
    }, {
      key: "appendElement",
      value: function appendElement(el, parent) {
        if (parent) {
          parent.appendChild(el);
        } else {
          var _container = this.getContainer();

          if (_container) {
            _container.appendChild(el);
          } else if (!parent) {
            this.appendToRoot(el);
          }
        }
      }
    }, {
      key: "_getAssociatedElements",
      value: function _getAssociatedElements(el) {
        var els = el.querySelectorAll("[jtk-managed]");
        var a = [];
        Array.prototype.push.apply(a, els);
        return a;
      }
    }, {
      key: "appendToRoot",
      value: function appendToRoot(node) {
        document.body.appendChild(node);
      }
    }, {
      key: "shouldFireEvent",
      value: function shouldFireEvent(event, value, originalEvent) {
        return true;
      }
    }, {
      key: "getClass",
      value: function getClass(el) {
        return _getClassName(el);
      }
    }, {
      key: "addClass",
      value: function addClass(el, clazz) {
        if (el != null && clazz != null && clazz.length > 0) {
          this.each(el, function (_el) {
            if (_el.classList) {
              var classes = Array.isArray(clazz) ? clazz : fastTrim(clazz).split(/\s+/);
              window.DOMTokenList.prototype.add.apply(_el.classList, classes);
            } else {
              _classManip(_el, clazz);
            }
          });
        }
      }
    }, {
      key: "hasClass",
      value: function hasClass(el, clazz) {
        if (el.classList) {
          return el.classList.contains(clazz);
        } else {
          return _getClassName(el).indexOf(clazz) !== -1;
        }
      }
    }, {
      key: "removeClass",
      value: function removeClass(el, clazz) {
        if (el != null && clazz != null && clazz.length > 0) {
          this.each(el, function (_el) {
            if (_el.classList) {
              window.DOMTokenList.prototype.remove.apply(_el.classList, clazz.split(/\s+/));
            } else {
              _classManip(_el, null, clazz);
            }
          });
        }
      }
    }, {
      key: "toggleClass",
      value: function toggleClass(el, clazz) {
        var _this2 = this;

        if (el != null && clazz != null && clazz.length > 0) {
          this.each(el, function (_el) {
            if (_el.classList) {
              _el.classList.toggle(clazz);
            } else {
              if (_this2.hasClass(_el, clazz)) {
                _this2.removeClass(_el, clazz);
              } else {
                _this2.addClass(_el, clazz);
              }
            }
          });
        }
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
          if (atts.hasOwnProperty(i)) {
            el.setAttribute(i, atts[i]);
          }
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
        // TODO: here we would like to map the tap event if we know its
        // an internal bind to a click. we have to know its internal because only
        // then can we be sure that the UP event wont be consumed (tap is a synthesized
        // event from a mousedown followed by a mouseup).
        //event = { "click":"tap", "dblclick":"dbltap"}[event] || event;
        this.eventManager.on.apply(this, arguments);
        return this;
      }
    }, {
      key: "off",
      value: function off(el, event, callback) {
        this.eventManager.off.apply(this, arguments);
        return this;
      }
    }, {
      key: "trigger",
      value: function trigger(el, event, originalEvent, payload) {
        this.eventManager.trigger(el, event, originalEvent, payload);
      }
    }, {
      key: "_getOffset",
      value: function _getOffset(el, relativeToRoot, container) {
        //   window.jtime("get offset");
        //console.log("get offset arg was " + el);
        //el = jsPlumb.getElement(el);
        container = container || this.getContainer();

        var out = {
          left: el.offsetLeft,
          top: el.offsetTop
        },
            op = relativeToRoot || container != null && el !== container && el.offsetParent !== container ? el.offsetParent : null,
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

          op = relativeToRoot ? op.offsetParent : op.offsetParent === container ? null : op.offsetParent;
        } // if container is scrolled and the element (or its offset parent) is not absolute or fixed, adjust accordingly.


        if (container != null && !relativeToRoot && (container.scrollTop > 0 || container.scrollLeft > 0)) {
          var pp = el.offsetParent != null ? this.getStyle(el.offsetParent, "position") : "static",
              p = this.getStyle(el, "position");

          if (p !== "absolute" && p !== "fixed" && pp !== "absolute" && pp !== "fixed") {
            out.left -= container.scrollLeft;
            out.top -= container.scrollTop;
          }
        } //window.jtimeEnd("get offset");


        return out;
      }
    }, {
      key: "_getSize",
      value: function _getSize(el) {
        return [el.offsetWidth, el.offsetHeight];
      }
    }, {
      key: "createElement",
      value: function createElement(tag, style, clazz, atts) {
        return this.createElementNS(null, tag, style, clazz, atts);
      }
    }, {
      key: "createElementNS",
      value: function createElementNS(ns, tag, style, clazz, atts) {
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
    }, {
      key: "getStyle",
      value: function getStyle(el, prop) {
        if (typeof window.getComputedStyle !== 'undefined') {
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
            nodeList.appendChild(ctx); //return ctx as [ HTMLElement ];

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
        el.style.left = p.left + "px";
        el.style.top = p.top + "px";
      } //
      // TODO investigate if this is still entirely necessary, since its only used by the drag stuff yet is declared as abstract on the jsPlumbInstance class.
      //

    }, {
      key: "getUIPosition",
      value: function getUIPosition(eventArgs) {
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
        var p = {
          left: finalPos[0],
          top: finalPos[1]
        };

        if (el._katavorioDrag && el.offsetParent !== this.getContainer()) {
          var oc = this.getOffset(el.offsetParent);
          p.left += oc.left;
          p.top += oc.top;
        }

        return p;
      }
    }, {
      key: "getDragScope",
      value: function getDragScope(el) {
        return el._katavorioDrag && el._katavorioDrag.scopes.join(" ") || "";
      }
    }, {
      key: "getPositionOnElement",
      value: function getPositionOnElement(evt, el, zoom) {
        var box = typeof el.getBoundingClientRect !== "undefined" ? el.getBoundingClientRect() : {
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
            w = box.width || el.offsetWidth * zoom,
            h = box.height || el.offsetHeight * zoom,
            x = (cl[0] - left) / w,
            y = (cl[1] - top) / h;

        return [x, y];
      }
    }, {
      key: "setDraggable",
      value: function setDraggable(element, draggable) {
        if (draggable) {
          this.removeAttribute(element, ATTRIBUTE_NOT_DRAGGABLE);
        } else {
          this.setAttribute(element, ATTRIBUTE_NOT_DRAGGABLE, "true");
        }
      }
    }, {
      key: "isDraggable",
      value: function isDraggable(el) {
        var d = this.getAttribute(el, ATTRIBUTE_NOT_DRAGGABLE);
        return d == null || d === "false";
      }
      /*
       * toggles the draggable state of the given element(s).
       * el is either an id, or an element object, or a list of ids/element objects.
       */

    }, {
      key: "toggleDraggable",
      value: function toggleDraggable(el) {
        var state = this.isDraggable(el);
        this.setDraggable(el, !state);
        return !state;
      }
    }, {
      key: "consume",
      value: function consume(e) {
        Mottle.consume(e);
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
        }
      }
    }, {
      key: "setContainer",
      value: function setContainer(c) {
        this._detachEventDelegates();

        if (this.dragManager != null) {
          this.dragManager.reset();
        }

        _get(_getPrototypeOf(BrowserJsPlumbInstance.prototype), "setContainer", this).call(this, c);

        if (this.eventManager != null) {
          this._attachEventDelegates();
        }

        if (this.dragManager != null) {
          this.dragManager.addHandler(new EndpointDragHandler(this));
          this.dragManager.addHandler(new GroupDragHandler(this));
          this.dragManager.addHandler(new ElementDragHandler(this));
        }
      }
    }, {
      key: "reset",
      value: function reset(silently) {
        _get(_getPrototypeOf(BrowserJsPlumbInstance.prototype), "reset", this).call(this, silently);

        if (silently) {
          var container = this.getContainer();
          var els = container.querySelectorAll("[jtk-managed], .jtk-endpoint, .jtk-connector, .jtk-overlay");
          els.forEach(function (el) {
            return el.parentNode && el.parentNode.removeChild(el);
          });
        }
      }
    }, {
      key: "destroy",
      value: function destroy() {
        this._detachEventDelegates();

        if (this.dragManager != null) {
          this.dragManager.reset();
        }

        _get(_getPrototypeOf(BrowserJsPlumbInstance.prototype), "destroy", this).call(this); //this.getContainer().innerHTML = ""; <--

      }
    }]);

    return BrowserJsPlumbInstance;
  }(jsPlumbInstance);

  var AbstractConnector =
  /*#__PURE__*/
  function () {
    function AbstractConnector(instance, connection, params) {
      _classCallCheck(this, AbstractConnector);

      this.instance = instance;
      this.connection = connection;

      _defineProperty(this, "type", void 0);

      _defineProperty(this, "renderer", void 0);

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

      this.stub = params.stub || 0;
      this.sourceStub = isArray(this.stub) ? this.stub[0] : this.stub;
      this.targetStub = isArray(this.stub) ? this.stub[1] : this.stub;
      this.gap = params.gap || 0;
      this.sourceGap = isArray(this.gap) ? this.gap[0] : this.gap;
      this.targetGap = isArray(this.gap) ? this.gap[1] : this.gap;
      this.maxStub = Math.max(this.sourceStub, this.targetStub);
      this.cssClass = params.cssClass || "";
      this.renderer = instance.renderer.assignConnectorRenderer(instance, this);
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
        if (absolute) {
          location = location > 0 ? location / this.totalLength : (this.totalLength + location) / this.totalLength;
        }

        var idx = this.segmentProportions.length - 1,
            inSegmentProportion = 1;

        for (var i = 0; i < this.segmentProportions.length; i++) {
          if (this.segmentProportions[i][1] >= location) {
            idx = i; // todo is this correct for all connector path types?

            inSegmentProportion = location === 1 ? 1 : location === 0 ? 0 : (location - this.segmentProportions[i][0]) / this.segmentProportionalLengths[i];
            break;
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
        var segment = Biltong.quadrant(params.sourcePos, params.targetPos),
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
          lw: lw,
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
      key: "paint",
      value: function paint(paintStyle, extents) {
        this.renderer.paint(paintStyle, extents);
      }
    }, {
      key: "getAttachedElements",
      value: function getAttachedElements() {
        return [];
      }
    }, {
      key: "setHover",
      value: function setHover(hover, ignoreAttachedElements, timestamp) {
        this.renderer.setHover(hover);
      }
    }, {
      key: "setVisible",
      value: function setVisible(v) {
        return this.renderer.setVisible(v);
      }
    }, {
      key: "applyType",
      value: function applyType(t) {
        this.renderer.applyType(t);
      }
    }, {
      key: "addClass",
      value: function addClass(clazz) {
        this.renderer.addClass(clazz);
      }
    }, {
      key: "removeClass",
      value: function removeClass(clazz) {
        this.renderer.removeClass(clazz);
      }
    }, {
      key: "getClass",
      value: function getClass() {
        return this.renderer.getClass();
      }
    }, {
      key: "cleanup",
      value: function cleanup(force) {
        if (force || this.typeId == null) {
          this.renderer.cleanup(force);
        }
      }
    }, {
      key: "destroy",
      value: function destroy(force) {
        if (force || this.typeId == null) {
          this.renderer.destroy(force);
        }
      }
    }]);

    return AbstractConnector;
  }();

  var TWO_PI = 2 * Math.PI;
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

      _defineProperty(_assertThisInitialized(_this), "type", "Arc");

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
        return Biltong.theta([this.cx, this.cy], [_x, _y]);
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
      } // segment is used by vml
      //this.segment = _jg.quadrant([this.x1, this.y1], [this.x2, this.y2]);
      // we now have startAngle and endAngle as positive numbers, meaning the
      // absolute difference (|d|) between them is the sweep (s) of this arc, unless the
      // arc is 'anticlockwise' in which case 's' is given by 2PI - |d|.

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
    }, {
      key: "gradientAtPoint",

      /**
       * returns the gradient of the segment at the given point.
       */
      value: function gradientAtPoint(location, absolute) {
        var p = this.pointOnPath(location, absolute);
        var m = Biltong.normal([this.cx, this.cy], [p.x, p.y]);

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

  var AbstractBezierConnector =
  /*#__PURE__*/
  function (_AbstractConnector) {
    _inherits(AbstractBezierConnector, _AbstractConnector);

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
          this.isLoopbackCurrently = true; // a loopback connector.  draw an arc from one anchor to the other.

          var x1 = p.sourcePos[0],
              y1 = p.sourcePos[1] - this.margin,
              cx = x1,
              cy = y1 - this.loopbackRadius,
              // canvas sizing stuff, to ensure the whole painted area is visible.
          _x = cx - this.loopbackRadius,
              _y = cy - this.loopbackRadius;

          _w = 2 * this.loopbackRadius;
          _h = 2 * this.loopbackRadius;
          paintInfo.points[0] = _x;
          paintInfo.points[1] = _y;
          paintInfo.points[2] = _w;
          paintInfo.points[3] = _h; // ADD AN ARC SEGMENT.

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
    }]);

    return AbstractBezierConnector;
  }(AbstractConnector);

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

      _defineProperty(_assertThisInitialized(_this), "type", "Bezier");

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
      key: "_translateLocation",
      value: function _translateLocation(_curve, location, absolute) {
        if (absolute) {
          location = jsBezier.locationAlongCurveFrom(_curve, location > 0 ? 0 : 1, location);
        }

        return location;
      }
      /**
       * returns the point on the segment's path that is 'location' along the length of the path, where 'location' is a decimal from
       * 0 to 1 inclusive.
       */

    }, {
      key: "pointOnPath",
      value: function pointOnPath(location, absolute) {
        location = this._translateLocation(this.curve, location, absolute);
        return jsBezier.pointOnCurve(this.curve, location);
      }
      /**
       * returns the gradient of the segment at the given point.
       */

    }, {
      key: "gradientAtPoint",
      value: function gradientAtPoint(location, absolute) {
        location = this._translateLocation(this.curve, location, absolute);
        return jsBezier.gradientAtPoint(this.curve, location);
      }
    }, {
      key: "pointAlongPathFrom",
      value: function pointAlongPathFrom(location, distance, absolute) {
        location = this._translateLocation(this.curve, location, absolute);
        return jsBezier.pointAlongCurveFrom(this.curve, location, distance);
      }
    }, {
      key: "getLength",
      value: function getLength() {
        return jsBezier.getLength(this.curve);
      }
    }, {
      key: "getBounds",
      value: function getBounds() {
        return this.bounds;
      }
    }, {
      key: "findClosestPointOnPath",
      value: function findClosestPointOnPath(x, y) {
        var p = jsBezier.nearestPointOnCurve({
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
      value: function lineIntersection(x1, y1, x2, y2) {
        return jsBezier.lineIntersection(x1, y1, x2, y2, this.curve);
      }
    }]);

    return BezierSegment;
  }(AbstractSegment);

  var Bezier =
  /*#__PURE__*/
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
        // determine if the two anchors are perpendicular to each other in their orientation.  we swap the control
        // points around if so (code could be tightened up)
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

        _CP = this._findControlPoint([_sx, _sy], sp, tp, paintInfo.so, paintInfo.to);
        _CP2 = this._findControlPoint([_tx, _ty], tp, sp, paintInfo.to, paintInfo.so);

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
  Connectors.register("Bezier", Bezier);

  var StraightSegment =
  /*#__PURE__*/
  function (_AbstractSegment) {
    _inherits(StraightSegment, _AbstractSegment);

    function StraightSegment(instance, params) {
      var _this;

      _classCallCheck(this, StraightSegment);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(StraightSegment).call(this, params));

      _defineProperty(_assertThisInitialized(_this), "length", void 0);

      _defineProperty(_assertThisInitialized(_this), "m", void 0);

      _defineProperty(_assertThisInitialized(_this), "m2", void 0);

      _defineProperty(_assertThisInitialized(_this), "x1", void 0);

      _defineProperty(_assertThisInitialized(_this), "x2", void 0);

      _defineProperty(_assertThisInitialized(_this), "y1", void 0);

      _defineProperty(_assertThisInitialized(_this), "y2", void 0);

      _defineProperty(_assertThisInitialized(_this), "type", "Straight");

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
        this.m = Biltong.gradient({
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
      } // getCoordinates ():StraightSegmentCoordinates  {
      //     return { x1: this.x1, y1: y1, x2: x2, y2: y2 };
      // }

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
          return Biltong.pointOnLine({
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
        };
        /*
         location == 1 ? {
         x:x1 + ((x2 - x1) * 10),
         y:y1 + ((y1 - y2) * 10)
         } :
         */

        if (distance <= 0 && Math.abs(distance) > 1) {
          distance *= -1;
        }

        return Biltong.pointOnLine(p, farAwayPoint, distance);
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

          out.x = this.within(this.x1, this.x2, _x1) ? _x1 : this.closest(this.x1, this.x2, _x1); //_x1;

          out.y = this.within(this.y1, this.y2, _y1) ? _y1 : this.closest(this.y1, this.y2, _y1); //_y1;
        }

        var fractionInSegment = Biltong.lineLength([out.x, out.y], [this.x1, this.y1]);
        out.d = Biltong.lineLength([x, y], [out.x, out.y]);
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
        var m2 = Math.abs(Biltong.gradient({
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
  /*#__PURE__*/
  function (_AbstractConnector) {
    _inherits(FlowchartConnector, _AbstractConnector);

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
      _this.lastOrientation = null; // TODO now common between this and AbstractBezierEditor; refactor into superclass?

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
            // dx + dy are used to adjust for line width.
            var dx = current[2] === current[0] ? 0 : current[2] > current[0] ? paintInfo.lw / 2 : -(paintInfo.lw / 2),
                dy = current[3] === current[1] ? 0 : current[3] > current[1] ? paintInfo.lw / 2 : -(paintInfo.lw / 2);

            this._addSegment(StraightSegment, {
              x1: current[0] - dx,
              y1: current[1] - dy,
              x2: current[2] + dx,
              y2: current[3] + dy
            });
          }

          current = next;
        }

        if (next != null) {
          // last segment
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
        this.segments.length = 0;
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
        }; // calculate Stubs.


        var stubs = stubCalculators[paintInfo.anchorOrientation](paintInfo.sourceAxis),
            idx = paintInfo.sourceAxis === "x" ? 0 : 1,
            oidx = paintInfo.sourceAxis === "x" ? 1 : 0,
            ss = stubs[idx],
            oss = stubs[oidx],
            es = stubs[idx + 2],
            oes = stubs[oidx + 2]; // add the start stub segment. use stubs for loopback as it will look better, with the loop spaced
        // away from the element.

        this.addASegment(stubs[0], stubs[1], paintInfo); // if its a loopback and we should treat it differently.
        // if (false && params.sourcePos[0] === params.targetPos[0] && params.sourcePos[1] === params.targetPos[1]) {
        //
        //     // we use loopbackRadius here, as statemachine connectors do.
        //     // so we go radius to the left from stubs[0], then upwards by 2*radius, to the right by 2*radius,
        //     // down by 2*radius, left by radius.
        //     addSegment(segments, stubs[0] - loopbackRadius, stubs[1], paintInfo);
        //     addSegment(segments, stubs[0] - loopbackRadius, stubs[1] - (2 * loopbackRadius), paintInfo);
        //     addSegment(segments, stubs[0] + loopbackRadius, stubs[1] - (2 * loopbackRadius), paintInfo);
        //     addSegment(segments, stubs[0] + loopbackRadius, stubs[1], paintInfo);
        //     addSegment(segments, stubs[0], stubs[1], paintInfo);
        //
        // }
        // else {

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
        }; // compute the rest of the line

        var p = lineCalculators[paintInfo.anchorOrientation](paintInfo.sourceAxis, ss, oss, es, oes);

        if (p) {
          for (var i = 0; i < p.length; i++) {
            this.addASegment(p[i][0], p[i][1], paintInfo);
          }
        } // line to end stub


        this.addASegment(stubs[2], stubs[3], paintInfo); //}
        // end stub to end (common)

        this.addASegment(paintInfo.tx, paintInfo.ty, paintInfo); // write out the segments.

        this.writeSegments(paintInfo);
      }
    }]);

    return FlowchartConnector;
  }(AbstractConnector);
  Connectors.register("Flowchart", FlowchartConnector);

  function _segment(x1, y1, x2, y2) {
    if (x1 <= x2 && y2 <= y1) {
      return 1;
    } else if (x1 <= x2 && y1 <= y2) {
      return 2;
    } else if (x2 <= x1 && y2 >= y1) {
      return 3;
    }

    return 4;
  } // the control point we will use depends on the faces to which each end of the connection is assigned, specifically whether or not the
  // two faces are parallel or perpendicular.  if they are parallel then the control point lies on the midpoint of the axis in which they
  // are parellel and varies only in the other axis; this variation is proportional to the distance that the anchor points lie from the
  // center of that face.  if the two faces are perpendicular then the control point is at some distance from both the midpoints; the amount and
  // direction are dependent on the orientation of the two elements. 'seg', passed in to this method, tells you which segment the target element
  // lies in with respect to the source: 1 is top right, 2 is bottom right, 3 is bottom left, 4 is top left.
  //
  // sourcePos and targetPos are arrays of info about where on the source and target each anchor is located.  their contents are:
  //
  // 0 - absolute x
  // 1 - absolute y
  // 2 - proportional x in element (0 is left edge, 1 is right edge)
  // 3 - proportional y in element (0 is top edge, 1 is bottom edge)
  //


  function _findControlPoint(midx, midy, segment, sourceEdge, targetEdge, dx, dy, distance, proximityLimit) {
    // TODO (maybe)
    // - if anchor pos is 0.5, make the control point take into account the relative position of the elements.
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
  /*#__PURE__*/
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
            _ty = params.sourcePos[1] < params.targetPos[1] ? h : 0; // now adjust for the margin


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
        } //
        // these connectors are quadratic bezier curves, having a single control point. if both anchors
        // are located at 0.5 on their respective faces, the control point is set to the midpoint and you
        // get a straight line.  this is also the case if the two anchors are within 'proximityLimit', since
        // it seems to make good aesthetic sense to do that. outside of that, the control point is positioned
        // at 'curviness' pixels away along the normal to the straight line connecting the two anchors.
        //
        // there may be two improvements to this.  firstly, we might actually support the notion of avoiding nodes
        // in the UI, or at least making a good effort at doing so.  if a connection would pass underneath some node,
        // for example, we might increase the distance the control point is away from the midpoint in a bid to
        // steer it around that node.  this will work within limits, but i think those limits would also be the likely
        // limits for, once again, aesthetic good sense in the layout of a chart using these connectors.
        //
        // the second possible change is actually two possible changes: firstly, it is possible we should gradually
        // decrease the 'curviness' as the distance between the anchors decreases; start tailing it off to 0 at some
        // point (which should be configurable).  secondly, we might slightly increase the 'curviness' for connectors
        // with respect to how far their anchor is from the center of its respective face. this could either look cool,
        // or stupid, and may indeed work only in a way that is so subtle as to have been a waste of time.
        //


        var _midx = (_sx + _tx) / 2,
            _midy = (_sy + _ty) / 2,
            segment = _segment(_sx, _sy, _tx, _ty),
            distance = Math.sqrt(Math.pow(_tx - _sx, 2) + Math.pow(_ty - _sy, 2)),
            cp1x,
            cp2x,
            cp1y,
            cp2y; // calculate the control point.  this code will be where we'll put in a rudimentary element avoidance scheme; it
        // will work by extending the control point to force the curve to be, um, curvier.


        this._controlPoint = _findControlPoint(_midx, _midy, segment, params.sourcePos, params.targetPos, this.curviness, this.curviness, distance, this.proximityLimit);
        cp1x = this._controlPoint[0];
        cp2x = this._controlPoint[0];
        cp1y = this._controlPoint[1];
        cp2y = this._controlPoint[1];

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
  Connectors.register("StateMachine", StateMachine);

  var StraightConnector =
  /*#__PURE__*/
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
      key: "_compute",
      value: function _compute(paintInfo, _) {
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
      }
    }]);

    return StraightConnector;
  }(AbstractConnector);
  Connectors.register("Straight", StraightConnector);

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
      _this.radius = params.radius || 10;
      _this.defaultOffset = 0.5 * _this.radius;
      _this.defaultInnerRadius = _this.radius / 3;
      return _this;
    }

    _createClass(DotEndpoint, [{
      key: "_compute",
      value: function _compute(anchorPoint, orientation, endpointStyle) {
        //this.radius = endpointStyle.radius || this.radius;
        var x = anchorPoint[0] - this.radius,
            y = anchorPoint[1] - this.radius,
            w = this.radius * 2,
            h = this.radius * 2;

        if (endpointStyle.stroke) {
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
        return "Dot";
      }
    }]);

    return DotEndpoint;
  }(EndpointRepresentation);
  EndpointFactory.register("Dot", DotEndpoint);

  var RectangleEndpoint =
  /*#__PURE__*/
  function (_EndpointRepresentati) {
    _inherits(RectangleEndpoint, _EndpointRepresentati);

    function RectangleEndpoint(endpoint, params) {
      var _this;

      _classCallCheck(this, RectangleEndpoint);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(RectangleEndpoint).call(this, endpoint));

      _defineProperty(_assertThisInitialized(_this), "width", void 0);

      _defineProperty(_assertThisInitialized(_this), "height", void 0);

      params = params || {};
      _this.width = params.width || 20;
      _this.height = params.height || 20;
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
  EndpointFactory.register("Rectangle", RectangleEndpoint);

  var BlankEndpoint =
  /*#__PURE__*/
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
  EndpointFactory.register("Blank", BlankEndpoint);

  var ImageEndpoint =
  /*#__PURE__*/
  function (_EndpointRepresentati) {
    _inherits(ImageEndpoint, _EndpointRepresentati);

    function ImageEndpoint(endpoint, params) {
      var _this;

      _classCallCheck(this, ImageEndpoint);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(ImageEndpoint).call(this, endpoint));

      _defineProperty(_assertThisInitialized(_this), "onload", void 0);

      _defineProperty(_assertThisInitialized(_this), "src", void 0);

      _defineProperty(_assertThisInitialized(_this), "cssClass", void 0);

      _defineProperty(_assertThisInitialized(_this), "anchorPoint", void 0);

      _defineProperty(_assertThisInitialized(_this), "_imageLoaded", false);

      _defineProperty(_assertThisInitialized(_this), "_imageWidth", void 0);

      _defineProperty(_assertThisInitialized(_this), "_imageHeight", void 0);

      params = params || {};
      _this.src = params.src || params.url;
      _this.onload = params.onload;
      _this.cssClass = params.cssClass || "";
      return _this;
    }

    _createClass(ImageEndpoint, [{
      key: "_compute",
      value: function _compute(anchorPoint, orientation, endpointStyle) {
        this.anchorPoint = anchorPoint;

        if (this._imageLoaded) {
          return [anchorPoint[0] - this._imageWidth / 2, anchorPoint[1] - this._imageHeight / 2, this._imageWidth, this._imageHeight];
        } else {
          return [0, 0, 0, 0];
        }
      }
    }, {
      key: "getType",
      value: function getType() {
        return "Image";
      }
    }]);

    return ImageEndpoint;
  }(EndpointRepresentation);
  EndpointFactory.register("Image", ImageEndpoint);

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

      _defineProperty(_assertThisInitialized(_this), "type", "Arrow");

      _defineProperty(_assertThisInitialized(_this), "cachedDimensions", void 0);

      p = p || {};
      _this.width = p.width || DEFAULT_WIDTH;
      _this.length = p.length || DEFAULT_LENGTH;
      _this.direction = (p.direction || 1) < 0 ? -1 : 1;
      _this.foldback = p.foldback || 0.623;
      _this.paintStyle = p.paintStyle || {
        "strokeWidth": 1
      };

      _this.setRenderer(_this.instance.renderer.assignOverlayRenderer(_this.instance, _assertThisInitialized(_this)));

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
            txy = Biltong.pointOnLine(hxy, mid, this.length);
          } else if (this.location === 1) {
            hxy = connector.pointOnPath(this.location);
            mid = connector.pointAlongPathFrom(this.location, -this.length);
            txy = Biltong.pointOnLine(hxy, mid, this.length);

            if (this.direction === -1) {
              var _ = txy;
              txy = hxy;
              hxy = _;
            }
          } else if (this.location === 0) {
            txy = connector.pointOnPath(this.location);
            mid = connector.pointAlongPathFrom(this.location, this.length);
            hxy = Biltong.pointOnLine(txy, mid, this.length);

            if (this.direction === -1) {
              var __ = txy;
              txy = hxy;
              hxy = __;
            }
          } else {
            hxy = connector.pointAlongPathFrom(this.location, this.direction * this.length / 2);
            mid = connector.pointOnPath(this.location);
            txy = Biltong.pointOnLine(hxy, mid, this.length);
          }

          tail = Biltong.perpendicularLineTo(hxy, txy, this.width);
          cxy = Biltong.pointOnLine(hxy, txy, this.foldback * this.length);
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
          }; // } else {
          //     return {component: component, minX: 0, maxX: 0, minY: 0, maxY: 0};
          // }
        }
      }
    }, {
      key: "updateFrom",
      value: function updateFrom(d) {}
    }]);

    return ArrowOverlay;
  }(Overlay);
  OverlayFactory.register("Arrow", ArrowOverlay);

  var PlainArrowOverlay =
  /*#__PURE__*/
  function (_ArrowOverlay) {
    _inherits(PlainArrowOverlay, _ArrowOverlay);

    function PlainArrowOverlay(instance, component, p) {
      var _this;

      _classCallCheck(this, PlainArrowOverlay);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(PlainArrowOverlay).call(this, instance, component, p));
      _this.foldback = 1;
      return _this;
    }

    return PlainArrowOverlay;
  }(ArrowOverlay);
  OverlayFactory.register("PlainArrow", PlainArrowOverlay);

  var DiamondOverlay =
  /*#__PURE__*/
  function (_ArrowOverlay) {
    _inherits(DiamondOverlay, _ArrowOverlay);

    function DiamondOverlay(instance, component, p) {
      var _this;

      _classCallCheck(this, DiamondOverlay);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(DiamondOverlay).call(this, instance, component, p));
      _this.length = _this.length / 2;
      _this.foldback = 2;
      return _this;
    }

    return DiamondOverlay;
  }(ArrowOverlay);
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

      _defineProperty(_assertThisInitialized(_this), "events", void 0);

      _defineProperty(_assertThisInitialized(_this), "type", "Custom");

      _this.create = p.create;

      _this.setRenderer(_this.instance.renderer.assignOverlayRenderer(_this.instance, _assertThisInitialized(_this)));

      return _this;
    }

    _createClass(CustomOverlay, [{
      key: "draw",
      value: function draw(component, paintStyle, absolutePosition) {
        return this.getRenderer().draw(component, paintStyle, absolutePosition);
      }
    }, {
      key: "updateFrom",
      value: function updateFrom(d) {}
    }]);

    return CustomOverlay;
  }(Overlay);
  OverlayFactory.register("Custom", CustomOverlay);

  /**
   * Superclass for endpoint renderers that use an `svg` element wrapped in a `div` in the DOM.
   * Type specific subclasses are expected to implement a `makeNode` and `updateNode` method,
   * which respectively create the type-specific elements, and update them at paint time.
   */
  var SvgEndpoint =
  /*#__PURE__*/
  function (_SvgComponent) {
    _inherits(SvgEndpoint, _SvgComponent);

    function SvgEndpoint(endpoint, ep, options) {
      var _this;

      _classCallCheck(this, SvgEndpoint);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SvgEndpoint).call(this, endpoint.instance, ep, extend(options || {}, {
        useDivWrapper: true
      })));
      _this.endpoint = endpoint;
      _this.ep = ep;

      _defineProperty(_assertThisInitialized(_this), "node", void 0);

      _defineProperty(_assertThisInitialized(_this), "instance", void 0);

      _this.instance = endpoint.instance;

      _this.instance.addClass(_this.canvas, "jtk-endpoint");

      _this.instance.setAttribute(_this.svg, "pointer-events", "all");

      _this.canvas._jsPlumb = {
        endpoint: endpoint,
        ep: ep
      };

      if (endpoint.cssClass != null) {
        _this.instance.addClass(_this.canvas, endpoint.cssClass);
      }

      var scopes = endpoint.scope.split(/\s/);

      for (var i = 0; i < scopes.length; i++) {
        _this.instance.setAttribute(_this.canvas, "jtk-scope-" + scopes[i], "true");
      }

      _this.canvas.jtk = _this.canvas.jtk || {};
      _this.canvas.jtk.endpoint = ep;
      return _this;
    }

    _createClass(SvgEndpoint, [{
      key: "getElement",
      value: function getElement() {
        return this.canvas;
      }
    }, {
      key: "paint",
      value: function paint(paintStyle) {
        _get(_getPrototypeOf(SvgEndpoint.prototype), "paint", this).call(this, paintStyle);

        var s = extend({}, paintStyle);

        if (s.outlineStroke) {
          s.stroke = s.outlineStroke;
        }

        if (this.node == null) {
          this.node = this.makeNode(s);
          this.svg.appendChild(this.node);
        } else if (this.updateNode != null) {
          this.updateNode(this.node);
        }

        _applyStyles(this.canvas, this.node, s, [this.ep.x, this.ep.y, this.ep.w, this.ep.h], null);
      }
    }, {
      key: "applyType",
      value: function applyType(t) {
        if (t.cssClass != null && this.svg) {
          this.instance.addClass(this.canvas, t.cssClass);
        }
      }
    }]);

    return SvgEndpoint;
  }(SvgComponent);

  /**
   * SVG DOM element Dot endpoint renderer.
   */
  var SvgElementDotEndpointRenderer =
  /*#__PURE__*/
  function (_SvgEndpoint) {
    _inherits(SvgElementDotEndpointRenderer, _SvgEndpoint);

    function SvgElementDotEndpointRenderer(endpoint, ep, options) {
      var _this;

      _classCallCheck(this, SvgElementDotEndpointRenderer);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SvgElementDotEndpointRenderer).call(this, endpoint, ep, options));
      _this.endpoint = endpoint;
      _this.ep = ep;
      return _this;
    }

    _createClass(SvgElementDotEndpointRenderer, [{
      key: "makeNode",
      value: function makeNode(style) {
        return _node(this.instance, "circle", {
          "cx": this.ep.w / 2,
          "cy": this.ep.h / 2,
          "r": this.ep.radius
        });
      }
    }, {
      key: "updateNode",
      value: function updateNode(node) {
        _attr(node, {
          "cx": "" + this.ep.w / 2,
          "cy": "" + this.ep.h / 2,
          "r": "" + this.ep.radius
        });
      }
    }]);

    return SvgElementDotEndpointRenderer;
  }(SvgEndpoint);

  registerEndpointRenderer("Dot", SvgElementDotEndpointRenderer);

  /**
   * SVG DOM element Dot endpoint renderer.
   */
  var SvgElementRectangleEndpointRenderer =
  /*#__PURE__*/
  function (_SvgEndpoint) {
    _inherits(SvgElementRectangleEndpointRenderer, _SvgEndpoint);

    function SvgElementRectangleEndpointRenderer(endpoint, ep, options) {
      var _this;

      _classCallCheck(this, SvgElementRectangleEndpointRenderer);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SvgElementRectangleEndpointRenderer).call(this, endpoint, ep, options));
      _this.endpoint = endpoint;
      _this.ep = ep;
      return _this;
    }

    _createClass(SvgElementRectangleEndpointRenderer, [{
      key: "makeNode",
      value: function makeNode(style) {
        return _node(this.instance, "rect", {
          "width": this.ep.w,
          "height": this.ep.h
        });
      }
    }, {
      key: "updateNode",
      value: function updateNode(node) {
        _attr(node, {
          "width": this.ep.w,
          "height": this.ep.h
        });
      }
    }]);

    return SvgElementRectangleEndpointRenderer;
  }(SvgEndpoint);

  registerEndpointRenderer("Rectangle", SvgElementRectangleEndpointRenderer);

  var BLANK_ATTRIBUTES = {
    "width": 10,
    "height": 0,
    "fill": "transparent",
    "stroke": "transparent"
  };
  /**
   * SVG DOM element Dot endpoint renderer.
   */

  var SvgElementBlankEndpointRenderer =
  /*#__PURE__*/
  function (_SvgEndpoint) {
    _inherits(SvgElementBlankEndpointRenderer, _SvgEndpoint);

    function SvgElementBlankEndpointRenderer(endpoint, ep, options) {
      var _this;

      _classCallCheck(this, SvgElementBlankEndpointRenderer);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SvgElementBlankEndpointRenderer).call(this, endpoint, ep, options));
      _this.endpoint = endpoint;
      _this.ep = ep;
      return _this;
    }

    _createClass(SvgElementBlankEndpointRenderer, [{
      key: "makeNode",
      value: function makeNode(style) {
        return _node(this.instance, "rect", BLANK_ATTRIBUTES);
      }
    }, {
      key: "updateNode",
      value: function updateNode(node) {
        _attr(node, BLANK_ATTRIBUTES);
      }
    }]);

    return SvgElementBlankEndpointRenderer;
  }(SvgEndpoint);

  registerEndpointRenderer("Blank", SvgElementBlankEndpointRenderer);

  var _jsPlumbInstanceIndex = 0;

  function getInstanceIndex() {
    var i = _jsPlumbInstanceIndex + 1;
    _jsPlumbInstanceIndex++;
    return i;
  }
  /**
   *
   * Entry point.
   *
   *
   */


  if (typeof window !== "undefined") {
    window.jsPlumb = {
      newInstance: function newInstance(defaults, helpers) {
        return new BrowserJsPlumbInstance(getInstanceIndex(), defaults, helpers);
      },
      ready: function ready(f) {
        var _do = function _do() {
          if (/complete|loaded|interactive/.test(document.readyState) && typeof document.body !== "undefined" && document.body != null) {
            f();
          } else {
            setTimeout(_do, 9);
          }
        };

        _do();
      },
      extend: extend,
      svg: {
        node: _node,
        attr: _attr,
        pos: _pos
      }
    }; //ready(_jp.init);
  }

  exports.ATTRIBUTE_CONTAINER = ATTRIBUTE_CONTAINER;
  exports.ATTRIBUTE_GROUP = ATTRIBUTE_GROUP;
  exports.ATTRIBUTE_MANAGED = ATTRIBUTE_MANAGED;
  exports.ATTRIBUTE_NOT_DRAGGABLE = ATTRIBUTE_NOT_DRAGGABLE;
  exports.ATTRIBUTE_SOURCE = ATTRIBUTE_SOURCE;
  exports.ATTRIBUTE_TARGET = ATTRIBUTE_TARGET;
  exports.ATTR_NOT_DRAGGABLE = ATTR_NOT_DRAGGABLE;
  exports.AbstractBezierConnector = AbstractBezierConnector;
  exports.AbstractConnector = AbstractConnector;
  exports.AbstractSegment = AbstractSegment;
  exports.Anchor = Anchor;
  exports.AnchorManager = AnchorManager;
  exports.Anchors = Anchors;
  exports.ArcSegment = ArcSegment;
  exports.ArrowOverlay = ArrowOverlay;
  exports.BEFORE_DETACH = BEFORE_DETACH;
  exports.BLOCK = BLOCK;
  exports.Bezier = Bezier;
  exports.BezierSegment = BezierSegment;
  exports.BlankEndpoint = BlankEndpoint;
  exports.BrowserJsPlumbInstance = BrowserJsPlumbInstance;
  exports.BrowserRenderer = BrowserRenderer;
  exports.CHECK_CONDITION = CHECK_CONDITION;
  exports.CLASS_CONNECTOR = CLASS_CONNECTOR;
  exports.CLASS_DRAGGED = CLASS_DRAGGED;
  exports.CLASS_DRAG_ACTIVE = CLASS_DRAG_ACTIVE;
  exports.CLASS_DRAG_HOVER = CLASS_DRAG_HOVER;
  exports.CLASS_ENDPOINT = CLASS_ENDPOINT;
  exports.CLASS_OVERLAY = CLASS_OVERLAY;
  exports.CMD_HIDE = CMD_HIDE;
  exports.CMD_ORPHAN_ALL = CMD_ORPHAN_ALL;
  exports.CMD_REMOVE_ALL = CMD_REMOVE_ALL;
  exports.CMD_SHOW = CMD_SHOW;
  exports.Component = Component;
  exports.Connection = Connection;
  exports.Connectors = Connectors;
  exports.ContinuousAnchor = ContinuousAnchor;
  exports.ContinuousAnchorFactory = ContinuousAnchorFactory;
  exports.CustomOverlay = CustomOverlay;
  exports.DASHSTYLE = DASHSTYLE;
  exports.DEFAULT = DEFAULT;
  exports.DEFS = DEFS;
  exports.DOMImageEndpointRenderer = DOMImageEndpointRenderer;
  exports.DiamondOverlay = DiamondOverlay;
  exports.DotEndpoint = DotEndpoint;
  exports.DragManager = DragManager;
  exports.DynamicAnchor = DynamicAnchor;
  exports.EMPTY_BOUNDS = EMPTY_BOUNDS;
  exports.EVENT_CHILD_ADDED = EVENT_CHILD_ADDED;
  exports.EVENT_CHILD_REMOVED = EVENT_CHILD_REMOVED;
  exports.EVENT_CLICK = EVENT_CLICK;
  exports.EVENT_COLLAPSE = EVENT_COLLAPSE;
  exports.EVENT_CONNECTION = EVENT_CONNECTION;
  exports.EVENT_CONNECTION_DETACHED = EVENT_CONNECTION_DETACHED;
  exports.EVENT_CONNECTION_MOVED = EVENT_CONNECTION_MOVED;
  exports.EVENT_CONTAINER_CHANGE = EVENT_CONTAINER_CHANGE;
  exports.EVENT_DBL_CLICK = EVENT_DBL_CLICK;
  exports.EVENT_ENDPOINT_CLICK = EVENT_ENDPOINT_CLICK;
  exports.EVENT_ENDPOINT_DBL_CLICK = EVENT_ENDPOINT_DBL_CLICK;
  exports.EVENT_EXPAND = EVENT_EXPAND;
  exports.EVENT_GROUP_ADDED = EVENT_GROUP_ADDED;
  exports.EVENT_GROUP_DRAG_STOP = EVENT_GROUP_DRAG_STOP;
  exports.EVENT_GROUP_REMOVED = EVENT_GROUP_REMOVED;
  exports.EVENT_INTERNAL_CONNECTION_DETACHED = EVENT_INTERNAL_CONNECTION_DETACHED;
  exports.EVENT_MAX_CONNECTIONS = EVENT_MAX_CONNECTIONS;
  exports.EVT_DRAG_MOVE = EVT_DRAG_MOVE;
  exports.EVT_DRAG_START = EVT_DRAG_START;
  exports.EVT_DRAG_STOP = EVT_DRAG_STOP;
  exports.EVT_MOUSEDOWN = EVT_MOUSEDOWN;
  exports.EVT_MOUSEUP = EVT_MOUSEUP;
  exports.EVT_REVERT = EVT_REVERT;
  exports.Endpoint = Endpoint;
  exports.EndpointFactory = EndpointFactory;
  exports.EndpointRepresentation = EndpointRepresentation;
  exports.EventGenerator = EventGenerator;
  exports.FILL = FILL;
  exports.FloatingAnchor = FloatingAnchor;
  exports.FlowchartConnector = FlowchartConnector;
  exports.GROUP_COLLAPSED_CLASS = GROUP_COLLAPSED_CLASS;
  exports.GROUP_EXPANDED_CLASS = GROUP_EXPANDED_CLASS;
  exports.GROUP_KEY = GROUP_KEY;
  exports.Group = Group;
  exports.GroupManager = GroupManager;
  exports.IS = IS;
  exports.IS_DETACH_ALLOWED = IS_DETACH_ALLOWED;
  exports.IS_GROUP_KEY = IS_GROUP_KEY;
  exports.ImageEndpoint = ImageEndpoint;
  exports.JSPLUMB_GRADIENT = JSPLUMB_GRADIENT;
  exports.LINEAR_GRADIENT = LINEAR_GRADIENT;
  exports.LINE_WIDTH = LINE_WIDTH;
  exports.LabelOverlay = LabelOverlay;
  exports.NONE = NONE;
  exports.Overlay = Overlay;
  exports.OverlayCapableComponent = OverlayCapableComponent;
  exports.OverlayFactory = OverlayFactory;
  exports.PlainArrowOverlay = PlainArrowOverlay;
  exports.RADIAL_GRADIENT = RADIAL_GRADIENT;
  exports.RectangleEndpoint = RectangleEndpoint;
  exports.SELECTOR_CONNECTOR = SELECTOR_CONNECTOR;
  exports.SELECTOR_ENDPOINT = SELECTOR_ENDPOINT;
  exports.SELECTOR_GROUP_CONTAINER = SELECTOR_GROUP_CONTAINER;
  exports.SELECTOR_OVERLAY = SELECTOR_OVERLAY;
  exports.SOURCE = SOURCE;
  exports.SOURCE_DEFINITION_LIST = SOURCE_DEFINITION_LIST;
  exports.SOURCE_INDEX = SOURCE_INDEX;
  exports.STOP = STOP;
  exports.STROKE = STROKE;
  exports.STROKE_DASHARRAY = STROKE_DASHARRAY;
  exports.STROKE_WIDTH = STROKE_WIDTH;
  exports.STYLE = STYLE;
  exports.StateMachine = StateMachine;
  exports.StraightConnector = StraightConnector;
  exports.StraightSegment = StraightSegment;
  exports.SvgComponent = SvgComponent;
  exports.SvgEndpoint = SvgEndpoint;
  exports.TARGET = TARGET;
  exports.TARGET_DEFINITION_LIST = TARGET_DEFINITION_LIST;
  exports.TARGET_INDEX = TARGET_INDEX;
  exports.WILDCARD = WILDCARD;
  exports.X_AXIS_FACES = X_AXIS_FACES;
  exports.Y_AXIS_FACES = Y_AXIS_FACES;
  exports._appendAtIndex = _appendAtIndex;
  exports._applyStyles = _applyStyles;
  exports._attr = _attr;
  exports._clearGradient = _clearGradient;
  exports._mergeOverrides = _mergeOverrides;
  exports._node = _node;
  exports._pos = _pos;
  exports._removeTypeCssHelper = _removeTypeCssHelper;
  exports._timestamp = _timestamp;
  exports._updateGradient = _updateGradient;
  exports._updateHoverStyle = _updateHoverStyle;
  exports.addToList = addToList;
  exports.addWithFunction = addWithFunction;
  exports.clone = clone;
  exports.cls = cls;
  exports.consume = consume;
  exports.each = each;
  exports.extend = extend;
  exports.fastTrim = fastTrim;
  exports.findParent = findParent;
  exports.findWithFunction = findWithFunction;
  exports.functionChain = functionChain;
  exports.isArray = isArray;
  exports.isBoolean = isBoolean;
  exports.isDate = isDate;
  exports.isEmpty = isEmpty;
  exports.isFunction = isFunction;
  exports.isNamedFunction = isNamedFunction;
  exports.isNull = isNull;
  exports.isNumber = isNumber;
  exports.isString = isString;
  exports.jsPlumbInstance = jsPlumbInstance;
  exports.log = log;
  exports.logEnabled = logEnabled;
  exports.makeAnchorFromSpec = makeAnchorFromSpec;
  exports.map = map;
  exports.matchesSelector = matchesSelector;
  exports.merge = merge;
  exports.mergeWithParents = mergeWithParents;
  exports.populate = populate;
  exports.registerEndpointRenderer = registerEndpointRenderer;
  exports.remove = remove;
  exports.removeWithFunction = removeWithFunction;
  exports.replace = replace;
  exports.sizeElement = sizeElement;
  exports.sortHelper = sortHelper;
  exports.suggest = suggest;
  exports.uuid = uuid;
  exports.wrap = wrap;

  Object.defineProperty(exports, '__esModule', { value: true });

}));

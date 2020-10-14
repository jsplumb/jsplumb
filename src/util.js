
(function() {

    var root = this;
    root.jsPlumbUtil = root.jsPlumbUtil || {};
    var jsPlumbUtil = root.jsPlumbUtil;

    if (typeof exports !=='undefined') { exports.jsPlumbUtil = jsPlumbUtil;}


    /**
     * Tests if the given object is an Array.
     * @param a
     */
    function isArray(a) {
        return Object.prototype.toString.call(a) === "[object Array]";
    }
    jsPlumbUtil.isArray = isArray;
    /**
     * Tests if the given object is a Number.
     * @param n
     */
    function isNumber(n) {
        return Object.prototype.toString.call(n) === "[object Number]";
    }
    jsPlumbUtil.isNumber = isNumber;
    function isString(s) {
        return typeof s === "string";
    }
    jsPlumbUtil.isString = isString;
    function isBoolean(s) {
        return typeof s === "boolean";
    }
    jsPlumbUtil.isBoolean = isBoolean;
    function isNull(s) {
        return s == null;
    }
    jsPlumbUtil.isNull = isNull;
    function isObject(o) {
        return o == null ? false : Object.prototype.toString.call(o) === "[object Object]";
    }
    jsPlumbUtil.isObject = isObject;
    function isDate(o) {
        return Object.prototype.toString.call(o) === "[object Date]";
    }
    jsPlumbUtil.isDate = isDate;
    function isFunction(o) {
        return Object.prototype.toString.call(o) === "[object Function]";
    }
    jsPlumbUtil.isFunction = isFunction;
    function isNamedFunction(o) {
        return isFunction(o) && o.name != null && o.name.length > 0;
    }
    jsPlumbUtil.isNamedFunction = isNamedFunction;
    function isEmpty(o) {
        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                return false;
            }
        }
        return true;
    }
    jsPlumbUtil.isEmpty = isEmpty;
    function clone(a) {
        if (isString(a)) {
            return "" + a;
        }
        else if (isBoolean(a)) {
            return !!a;
        }
        else if (isDate(a)) {
            return new Date(a.getTime());
        }
        else if (isFunction(a)) {
            return a;
        }
        else if (isArray(a)) {
            var b = [];
            for (var i = 0; i < a.length; i++) {
                b.push(clone(a[i]));
            }
            return b;
        }
        else if (isObject(a)) {
            var c = {};
            for (var j in a) {
                c[j] = clone(a[j]);
            }
            return c;
        }
        else {
            return a;
        }
    }
    jsPlumbUtil.clone = clone;
    function merge(a, b, collations, overwrites) {
        // first change the collations array - if present - into a lookup table, because its faster.
        var cMap = {}, ar, i, oMap = {};
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
            }
            else if (isString(b[i]) || isBoolean(b[i])) {
                if (!cMap[i]) {
                    c[i] = b[i]; // if we dont want to collate, just copy it in.
                }
                else {
                    ar = [];
                    // if c's object is also an array we can keep its values.
                    ar.push.apply(ar, isArray(c[i]) ? c[i] : [c[i]]);
                    ar.push.apply(ar, isBoolean(b[i]) ? b[i] : [b[i]]);
                    c[i] = ar;
                }
            }
            else {
                if (isArray(b[i])) {
                    ar = [];
                    // if c's object is also an array we can keep its values.
                    if (isArray(c[i])) {
                        ar.push.apply(ar, c[i]);
                    }
                    ar.push.apply(ar, b[i]);
                    c[i] = ar;
                }
                else if (isObject(b[i])) {
                    // overwrite c's value with an object if it is not already one.
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
    jsPlumbUtil.merge = merge;
    function replace(inObj, path, value) {
        if (inObj == null) {
            return;
        }
        var q = inObj, t = q;
        path.replace(/([^\.])+/g, function (term, lc, pos, str) {
            var array = term.match(/([^\[0-9]+){1}(\[)([0-9+])/), last = pos + term.length >= str.length, _getArray = function () {
                return t[array[1]] || (function () {
                    t[array[1]] = [];
                    return t[array[1]];
                })();
            };
            if (last) {
                // set term = value on current t, creating term as array if necessary.
                if (array) {
                    _getArray()[array[3]] = value;
                }
                else {
                    t[term] = value;
                }
            }
            else {
                // set to current t[term], creating t[term] if necessary.
                if (array) {
                    var a_1 = _getArray();
                    t = a_1[array[3]] || (function () {
                        a_1[array[3]] = {};
                        return a_1[array[3]];
                    })();
                }
                else {
                    t = t[term] || (function () {
                        t[term] = {};
                        return t[term];
                    })();
                }
            }
            return "";
        });
        return inObj;
    }
    jsPlumbUtil.replace = replace;
    //
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
    jsPlumbUtil.functionChain = functionChain;
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
        var getValue = function (fromString) {
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
        // process one entry.
        var _one = function (d) {
            if (d != null) {
                if (isString(d)) {
                    return getValue(d);
                }
                else if (isFunction(d) && !doNotExpandFunctions && (functionPrefix == null || (d.name || "").indexOf(functionPrefix) === 0)) {
                    return d(values);
                }
                else if (isArray(d)) {
                    var r = [];
                    for (var i = 0; i < d.length; i++) {
                        r.push(_one(d[i]));
                    }
                    return r;
                }
                else if (isObject(d)) {
                    var s = {};
                    for (var j in d) {
                        s[j] = _one(d[j]);
                    }
                    return s;
                }
                else {
                    return d;
                }
            }
        };
        return _one(model);
    }
    jsPlumbUtil.populate = populate;
    /**
     * Find the index of a given object in an array.
     * @param a The array to search
     * @param f The function to run on each element. Return true if the element matches.
     * @returns {number} -1 if not found, otherwise the index in the array.
     */
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
    jsPlumbUtil.findWithFunction = findWithFunction;
    /**
     * Remove some element from an array by matching each element in the array against some predicate function. Note that this
     * is an in-place removal; the array is altered.
     * @param a The array to search
     * @param f The function to run on each element. Return true if the element matches.
     * @returns {boolean} true if removed, false otherwise.
     */
    function removeWithFunction(a, f) {
        var idx = findWithFunction(a, f);
        if (idx > -1) {
            a.splice(idx, 1);
        }
        return idx !== -1;
    }
    jsPlumbUtil.removeWithFunction = removeWithFunction;
    /**
     * Remove some element from an array by simple lookup in the array for the given element. Note that this
     * is an in-place removal; the array is altered.
     * @param l The array to search
     * @param v The value to remove.
     * @returns {boolean} true if removed, false otherwise.
     */
    function remove(l, v) {
        var idx = l.indexOf(v);
        if (idx > -1) {
            l.splice(idx, 1);
        }
        return idx !== -1;
    }
    jsPlumbUtil.remove = remove;
    /**
     * Add some element to the given array, unless it is determined that it is already in the array.
     * @param list The array to add the element to.
     * @param item The item to add.
     * @param hashFunction A function to use to determine if the given item already exists in the array.
     */
    function addWithFunction(list, item, hashFunction) {
        if (findWithFunction(list, hashFunction) === -1) {
            list.push(item);
        }
    }
    jsPlumbUtil.addWithFunction = addWithFunction;
    /**
     * Add some element to a list that is contained in a map of lists.
     * @param map The map of [ key -> list ] entries
     * @param key The name of the list to insert into
     * @param value The value to insert
     * @param insertAtStart Whether or not to insert at the start; defaults to false.
     */
    function addToList(map, key, value, insertAtStart) {
        var l = map[key];
        if (l == null) {
            l = [];
            map[key] = l;
        }
        l[insertAtStart ? "unshift" : "push"](value);
        return l;
    }
    jsPlumbUtil.addToList = addToList;
    /**
     * Add an item to a list, unless it is already in the list. The test for pre-existence is a simple list lookup.
     * If you want to do something more complex, perhaps #addWithFunction might help.
     * @param list List to add the item to
     * @param item Item to add
     * @param insertAtHead Whether or not to insert at the start; defaults to false.
     */
    function suggest(list, item, insertAtHead) {
        if (list.indexOf(item) === -1) {
            if (insertAtHead) {
                list.unshift(item);
            }
            else {
                list.push(item);
            }
            return true;
        }
        return false;
    }
    jsPlumbUtil.suggest = suggest;
    /**
     * Extends the given obj (which can be an array) with the given constructor function, prototype functions, and class members, any of which may be null.
     * @param child
     * @param parent
     * @param _protoFn
     */
    function extend(child, parent, _protoFn) {
        var i;
        parent = isArray(parent) ? parent : [parent];
        var _copyProtoChain = function (focus) {
            var proto = focus.__proto__;
            while (proto != null) {
                if (proto.prototype != null) {
                    for (var j in proto.prototype) {
                        if (proto.prototype.hasOwnProperty(j) && !child.prototype.hasOwnProperty(j)) {
                            child.prototype[j] = proto.prototype[j];
                        }
                    }
                    proto = proto.prototype.__proto__;
                }
                else {
                    proto = null;
                }
            }
        };
        for (i = 0; i < parent.length; i++) {
            for (var j in parent[i].prototype) {
                if (parent[i].prototype.hasOwnProperty(j) && !child.prototype.hasOwnProperty(j)) {
                    child.prototype[j] = parent[i].prototype[j];
                }
            }
            _copyProtoChain(parent[i]);
        }
        var _makeFn = function (name, protoFn) {
            return function () {
                for (i = 0; i < parent.length; i++) {
                    if (parent[i].prototype[name]) {
                        parent[i].prototype[name].apply(this, arguments);
                    }
                }
                return protoFn.apply(this, arguments);
            };
        };
        var _oneSet = function (fns) {
            for (var k in fns) {
                child.prototype[k] = _makeFn(k, fns[k]);
            }
        };
        if (arguments.length > 2) {
            for (i = 2; i < arguments.length; i++) {
                _oneSet(arguments[i]);
            }
        }
        return child;
    }
    jsPlumbUtil.extend = extend;
    var lut = [];
    for (var i = 0; i < 256; i++) {
        lut[i] = (i < 16 ? '0' : '') + (i).toString(16);
    }
    function uuid() {
        var d0 = Math.random() * 0xffffffff | 0;
        var d1 = Math.random() * 0xffffffff | 0;
        var d2 = Math.random() * 0xffffffff | 0;
        var d3 = Math.random() * 0xffffffff | 0;
        return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
            lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
            lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
            lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
    }
    jsPlumbUtil.uuid = uuid;
    /**
     * Trim a string.
     * @param s String to trim
     * @returns the String with leading and trailing whitespace removed.
     */
    function fastTrim(s) {
        if (s == null) {
            return null;
        }
        var str = s.replace(/^\s\s*/, ''), ws = /\s/, i = str.length;
        while (ws.test(str.charAt(--i))) {
        }
        return str.slice(0, i + 1);
    }
    jsPlumbUtil.fastTrim = fastTrim;
    function each(obj, fn) {
        obj = obj.length == null || typeof obj === "string" ? [obj] : obj;
        for (var i = 0; i < obj.length; i++) {
            fn(obj[i]);
        }
    }
    jsPlumbUtil.each = each;
    function map(obj, fn) {
        var o = [];
        for (var i = 0; i < obj.length; i++) {
            o.push(fn(obj[i]));
        }
        return o;
    }
    jsPlumbUtil.map = map;
    function mergeWithParents(type, map, parentAttribute) {
        parentAttribute = parentAttribute || "parent";
        var _def = function (id) {
            return id ? map[id] : null;
        };
        var _parent = function (def) {
            return def ? _def(def[parentAttribute]) : null;
        };
        var _one = function (parent, def) {
            if (parent == null) {
                return def;
            }
            else {
                var overrides = ["anchor", "anchors", "cssClass", "connector", "paintStyle", "hoverPaintStyle", "endpoint", "endpoints"];
                if (def.mergeStrategy === "override") {
                    Array.prototype.push.apply(overrides, ["events", "overlays"]);
                }
                var d_1 = merge(parent, def, [], overrides);
                return _one(_parent(parent), d_1);
            }
        };
        var _getDef = function (t) {
            if (t == null) {
                return {};
            }
            if (typeof t === "string") {
                return _def(t);
            }
            else if (t.length) {
                var done = false, i = 0, _dd = void 0;
                while (!done && i < t.length) {
                    _dd = _getDef(t[i]);
                    if (_dd) {
                        done = true;
                    }
                    else {
                        i++;
                    }
                }
                return _dd;
            }
        };
        var d = _getDef(type);
        if (d) {
            return _one(_parent(d), d);
        }
        else {
            return {};
        }
    }
    jsPlumbUtil.mergeWithParents = mergeWithParents;
    jsPlumbUtil.logEnabled = true;
    function log() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (jsPlumbUtil.logEnabled && typeof console !== "undefined") {
            try {
                var msg = arguments[arguments.length - 1];
                console.log(msg);
            }
            catch (e) {
            }
        }
    }
    jsPlumbUtil.log = log;
    /**
     * Wraps one function with another, creating a placeholder for the
     * wrapped function if it was null. this is used to wrap the various
     * drag/drop event functions - to allow jsPlumb to be notified of
     * important lifecycle events without imposing itself on the user's
     * drag/drop functionality.
     * @method jsPlumbUtil.wrap
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
            }
            catch (e) {
                log("jsPlumb function failed : " + e);
            }
            if ((wrappedFunction != null) && (returnOnThisValue == null || (r !== returnOnThisValue))) {
                try {
                    r = wrappedFunction.apply(this, arguments);
                }
                catch (e) {
                    log("wrapped function failed : " + e);
                }
            }
            return r;
        };
    }
    jsPlumbUtil.wrap = wrap;
    var EventGenerator = /** @class */ (function () {
        function EventGenerator() {
            var _this = this;
            this._listeners = {};
            this.eventsSuspended = false;
            this.tick = false;
            // this is a list of events that should re-throw any errors that occur during their dispatch.
            this.eventsToDieOn = { "ready": true };
            this.queue = [];
            this.bind = function (event, listener, insertAtStart) {
                var _one = function (evt) {
                    addToList(_this._listeners, evt, listener, insertAtStart);
                    listener.__jsPlumb = listener.__jsPlumb || {};
                    listener.__jsPlumb[uuid()] = evt;
                };
                if (typeof event === "string") {
                    _one(event);
                }
                else if (event.length != null) {
                    for (var i = 0; i < event.length; i++) {
                        _one(event[i]);
                    }
                }
                return _this;
            };
            this.fire = function (event, value, originalEvent) {
                if (!this.tick) {
                    this.tick = true;
                    if (!this.eventsSuspended && this._listeners[event]) {
                        var l = this._listeners[event].length, i = 0, _gone = false, ret = null;
                        if (!this.shouldFireEvent || this.shouldFireEvent(event, value, originalEvent)) {
                            while (!_gone && i < l && ret !== false) {
                                // doing it this way rather than catching and then possibly re-throwing means that an error propagated by this
                                // method will have the whole call stack available in the debugger.
                                if (this.eventsToDieOn[event]) {
                                    this._listeners[event][i].apply(this, [value, originalEvent]);
                                }
                                else {
                                    try {
                                        ret = this._listeners[event][i].apply(this, [value, originalEvent]);
                                    }
                                    catch (e) {
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
                }
                else {
                    this.queue.unshift(arguments);
                }
                return this;
            };
            this._drain = function () {
                var n = _this.queue.pop();
                if (n) {
                    _this.fire.apply(_this, n);
                }
            };
            this.unbind = function (eventOrListener, listener) {
                if (arguments.length === 0) {
                    this._listeners = {};
                }
                else if (arguments.length === 1) {
                    if (typeof eventOrListener === "string") {
                        delete this._listeners[eventOrListener];
                    }
                    else if (eventOrListener.__jsPlumb) {
                        var evt = void 0;
                        for (var i in eventOrListener.__jsPlumb) {
                            evt = eventOrListener.__jsPlumb[i];
                            remove(this._listeners[evt] || [], eventOrListener);
                        }
                    }
                }
                else if (arguments.length === 2) {
                    remove(this._listeners[eventOrListener] || [], listener);
                }
                return this;
            };
            this.getListener = function (forEvent) {
                return _this._listeners[forEvent];
            };
            this.setSuspendEvents = function (val) {
                _this.eventsSuspended = val;
            };
            this.isSuspendEvents = function () {
                return _this.eventsSuspended;
            };
            this.silently = function (fn) {
                _this.setSuspendEvents(true);
                try {
                    fn();
                }
                catch (e) {
                    log("Cannot execute silent function " + e);
                }
                _this.setSuspendEvents(false);
            };
            this.cleanupListeners = function () {
                for (var i in _this._listeners) {
                    _this._listeners[i] = null;
                }
            };
        }
        return EventGenerator;
    }());
    jsPlumbUtil.EventGenerator = EventGenerator;
    function rotatePoint(point, center, rotation) {
        var radial = [point[0] - center[0], point[1] - center[1]], cr = Math.cos(rotation / 360 * Math.PI * 2), sr = Math.sin(rotation / 360 * Math.PI * 2);
        return [
            (radial[0] * cr) - (radial[1] * sr) + center[0],
            (radial[1] * cr) + (radial[0] * sr) + center[1],
            cr,
            sr
        ];
    }
    jsPlumbUtil.rotatePoint = rotatePoint;
    function rotateAnchorOrientation(orientation, rotation) {
        var r = rotatePoint(orientation, [0, 0], rotation);
        return [
            Math.round(r[0]),
            Math.round(r[1])
        ];
    }
    jsPlumbUtil.rotateAnchorOrientation = rotateAnchorOrientation;

}).call(typeof window !== 'undefined' ? window : this);

/*
 * jsPlumb
 *
 * Title:jsPlumb 2.1.1
 *
 * Provides a way to visually connect elements on an HTML page, using SVG.
 *
 * This file contains utility functions that run in both browsers and headless.
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

    var _isa = function (a) {
            return Object.prototype.toString.call(a) === "[object Array]";
        },
        _isnum = function (n) {
            return Object.prototype.toString.call(n) === "[object Number]";
        },
        _iss = function (s) {
            return typeof s === "string";
        },
        _isb = function (s) {
            return typeof s === "boolean";
        },
        _isnull = function (s) {
            return s == null;
        },
        _iso = function (o) {
            return o == null ? false : Object.prototype.toString.call(o) === "[object Object]";
        },
        _isd = function (o) {
            return Object.prototype.toString.call(o) === "[object Date]";
        },
        _isf = function (o) {
            return Object.prototype.toString.call(o) === "[object Function]";
        },
        _isNamedFunction = function(o) {
            return _isf(o) && o.name != null && o.name.length > 0;
        },
        _ise = function (o) {
            for (var i in o) {
                if (o.hasOwnProperty(i)) return false;
            }
            return true;
        };

    var root = this;
    var exports = root.jsPlumbUtil = {
        isArray: _isa,
        isString: _iss,
        isBoolean: _isb,
        isNull: _isnull,
        isObject: _iso,
        isDate: _isd,
        isFunction: _isf,
        isEmpty: _ise,
        isNumber: _isnum,
        clone: function (a) {
            if (_iss(a)) return "" + a;
            else if (_isb(a)) return !!a;
            else if (_isd(a)) return new Date(a.getTime());
            else if (_isf(a)) return a;
            else if (_isa(a)) {
                var b = [];
                for (var i = 0; i < a.length; i++)
                    b.push(this.clone(a[i]));
                return b;
            }
            else if (_iso(a)) {
                var c = {};
                for (var j in a)
                    c[j] = this.clone(a[j]);
                return c;
            }
            else return a;
        },
        merge: function (a, b, collations) {
            // first change the collations array - if present - into a lookup table, because its faster.
            var cMap = {}, ar, i;
            collations = collations || [];
            for (i = 0; i < collations.length; i++)
                cMap[collations[i]] = true;

            var c = this.clone(a);
            for (i in b) {
                if (c[i] == null) {
                    c[i] = b[i];
                }
                else if (_iss(b[i]) || _isb(b[i])) {
                    if (!cMap[i]) {
                        c[i] = b[i]; // if we dont want to collate, just copy it in.
                    }
                    else {
                        ar = [];
                        // if c's object is also an array we can keep its values.
                        ar.push.apply(ar, _isa(c[i]) ? c[i] : [ c[i] ]);
                        ar.push.apply(ar, _isa(b[i]) ? b[i] : [ b[i] ]);
                        c[i] = ar;
                    }
                }
                else {
                    if (_isa(b[i])) {
                        ar = [];
                        // if c's object is also an array we can keep its values.
                        if (_isa(c[i])) ar.push.apply(ar, c[i]);
                        ar.push.apply(ar, b[i]);
                        c[i] = ar;
                    }
                    else if (_iso(b[i])) {
                        // overwite c's value with an object if it is not already one.
                        if (!_iso(c[i]))
                            c[i] = {};
                        for (var j in b[i]) {
                            c[i][j] = b[i][j];
                        }
                    }
                }

            }
            return c;
        },
        replace: function (inObj, path, value) {
            if (inObj == null) return;
            var q = inObj, t = q;
            path.replace(/([^\.])+/g, function (term, lc, pos, str) {
                var array = term.match(/([^\[0-9]+){1}(\[)([0-9+])/),
                    last = pos + term.length >= str.length,
                    _getArray = function () {
                        return t[array[1]] || (function () {
                            t[array[1]] = [];
                            return t[array[1]];
                        })();
                    };

                if (last) {
                    // set term = value on current t, creating term as array if necessary.
                    if (array)
                        _getArray()[array[3]] = value;
                    else
                        t[term] = value;
                }
                else {
                    // set to current t[term], creating t[term] if necessary.
                    if (array) {
                        var a = _getArray();
                        t = a[array[3]] || (function () {
                            a[array[3]] = {};
                            return a[array[3]];
                        })();
                    }
                    else
                        t = t[term] || (function () {
                            t[term] = {};
                            return t[term];
                        })();
                }
            });

            return inObj;
        },
        //
        // chain a list of functions, supplied by [ object, method name, args ], and return on the first
        // one that returns the failValue. if none return the failValue, return the successValue.
        //
        functionChain: function (successValue, failValue, fns) {
            for (var i = 0; i < fns.length; i++) {
                var o = fns[i][0][fns[i][1]].apply(fns[i][0], fns[i][2]);
                if (o === failValue) {
                    return o;
                }
            }
            return successValue;
        },
        // take the given model and expand out any parameters.
        // 'functionPrefix' is optional, and if present, helps jsplumb figure out what to do if a value is a Function.
        // if you do not provide it, jsplumb will run the given values through any functions it finds, and use the function's
        // output as the value in the result. if you do provide the prefix, only functions that are named and have this prefix
        // will be executed; other functions will be passed as values to the output.
        populate: function (model, values, functionPrefix) {
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
                },
            // process one entry.
                _one = function (d) {
                    if (d != null) {
                        if (_iss(d)) {
                            return getValue(d);
                        }
                        else if (_isf(d) && (functionPrefix == null || (d.name || "").indexOf(functionPrefix) === 0)) {
                            return d(values);
                        }
                        else if (_isa(d)) {
                            var r = [];
                            for (var i = 0; i < d.length; i++)
                                r.push(_one(d[i]));
                            return r;
                        }
                        else if (_iso(d)) {
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
        },
        findWithFunction: function (a, f) {
            if (a)
                for (var i = 0; i < a.length; i++) if (f(a[i])) return i;
            return -1;
        },
        removeWithFunction: function (a, f) {
            var idx = exports.findWithFunction(a, f);
            if (idx > -1) a.splice(idx, 1);
            return idx != -1;
        },
        remove: function (l, v) {
            var idx = l.indexOf(v);
            if (idx > -1) l.splice(idx, 1);
            return idx != -1;
        },
        // TODO support insert index
        addWithFunction: function (list, item, hashFunction) {
            if (exports.findWithFunction(list, hashFunction) == -1) list.push(item);
        },
        addToList: function (map, key, value, insertAtStart) {
            var l = map[key];
            if (l == null) {
                l = [];
                map[key] = l;
            }
            l[insertAtStart ? "unshift" : "push"](value);
            return l;
        },
        suggest : function(list, item, insertAtHead) {
            if (list.indexOf(item) === -1) {
                if (insertAtHead) {
                    list.unshift(item);
                } else {
                    list.push(item);
                }
                return true;
            }
            return false;
        },
        //
        // extends the given obj (which can be an array) with the given constructor function, prototype functions, and
        // class members, any of which may be null.
        //
        extend: function (child, parent, _protoFn) {
            var i;
            parent = _isa(parent) ? parent : [ parent ];

            for (i = 0; i < parent.length; i++) {
                for (var j in parent[i].prototype) {
                    if (parent[i].prototype.hasOwnProperty(j)) {
                        child.prototype[j] = parent[i].prototype[j];
                    }
                }
            }

            var _makeFn = function (name, protoFn) {
                return function () {
                    for (i = 0; i < parent.length; i++) {
                        if (parent[i].prototype[name])
                            parent[i].prototype[name].apply(this, arguments);
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
                for (i = 2; i < arguments.length; i++)
                    _oneSet(arguments[i]);
            }

            return child;
        },
        uuid: function () {
            return ('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            }));
        },
        logEnabled: true,
        log: function () {
            if (exports.logEnabled && typeof console != "undefined") {
                try {
                    var msg = arguments[arguments.length - 1];
                    console.log(msg);
                }
                catch (e) {
                }
            }
        },

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
        wrap: function (wrappedFunction, newFunction, returnOnThisValue) {
            wrappedFunction = wrappedFunction || function () {
            };
            newFunction = newFunction || function () {
            };
            return function () {
                var r = null;
                try {
                    r = newFunction.apply(this, arguments);
                } catch (e) {
                    exports.log("jsPlumb function failed : " + e);
                }
                if (returnOnThisValue == null || (r !== returnOnThisValue)) {
                    try {
                        r = wrappedFunction.apply(this, arguments);
                    } catch (e) {
                        exports.log("wrapped function failed : " + e);
                    }
                }
                return r;
            };
        }
    };

    exports.EventGenerator = function () {
        var _listeners = {},
            eventsSuspended = false,
        // this is a list of events that should re-throw any errors that occur during their dispatch. it is current private.
            eventsToDieOn = { "ready": true };

        this.bind = function (event, listener, insertAtStart) {
            var _one = function(evt) {
                exports.addToList(_listeners, evt, listener, insertAtStart);
                listener.__jsPlumb = listener.__jsPlumb || {};
                listener.__jsPlumb[root.jsPlumbUtil.uuid()] = evt;
            };

            if (typeof event === "string") _one(event);
            else if (event.length != null) {
                for (var i = 0; i < event.length; i++) {
                    _one(event[i]);
                }
            }

            return this;
        };

        this.fire = function (event, value, originalEvent) {
            if (!eventsSuspended && _listeners[event]) {
                var l = _listeners[event].length, i = 0, _gone = false, ret = null;
                if (!this.shouldFireEvent || this.shouldFireEvent(event, value, originalEvent)) {
                    while (!_gone && i < l && ret !== false) {
                        // doing it this way rather than catching and then possibly re-throwing means that an error propagated by this
                        // method will have the whole call stack available in the debugger.
                        if (eventsToDieOn[event])
                            _listeners[event][i].apply(this, [ value, originalEvent]);
                        else {
                            try {
                                ret = _listeners[event][i].apply(this, [ value, originalEvent ]);
                            } catch (e) {
                                exports.log("jsPlumb: fire failed for event " + event + " : " + e);
                            }
                        }
                        i++;
                        if (_listeners == null || _listeners[event] == null)
                            _gone = true;
                    }
                }
            }
            return this;
        };

        this.unbind = function (eventOrListener, listener) {

            if (arguments.length === 0) {
                _listeners = {};
            }
            else if (arguments.length === 1) {
                if (typeof eventOrListener === "string")
                    delete _listeners[eventOrListener];
                else if (eventOrListener.__jsPlumb) {
                    var evt;
                    for (var i in eventOrListener.__jsPlumb) {
                        evt = eventOrListener.__jsPlumb[i];
                        exports.remove(_listeners[evt] || [], eventOrListener);
                    }
                }
            }
            else if (arguments.length === 2) {
                exports.remove(_listeners[eventOrListener] || [], listener);
            }

            return this;
        };

        this.getListener = function (forEvent) {
            return _listeners[forEvent];
        };
        this.setSuspendEvents = function (val) {
            eventsSuspended = val;
        };
        this.isSuspendEvents = function () {
            return eventsSuspended;
        };
        this.silently = function(fn) {
            this.setSuspendEvents(true);
            try {
                fn();
            }
            catch (e) {
                root.jsPlumbUtil.log("Cannot execute silent function " + e);
            }
            this.setSuspendEvents(false);
        };
        this.cleanupListeners = function () {
            for (var i in _listeners) {
                _listeners[i] = null;
            }
        };
    };

    exports.EventGenerator.prototype = {
        cleanup: function () {
            this.cleanupListeners();
        }
    };

}).call(typeof window !== 'undefined' ? window : this);

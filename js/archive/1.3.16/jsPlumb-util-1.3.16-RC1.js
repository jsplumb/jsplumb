/*
 * jsPlumb
 * 
 * Title:jsPlumb 1.3.16
 * 
 * Provides a way to visually connect elements on an HTML page, using either SVG, Canvas
 * elements, or VML.  
 * 
 * This file contains the util functions
 *
 * Copyright (c) 2010 - 2012 Simon Porritt (http://jsplumb.org)
 * 
 * http://jsplumb.org
 * http://github.com/sporritt/jsplumb
 * http://code.google.com/p/jsplumb
 * 
 * Dual licensed under the MIT and GPL2 licenses.
 */
jsPlumbUtil = {
	isArray : function(a) {
		return Object.prototype.toString.call(a) === "[object Array]";	
	},
	isString : function(s) {
		return typeof s === "string";
	},
	isBoolean: function(s) {
		return typeof s === "boolean";
	},
	isObject : function(o) {
		return Object.prototype.toString.call(o) === "[object Object]";	
	},
	isDate : function(o) {
		return Object.prototype.toString.call(o) === "[object Date]";
	},
	isFunction: function(o) {
		return Object.prototype.toString.call(o) === "[object Function]";
	},
	clone : function(a) {
		if (this.isString(a)) return new String(a);
		else if (this.isBoolean(a)) return new Boolean(a);
		else if (this.isDate(a)) return new Date(a.getTime());
		else if (this.isFunction(a)) return a;
		else if (this.isArray(a)) {
			var b = [];
			for (var i = 0; i < a.length; i++)
				b.push(this.clone(a[i]));
			return b;
		}
		else if (this.isObject(a)) {
			var b = {};
			for (var i in a)
				b[i] = this.clone(a[i]);
			return b;		
		}
		else return a;
	},
	merge : function(a, b) {		
		var c = this.clone(a);		
		for (var i in b) {
			if (c[i] == null || this.isString(b[i]) || this.isBoolean(b[i]))
				c[i] = b[i];
			else {
				if (this.isArray(b[i]) && this.isArray(c[i])) {
					var ar = [];
					ar.push.apply(ar, c[i]);
					ar.push.apply(ar, b[i]);
					c[i] = ar;
				}
				else if(this.isObject(c[i]) && this.isObject(b[i])) {												
					for (var j in b[i])
						c[i][j] = b[i][j];
				}
			}
		}
		return c;
	},
	convertStyle : function(s, ignoreAlpha) {
		// TODO: jsPlumb should support a separate 'opacity' style member.
		if ("transparent" === s) return s;
		var o = s,
		    pad = function(n) { return n.length == 1 ? "0" + n : n; },
		    hex = function(k) { return pad(Number(k).toString(16)); },
		    pattern = /(rgb[a]?\()(.*)(\))/;
		if (s.match(pattern)) {
			var parts = s.match(pattern)[2].split(",");
			o = "#" + hex(parts[0]) + hex(parts[1]) + hex(parts[2]);
			if (!ignoreAlpha && parts.length == 4) 
				o = o + hex(parts[3]);
		}
		return o;
	},
	gradient : function(p1, p2) {
		p1 = jsPlumbUtil.isArray(p1) ? p1 : [p1.x, p1.y];
		p2 = jsPlumbUtil.isArray(p2) ? p2 : [p2.x, p2.y];			
		return (p2[1] - p1[1]) / (p2[0] - p1[0]);		
	},
	normal : function(p1, p2) {
		return -1 / jsPlumbUtil.gradient(p1,p2);
	},
	lineLength : function(p1, p2) {
		p1 = jsPlumbUtil.isArray(p1) ? p1 : [p1.x, p1.y];
		p2 = jsPlumbUtil.isArray(p2) ? p2 : [p2.x, p2.y];			
		return Math.sqrt(Math.pow(p2[1] - p1[1], 2) + Math.pow(p2[0] - p1[0], 2));			
	},
    segment : function(p1, p2) {
        p1 = jsPlumbUtil.isArray(p1) ? p1 : [p1.x, p1.y];
        p2 = jsPlumbUtil.isArray(p2) ? p2 : [p2.x, p2.y];
        if (p2[0] > p1[0]) {
            return (p2[1] > p1[1]) ? 2 : 1;
        }
        else {
            return (p2[1] > p1[1]) ? 3 : 4;
        }
    },
    intersects : function(r1, r2) {
    	var x1 = r1.x, x2 = r1.x + r1.w, y1 = r1.y, y2 = r1.y + r1.h,
    		a1 = r2.x, a2 = r2.x + r2.w, b1 = r2.y, b2 = r2.y + r2.h;
    		
    	return  ( (x1 <= a1 && a1 <= x2) && (y1 <= b1 && b1 <= y2) ) ||
    			( (x1 <= a2 && a2 <= x2) && (y1 <= b1 && b1 <= y2) ) ||
    			( (x1 <= a1 && a1 <= x2) && (y1 <= b2 && b2 <= y2) ) ||
    			( (x1 <= a2 && a1 <= x2) && (y1 <= b2 && b2 <= y2) ) ||
    			
    			( (a1 <= x1 && x1 <= a2) && (b1 <= y1 && y1 <= b2) ) ||
    			( (a1 <= x2 && x2 <= a2) && (b1 <= y1 && y1 <= b2) ) ||
    			( (a1 <= x1 && x1 <= a2) && (b1 <= y2 && y2 <= b2) ) ||
    			( (a1 <= x2 && x1 <= a2) && (b1 <= y2 && y2 <= b2) );
    },
    segmentMultipliers : [null, [1, -1], [1, 1], [-1, 1], [-1, -1] ],
    inverseSegmentMultipliers : [null, [-1, -1], [-1, 1], [1, 1], [1, -1] ],
	pointOnLine : function(fromPoint, toPoint, distance) {
        var m = jsPlumbUtil.gradient(fromPoint, toPoint),
            s = jsPlumbUtil.segment(fromPoint, toPoint),
		    segmentMultiplier = distance > 0 ? jsPlumbUtil.segmentMultipliers[s] : jsPlumbUtil.inverseSegmentMultipliers[s],
			theta = Math.atan(m),
    		y = Math.abs(distance * Math.sin(theta)) * segmentMultiplier[1],
			x =  Math.abs(distance * Math.cos(theta)) * segmentMultiplier[0];
		return { x:fromPoint.x + x, y:fromPoint.y + y };
	},
    /**
     * calculates a perpendicular to the line fromPoint->toPoint, that passes through toPoint and is 'length' long.
     * @param fromPoint
     * @param toPoint
     * @param length
     */
	perpendicularLineTo : function(fromPoint, toPoint, length) {
		var m = jsPlumbUtil.gradient(fromPoint, toPoint),
            theta2 = Math.atan(-1 / m),
    		y =  length / 2 * Math.sin(theta2),
			x =  length / 2 * Math.cos(theta2);
		return [{x:toPoint.x + x, y:toPoint.y + y}, {x:toPoint.x - x, y:toPoint.y - y}];
	},
	findWithFunction : function(a, f) {
    	if (a)
  			for (var i = 0; i < a.length; i++) if (f(a[i])) return i;
		return -1;
	},
	indexOf : function(l, v) {
		return jsPlumbUtil.findWithFunction(l, function(_v) { return _v == v; });	
	},
    removeWithFunction : function(a, f) {
        var idx = jsPlumbUtil.findWithFunction(a, f);
        if (idx > -1) a.splice(idx, 1);
        return idx != -1;
    },
    remove : function(l, v) {
    	var idx = jsPlumbUtil.indexOf(l, v);	
    	if (idx > -1) l.splice(idx, 1);
        return idx != -1;
    },
    // TODO support insert index
    addWithFunction : function(list, item, hashFunction) {
        if (jsPlumbUtil.findWithFunction(list, hashFunction) == -1) list.push(item);
    },
	addToList : function(map, key, value) {
		var l = map[key];
		if (l == null) {
			l = [], map[key] = l;
		}
		l.push(value);
		return l;
	},
	/**
	 * EventGenerator
	 * Superclass for objects that generate events - jsPlumb extends this, as does jsPlumbUIComponent, which all the UI elements extend.
	 */
	EventGenerator : function() {
		var _listeners = {}, self = this;
		
		// this is a list of events that should re-throw any errors that occur during their dispatch. as of 1.3.0 this is private to
		// jsPlumb, but it seems feasible that people might want to manipulate this list.  the thinking is that we don't want event
		// listeners to bring down jsPlumb - or do we.  i can't make up my mind about this, but i know i want to hear about it if the "ready"
		// event fails, because then my page has most likely not initialised.  so i have this halfway-house solution.  it will be interesting
		// to hear what other people think.
		var eventsToDieOn = [ "ready" ];
							    
		/*
		 * Binds a listener to an event.  
		 * 
		 * Parameters:
		 * 	event		-	name of the event to bind to.
		 * 	listener	-	function to execute.
		 */
		this.bind = function(event, listener) {
			jsPlumbUtil.addToList(_listeners, event, listener);		
			return self;		
		};
		/*
		 * Fires an update for the given event.
		 * 
		 * Parameters:
		 * 	event				-	event to fire
		 * 	value				-	value to pass to the event listener(s).
		 *  originalEvent	 	- 	the original event from the browser
		 */			
		this.fire = function(event, value, originalEvent) {
			if (_listeners[event]) {
				for ( var i = 0; i < _listeners[event].length; i++) {
					// doing it this way rather than catching and then possibly re-throwing means that an error propagated by this
					// method will have the whole call stack available in the debugger.
					if (jsPlumbUtil.findWithFunction(eventsToDieOn, function(e) { return e === event}) != -1)
						_listeners[event][i](value, originalEvent);
					else {
						// for events we don't want to die on, catch and log.
						try {
							_listeners[event][i](value, originalEvent);
						} catch (e) {
							jsPlumbUtil.log("jsPlumb: fire failed for event " + event + " : " + e);
						}
					}
				}
			}
			return self;
		};
		/*
		 * Clears either all listeners, or listeners for some specific event.
		 * 
		 * Parameters:
		 * 	event	-	optional. constrains the clear to just listeners for this event.
		 */
		this.unbind = function(event) {
			if (event)
				delete _listeners[event];
			else {
				_listeners = {};
			}
			return self;
		};
		
		this.getListener = function(forEvent) {
			return _listeners[forEvent];
		};		
	},
	logEnabled : true,
	log : function() {
	    if (jsPlumbUtil.logEnabled && typeof console != "undefined") {
            try {
                var msg = arguments[arguments.length - 1];
			    console.log(msg);
            }
            catch (e) {} 
        }
	},
	group : function(g) { if (jsPlumbUtil.logEnabled && typeof console != "undefined") console.group(g); },
	groupEnd : function(g) { if (jsPlumbUtil.logEnabled && typeof console != "undefined") console.groupEnd(g); },
	time : function(t) { if (jsPlumbUtil.logEnabled && typeof console != "undefined") console.time(t); },
	timeEnd : function(t) { if (jsPlumbUtil.logEnabled && typeof console != "undefined") console.timeEnd(t); }
};
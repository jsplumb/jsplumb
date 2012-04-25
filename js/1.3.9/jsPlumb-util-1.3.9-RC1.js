jsPlumbUtil = {
	isArray : function(a) {
		return Object.prototype.toString.call(a) === "[object Array]";	
	},
	isString : function(s) {
		return typeof s === "string";
	},
	isObject : function(o) {
		return Object.prototype.toString.call(o) === "[object Object]";	
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
	}
};
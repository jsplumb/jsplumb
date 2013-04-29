/**
* a set of Bezier curve functions that deal with Cubic Beziers, used by jsPlumb, and perhaps useful for other people.
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
* 	Calculates the distance that the given point lies from the given Cubic Bezier.  Note that it is computed relative to the center of the Bezier,
* so if you have stroked the curve with a wide pen you may wish to take that into account!  The distance returned is relative to the values 
* of the curve and the point - it will most likely be pixels.
* 
* gradientAtPoint(curve, location)
* 
* 	Calculates the gradient to the curve at the given location, as a decimal between 0 and 1 inclusive.
* 
* nearestPointOnCurve(point, curve) 
* 
*	Calculates the nearest point to the given point on the given curve.  The return value of this is a JS object literal, containing both the
*point's coordinates and also the 'location' of the point (see above), for example:  { point:{x:551,y:150}, location:0.263365 }.
* 
* pointOnCurve(curve, location)
* 
* 	Calculates the coordinates of the point on the given cubic Bezier curve at the given location.  
* 		
* pointAlongCurveFrom(curve, location, distance)
* 
* 	Calculates the coordinates of the point on the given curve that is 'distance' units from location.  'distance' should be in the same coordinate
* space as that used to construct the Bezier curve.  For an HTML Canvas usage, for example, distance would be a measure of pixels.
* 
* perpendicularToCurveAt(curve, location, length, distance)
* 
* 	Calculates the perpendicular to the given curve at the given location.  length is the length of the line you wish for (it will be centered
* on the point at 'location'). distance is optional, and allows you to specify a point along the path from the given location as the center of
* the perpendicular returned.  The return value of this is an array of two points: [ {x:...,y:...}, {x:...,y:...} ].  
* 
* quadraticPointOnCurve(curve, location)
* 
* 	Calculates the coordinates of the point on the given quadratic Bezier curve at the given location.  This function is used internally by
* pointOnCurve, and is exposed just because it seemed churlish not to do so.  But remember that all the other functions in this library deal with
* cubic Beziers. 
* 
* 
* references:
* 
* http://webdocs.cs.ualberta.ca/~graphics/books/GraphicsGems/gems/NearestPoint.c
* http://13thparallel.com/archive/bezier-curves/
* http://bimixual.org/AnimationLibrary/beziertangents.html
* 
*/

(function() {
	
	if(typeof Math.sgn == "undefined") {
		Math.sgn = function(x) { return x == 0 ? 0 : x > 0 ? 1 :-1; };
	}
	
	var Vectors = {
		subtract 	: 	function(v1, v2) { return {x:v1.x - v2.x, y:v1.y - v2.y }; },
		dotProduct	: 	function(v1, v2) { return (v1.x * v2.x)  + (v1.y * v2.y); },
		square		:	function(v) { return Math.sqrt((v.x * v.x) + (v.y * v.y)); },
		scale		:	function(v, s) { return {x:v.x * s, y:v.y * s }; }
	};
		
	var	MAXDEPTH = 64, EPSILON	= Math.pow(2.0,-MAXDEPTH-1), DEGREE = 3, W_DEGREE = 5;

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
	var _distanceFromCurve = function(point, curve) {
		var candidates = new Array(W_DEGREE);     
	    var w = _convertToBezier(point, curve);
	    var numSolutions = _findRoots(w, W_DEGREE, candidates, 0);
		var v = Vectors.subtract(point, curve[0]), dist = Vectors.square(v), t = 0.0;
	    for (var i = 0; i < numSolutions; i++) {
			v = Vectors.subtract(point, _bezier(curve, DEGREE, candidates[i], null, null));
	    	var newDist = Vectors.square(v);
	    	if (newDist < dist) {
	            dist = newDist;
	        	t = candidates[i];
		    }
	    }
	    v = Vectors.subtract(point, curve[DEGREE]);
		newDist = Vectors.square(v);
	    if (newDist < dist) {
	        dist = newDist;
	    	t = 1.0;
	    }
		return {location:t, distance:dist};
	};
	/**
	 * finds the nearest point on the curve to the given point.
	 */
	var _nearestPointOnCurve = function(point, curve) {    
		var td = _distanceFromCurve(point, curve);
	    return {point:_bezier(curve, DEGREE, td.location, null, null), location:td.location};
	};
	/**
	 * internal method; converts to 5th degree Bezier form.
	 */
	var _convertToBezier = function(point, curve) {
	    var c = new Array(DEGREE+1), d = new Array(DEGREE), cdTable = [], w = [];
	    var z = [ [1.0, 0.6, 0.3, 0.1], [0.4, 0.6, 0.6, 0.4], [0.1, 0.3, 0.6, 1.0] ];	
	    for (var i = 0; i <= DEGREE; i++) c[i] = Vectors.subtract(curve[i], point);
	    for (var i = 0; i <= DEGREE - 1; i++) { 
			d[i] = Vectors.subtract(curve[i+1], curve[i]);
			d[i] = Vectors.scale(d[i], 3.0);
	    }
	    for (var row = 0; row <= DEGREE - 1; row++) {
			for (var column = 0; column <= DEGREE; column++) {
				if (!cdTable[row]) cdTable[row] = [];
		    	cdTable[row][column] = Vectors.dotProduct(d[row], c[column]);
			}
	    }
	    for (i = 0; i <= W_DEGREE; i++) {
			if (!w[i]) w[i] = [];
			w[i].y = 0.0;
			w[i].x = parseFloat(i) / W_DEGREE;
	    }
	    var n = DEGREE, m = DEGREE-1;
	    for (var k = 0; k <= n + m; k++) {
			var lb = Math.max(0, k - m);
			var ub = Math.min(k, n);
			for (i = lb; i <= ub; i++) {
		    	j = k - i;
		    	w[i+j].y += cdTable[j][i] * z[j][i];
			}
	    }
	    return w;
	};
	/**
	 * counts how many roots there are.
	 */
	var _findRoots = function(w, degree, t, depth) {  
	    var  i;
	    var Left = new Array(W_DEGREE+1), Right = new Array(W_DEGREE+1);	
	    var left_count, right_count;	
	    var left_t = new Array(W_DEGREE+1), right_t = new Array(W_DEGREE+1);
	    switch (_getCrossingCount(w, degree)) {
	       	case 0 : {	
	       		return 0;	
	       	}
	       	case 1 : {	
	       		if (depth >= MAXDEPTH) {
	       			t[0] = (w[0].x + w[W_DEGREE].x) / 2.0;
	       			return 1;
	       		}
	       		if (_isControlPolygonFlatEnough(w, degree)) {
	       			t[0] = _computeXIntercept(w, degree);
	       			return 1;
	       		}
	       		break;
	       	}
	    }
	    _bezier(w, degree, 0.5, Left, Right);
	    left_count  = _findRoots(Left,  degree, left_t, depth+1);
	    right_count = _findRoots(Right, degree, right_t, depth+1);
	    for (i = 0; i < left_count; i++) t[i] = left_t[i];
	    for (i = 0; i < right_count; i++) t[i+left_count] = right_t[i];    
		return (left_count+right_count);
	};
	var _getCrossingCount = function(curve, degree) {
	    var 	n_crossings = 0;	
	    var		sign, old_sign;		    	
	    sign = old_sign = Math.sgn(curve[0].y);
	    for (var i = 1; i <= degree; i++) {
			sign = Math.sgn(curve[i].y);
			if (sign != old_sign) n_crossings++;
			old_sign = sign;
	    }
	    return n_crossings;
	};
	var _isControlPolygonFlatEnough = function(curve, degree) {
	    var  error;
	    var  intercept_1, intercept_2, left_intercept, right_intercept;
	    var  a, b, c, det, dInv, a1, b1, c1, a2, b2, c2;
	    a = curve[0].y - curve[degree].y;
	    b = curve[degree].x - curve[0].x;
	    c = curve[0].x * curve[degree].y - curve[degree].x * curve[0].y;
	
	    var max_distance_above = max_distance_below = 0.0;
	    
	    for (var i = 1; i < degree; i++) {
	        var value = a * curve[i].x + b * curve[i].y + c;       
	        if (value > max_distance_above)
	            max_distance_above = value;
	        else if (value < max_distance_below)
	        	max_distance_below = value;
	    }
	    
	    a1 = 0.0; b1 = 1.0; c1 = 0.0; a2 = a; b2 = b;
	    c2 = c - max_distance_above;
	    det = a1 * b2 - a2 * b1;
	    dInv = 1.0/det;
	    intercept_1 = (b1 * c2 - b2 * c1) * dInv;
	    a2 = a; b2 = b; c2 = c - max_distance_below;
	    det = a1 * b2 - a2 * b1;
	    dInv = 1.0/det;
	    intercept_2 = (b1 * c2 - b2 * c1) * dInv;
	    left_intercept = Math.min(intercept_1, intercept_2);
	    right_intercept = Math.max(intercept_1, intercept_2);
	    error = right_intercept - left_intercept;
	    return (error < EPSILON)? 1 : 0;
	};
	var _computeXIntercept = function(curve, degree) {
	    var XLK = 1.0, YLK = 0.0;
	    var XNM = curve[degree].x - curve[0].x, YNM = curve[degree].y - curve[0].y;
	    var XMK = curve[0].x - 0.0, YMK = curve[0].y - 0.0;
	    var det = XNM*YLK - YNM*XLK, detInv = 1.0/det;
	    var S = (XNM*YMK - YNM*XMK) * detInv; 
	    return 0.0 + XLK * S;
	};
	var _bezier = function(curve, degree, t, left, right) {
	    var temp = [[]];
	    for (var j =0; j <= degree; j++) temp[0][j] = curve[j];
	    for (var i = 1; i <= degree; i++) {	
			for (var j =0 ; j <= degree - i; j++) {
				if (!temp[i]) temp[i] = [];
				if (!temp[i][j]) temp[i][j] = {};
		    	temp[i][j].x = (1.0 - t) * temp[i-1][j].x + t * temp[i-1][j+1].x;
		    	temp[i][j].y = (1.0 - t) * temp[i-1][j].y + t * temp[i-1][j+1].y;
			}
	    }    
	    if (left != null) 
	    	for (j = 0; j <= degree; j++) left[j]  = temp[j][0];
	    if (right != null)
			for (j = 0; j <= degree; j++) right[j] = temp[degree-j][j];
	    
	    return (temp[degree][0]);
	};
	
	/**
	 * calculates a point on the curve, for a cubic bezier (TODO: fold this and the other function into one). 
	 * @param curve an array of control points, eg [{x:10,y:20}, {x:50,y:50}, {x:100,y:100}, {x:120,y:100}].  For a cubic bezier this should have four points.
	 * @param location a decimal indicating the distance along the curve the point should be located at.  this is the distance along the curve as it travels, taking the way it bends into account.  should be a number from 0 to 1, inclusive.
	 */
	var _pointOnPath = function(curve, location) {
		// from http://13thparallel.com/archive/bezier-curves/
		function B1(t) { return t*t*t };
		function B2(t) { return 3*t*t*(1-t) };
		function B3(t) { return 3*t*(1-t)*(1-t) };
		function B4(t) { return (1-t)*(1-t)*(1-t) };
		
		var x = curve[0].x*B1(location) + curve[1].x * B2(location) + curve[2].x * B3(location) + curve[3].x * B4(location);
		var y = curve[0].y*B1(location) + curve[1].y * B2(location) + curve[2].y * B3(location) + curve[3].y * B4(location);
		//return [x,y];
		return {x:x, y:y};
	};
	
	/**
	 * calculates a point on the curve, for a quadratic bezier (TODO: fold this and the other function into one). 
	 * @param curve an array of control points, eg [{x:10,y:20}, {x:50,y:50}, {x:100,y:100}].  For a quadratic bezier this should have three points.
	 * @param location a decimal indicating the distance along the curve the point should be located at.  this is the distance along the curve as it travels, taking the way it bends into account.  should be a number from 0 to 1, inclusive.
	 */
	var _quadraticPointOnPath = function(curve, location) {
		function B1(t) { return t*t; };
		function B2(t) { return 2*t*(1-t); };
		function B3(t) { return (1-t)*(1-t); };
		var x = curve[0].x*B1(location) + curve[1].x*B2(location) + curve[2].x*B3(location);
		var y = curve[0].y*B1(location) + curve[1].y*B2(location) + curve[2].y*B3(location);
		return {x:x,y:y};
	};
	
	/**
	 * finds the point that is 'distance' along the path from 'location'.  this method returns both the x,y location of the point and also
	 * its 'location' (proportion of travel along the path); the method below - _pointAlongPathFrom - calls this method and just returns the
	 * point.
	 */
	var _pointAlongPath = function(curve, location, distance) {
		var _dist = function(p1,p2) { return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)); };
		var prev = _pointOnPath(curve, location), tally = 0, curLoc = location, direction = distance > 0 ? 1 : -1, cur = null;
		while (tally < Math.abs(distance)) {
			curLoc += (0.005 * direction);
			cur = _pointOnPath(curve, curLoc);
			tally += _dist(cur, prev);	
			prev = cur;
		}
		return {point:cur, location:curLoc};        	
	};
	
	/**
	 * finds the point that is 'distance' along the path from 'location'.  this method returns both the x,y location of the point and also
	 * its 'location' (proportion of travel along the path).
	 */
	var _pointAlongPathFrom = function(curve, location, distance) {
		return _pointAlongPath(curve, location, distance).point;
	};
	
	/**
	 * returns the gradient of the connector at the given location, which is a decimal between 0 and 1 inclusive.
	 * 
	 * thanks // http://bimixual.org/AnimationLibrary/beziertangents.html
	 */
	var _gradientAtPoint = function(curve, location) {
		var p1 = _pointOnPath(curve, location);	
		var p2 = _quadraticPointOnPath(curve, location);
		var dy = p2.y - p1.y, dx = p2.x - p1.x;
		return Math.atan(dy / dx);		
	};

	/**
	 * calculates a line that is 'length' pixels long, perpendicular to, and centered on, the path at 'distance' pixels from the given location.
	 * if distance is not supplied, the perpendicular for the given location is computed (ie. we set distance to zero).
	 */
	var _perpendicularToPathAt = function(curve, location, length, distance) {
		distance = distance == null ? 0 : distance;
		var p = _pointAlongPath(curve, location, distance);
		var m = _gradientAtPoint(curve, p.location);
		var _theta2 = Math.atan(-1 / m);
		var y =  length / 2 * Math.sin(_theta2);
		var x =  length / 2 * Math.cos(_theta2);
		return [{x:p.point.x + x, y:p.point.y + y}, {x:p.point.x - x, y:p.point.y - y}];
	};
	
	var jsBezier = window.jsBezier = {
		distanceFromCurve : _distanceFromCurve,
		gradientAtPoint : _gradientAtPoint,
		nearestPointOnCurve : _nearestPointOnCurve,
		pointOnCurve : _pointOnPath,		
		pointAlongCurveFrom : _pointAlongPathFrom,
		perpendicularToCurveAt : _perpendicularToPathAt,
		quadraticPointOnCurve : _quadraticPointOnPath			//TODO fold the two pointOnPath functions into one; it can detect what it was given.
	};
})();

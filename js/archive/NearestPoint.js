(function() {
var	MAXDEPTH = 64, EPSILON	= Math.pow(2.0,-MAXDEPTH-1), DEGREE = 3, W_DEGREE = 5;
var V2Sub = function(from, p) { return {x:from.x - p.x, y:from.y - p.y }; };
var V2Dot = function(v1, v2) { return (v1.x * v2.x)  + (v1.y * v2.y); };
var V2SquaredLength = function(v) { return (v.x * v.x) + (v.y * v.y); };
var V2ScaleII = function(v, s) { return {x:v.x * s, y:v.y * s }; };
var DistanceFromCurve = function(P, V) {
	var w, n_solutions, t;			
    var 	t_candidate = new Array(W_DEGREE);     
    w = ConvertToBezierForm(P, V);
    n_solutions = FindRoots(w, W_DEGREE, t_candidate, 0);
    var	dist, new_dist, p, v, i;
	v = V2Sub(P, V[0]);
	dist = V2SquaredLength(v);
    t = 0.0;
    for (i = 0; i < n_solutions; i++) {
    	p = Bezier(V, DEGREE, t_candidate[i],
		null, null);
		v = V2Sub(P, p);
    	new_dist = V2SquaredLength(v);
    	if (new_dist < dist) {
            	dist = new_dist;
        		t = t_candidate[i];
	    }
    }
    v = V2Sub(P, V[DEGREE]);
	new_dist = V2SquaredLength(v);
    	if (new_dist < dist) {
        	dist = new_dist;
    	t = 1.0;
    }
	return {t:t,d:dist};
};
var NearestPointOnCurve = function(P, V) {    
	var td = DistanceFromCurve(P, V);
    return Bezier(V, DEGREE, td.t, null, null);
};
var ConvertToBezierForm = function(P, V) {
    var i, j, k, m, n, ub, lb, w, row, column;
    var c = new Array(DEGREE+1), d = new Array(DEGREE);
    var cdTable = [];
    var z = [ [1.0, 0.6, 0.3, 0.1], [0.4, 0.6, 0.6, 0.4], [0.1, 0.3, 0.6, 1.0] ];	
    for (i = 0; i <= DEGREE; i++)
		c[i] = V2Sub(V[i], P);
    for (i = 0; i <= DEGREE - 1; i++) { 
		d[i] = V2Sub(V[i+1], V[i]);
		d[i] = V2ScaleII(d[i], 3.0);
    }
    for (row = 0; row <= DEGREE - 1; row++) {
		for (column = 0; column <= DEGREE; column++) {
			if (!cdTable[row]) cdTable[row] = [];
	    	cdTable[row][column] = V2Dot(d[row], c[column]);
		}
    }
    w = [];
    for (i = 0; i <= W_DEGREE; i++) {
		if (!w[i]) w[i] = [];
		w[i].y = 0.0;
		w[i].x = parseFloat(i) / W_DEGREE;
    }
    n = DEGREE;
    m = DEGREE-1;
    for (k = 0; k <= n + m; k++) {
		lb = Math.max(0, k - m);
		ub = Math.min(k, n);
		for (i = lb; i <= ub; i++) {
	    	j = k - i;
	    	w[i+j].y += cdTable[j][i] * z[j][i];
		}
    }
    return (w);
};
var FindRoots = function(w, degree, t, depth) {  
    var  i;
    var Left = new Array(W_DEGREE+1), Right = new Array(W_DEGREE+1);	
    var left_count, right_count;	
    var left_t = new Array(W_DEGREE+1), right_t = new Array(W_DEGREE+1);
    switch (CrossingCount(w, degree)) {
       	case 0 : {	
       		return 0;	
       	}
       	case 1 : {	
       		if (depth >= MAXDEPTH) {
       			t[0] = (w[0].x + w[W_DEGREE].x) / 2.0;
       			return 1;
       		}
       		if (ControlPolygonFlatEnough(w, degree)) {
       			t[0] = ComputeXIntercept(w, degree);
       			return 1;
       		}
       		break;
       	}
    }
    Bezier(w, degree, 0.5, Left, Right);
    left_count  = FindRoots(Left,  degree, left_t, depth+1);
    right_count = FindRoots(Right, degree, right_t, depth+1);
    for (i = 0; i < left_count; i++) t[i] = left_t[i];
    for (i = 0; i < right_count; i++) t[i+left_count] = right_t[i];    
	return (left_count+right_count);
};
var CrossingCount = function(V, degree) {
    var 	n_crossings = 0;	
    var		sign, old_sign;		
	var SGN = function(x) { return x == 0 ? 0 : x > 0 ? 1 :-1; };
    sign = old_sign = SGN(V[0].y);
    for (var i = 1; i <= degree; i++) {
		sign = SGN(V[i].y);
		if (sign != old_sign) n_crossings++;
		old_sign = sign;
    }
    return n_crossings;
};
var ControlPolygonFlatEnough = function(V, degree) {
    var  value, error;
    var  intercept_1, intercept_2, left_intercept, right_intercept;
    var  a, b, c, det, dInv, a1, b1, c1, a2, b2, c2;
    a = V[0].y - V[degree].y;
    b = V[degree].x - V[0].x;
    c = V[0].x * V[degree].y - V[degree].x * V[0].y;

    var max_distance_above = max_distance_below = 0.0;
    
    for (var i = 1; i < degree; i++)
    {
        value = a * V[i].x + b * V[i].y + c;
       
        if (value > max_distance_above)
        {
            max_distance_above = value;
        }
        else if (value < max_distance_below)
        {
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
    dInv = 1.0/det;
    intercept_1 = (b1 * c2 - b2 * c1) * dInv;
    a2 = a;
    b2 = b;
    c2 = c - max_distance_below;
    det = a1 * b2 - a2 * b1;
    dInv = 1.0/det;
    intercept_2 = (b1 * c2 - b2 * c1) * dInv;
    left_intercept = Math.min(intercept_1, intercept_2);
    right_intercept = Math.max(intercept_1, intercept_2);
    error = right_intercept - left_intercept;
    return (error < EPSILON)? 1 : 0;
};
var ComputeXIntercept = function(V, degree) {
    var	XLK, YLK, XNM, YNM, XMK, YMK, det, detInv, S, T, X, Y;
    XLK = 1.0 - 0.0;
    YLK = 0.0 - 0.0;
    XNM = V[degree].x - V[0].x;
    YNM = V[degree].y - V[0].y;
    XMK = V[0].x - 0.0;
    YMK = V[0].y - 0.0;
    det = XNM*YLK - YNM*XLK;
    detInv = 1.0/det;
    S = (XNM*YMK - YNM*XMK) * detInv;
    X = 0.0 + XLK * S;
    return X;
};
var Bezier = function(V, degree, t, Left, Right) {
    var 	Vtemp = new Array();
    for (var j =0; j <= degree; j++) {
		if (!Vtemp[0]) Vtemp[0] = [];
		Vtemp[0][j] = V[j];
    }
    for (var i = 1; i <= degree; i++) {	
		for (var j =0 ; j <= degree - i; j++) {
			if (!Vtemp[i]) Vtemp[i] = [];
			if (!Vtemp[i][j]) Vtemp[i][j] = {};
	    	Vtemp[i][j].x = (1.0 - t) * Vtemp[i-1][j].x + t * Vtemp[i-1][j+1].x;
	    	Vtemp[i][j].y = (1.0 - t) * Vtemp[i-1][j].y + t * Vtemp[i-1][j+1].y;
		}
    }    
    if (Left != null) 
    	for (j = 0; j <= degree; j++) Left[j]  = Vtemp[j][0];
    if (Right != null)
		for (j = 0; j <= degree; j++) Right[j] = Vtemp[degree-j][j];
    return (Vtemp[degree][0]);
};
var bezCurve = [	
	{ x:0.0, y:0.0 },
	{ x:1.0, y:2.0 },
	{ x:3.0, y:3.0 },
	{ x:4.0, y:2.0 }
];
var arbPoint = { x:3.5, y:2.0 }; 
var	pointOnCurve;		 
pointOnCurve = NearestPointOnCurve(arbPoint, bezCurve);
jsPlumb.DistanceFromCurve = DistanceFromCurve;
jsPlumb.NearestPointOnCurve = NearestPointOnCurve;
})();
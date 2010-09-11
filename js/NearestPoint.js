/*
Solving the Nearest Point-on-Curve Problem 
and
A Bezier Curve-Based Root-Finder
by Philip J. Schneider
from "Graphics Gems", Academic Press, 1990
*/

 /*	point_on_curve.c	*/		
									
(function() {

	var	MAXDEPTH = 64;	/*  Maximum depth for recursion */
	var EPSILON	= Math.pow(2.0,-MAXDEPTH-1); /*Flatness control value */
	var	DEGREE =	3;			/*  Cubic Bezier curve		*/
	var W_DEGREE = 5;			/*  Degree of eqn to find roots of */

	var V2Sub = function(from, p) { return {x:from.x - p.x, y:from.y - p.y }; };
	var V2Dot = function(v1, v2) { return (v1.x * v2.x)  + (v1.y * v2.y); };
	var V2SquaredLength = function(v) { return (v.x * v.x) + (v.y * v.y); };
	var V2ScaleII = function(v, s) { return {x:v.x * s, y:v.y * s }; };
	
	/*
	* just returns the distance the given point is from the closest point on the curve (and that point's t number)
	* saves us the time of computing the point's x,y if we dont need it 
	* @see NearestPointOnCurve
	*/
	var DistanceFromCurve = function(P, V) {
		var w, n_solutions, t;			
	    var 	t_candidate = new Array(W_DEGREE);     
	    
	    /*  Convert problem to 5th-degree Bezier form	*/
	    w = ConvertToBezierForm(P, V);
	    /* Find all possible roots of 5th-degree equation */
	    n_solutions = FindRoots(w, W_DEGREE, t_candidate, 0);
	    /* Compare distances of P to all candidates, and to t=0, and t=1 */
		var	dist, new_dist, p, v, i;
		/* Check distance to beginning of curve, where t = 0	*/
		v = V2Sub(P, V[0]);
		dist = V2SquaredLength(v);
	    t = 0.0;
	
		/* Find distances for candidate points	*/
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
	
		/* Finally, look at distance to end point, where t = 1.0 */
		v = V2Sub(P, V[DEGREE]);
		new_dist = V2SquaredLength(v);
	    	if (new_dist < dist) {
	        	dist = new_dist;
	    	t = 1.0;
	    }
	
		return {t:t,d:dist};
	};

	/*
	 *  NearestPointOnCurve :
	 *  	Compute the parameter value of the point on a Bezier
	 *		curve segment closest to some arbtitrary, user-input point.
	 *		Return the point on the curve at that parameter value.
	 *
	 */
	var NearestPointOnCurve = function(P, V) {    
		var td = DistanceFromCurve(P, V);
	    return Bezier(V, DEGREE, td.t, null, null);
	};

	/*
	 *  ConvertToBezierForm :
	 *		Given a point and a Bezier curve, generate a 5th-degree
	 *		Bezier-format equation whose solution finds the point on the
	 *      curve nearest the user-defined point.
	 */
	var ConvertToBezierForm = function(P, V) {
	    var i, j, k, m, n, ub, lb, w, row, column;
	    var c = new Array(DEGREE+1), d = new Array(DEGREE);
	    var cdTable = [];
	    var z = [ [1.0, 0.6, 0.3, 0.1], [0.4, 0.6, 0.6, 0.4], [0.1, 0.3, 0.6, 1.0] ];
	
	    /*Determine the c's -- these are vectors created by subtracting*/
	    /* point P from each of the control points				*/
	    for (i = 0; i <= DEGREE; i++) {
			c[i] = V2Sub(V[i], P);
	    }
	    /* Determine the d's -- these are vectors created by subtracting*/
	    /* each control point from the next					*/
	    for (i = 0; i <= DEGREE - 1; i++) { 
			d[i] = V2Sub(V[i+1], V[i]);
			d[i] = V2ScaleII(d[i], 3.0);
	    }
	
	    /* Create the c,d table -- this is a table of dot products of the */
	    /* c's and d's							*/
	    for (row = 0; row <= DEGREE - 1; row++) {
			for (column = 0; column <= DEGREE; column++) {
				if (!cdTable[row]) cdTable[row] = [];
		    	cdTable[row][column] = V2Dot(d[row], c[column]);
			}
	    }
	
	    /* Now, apply the z's to the dot products, on the skew diagonal*/
	    /* Also, set up the x-values, making these "points"		*/
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

	/*
	 *  FindRoots :
	 *	Given a 5th-degree equation in Bernstein-Bezier form, find
	 *	all of the roots in the interval [0, 1].  Return the number
	 *	of roots found.
	 */
	var FindRoots = function(w, degree, t, depth) {  
	    var  i;
	    var Left = new Array(W_DEGREE+1), Right = new Array(W_DEGREE+1);	
	    var left_count, right_count;	
	    var left_t = new Array(W_DEGREE+1), right_t = new Array(W_DEGREE+1);
	
	    switch (CrossingCount(w, degree)) {
	       	case 0 : {	/* No solutions here	*/
	       		return 0;	
	       	}
	       	case 1 : {	/* Unique solution	*/
	       		/* Stop recursion when the tree is deep enough	*/
	       		/* if deep enough, return 1 solution at midpoint 	*/
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
	
	    /* Otherwise, solve recursively after	*/
	    /* subdividing control polygon		*/
	    Bezier(w, degree, 0.5, Left, Right);
	    left_count  = FindRoots(Left,  degree, left_t, depth+1);
	    right_count = FindRoots(Right, degree, right_t, depth+1);
	
	    /* Gather solutions together	*/
	    for (i = 0; i < left_count; i++) t[i] = left_t[i];
	    for (i = 0; i < right_count; i++) t[i+left_count] = right_t[i];    
	
	    /* Send back total number of solutions	*/
	    return (left_count+right_count);
	};

/*
 * CrossingCount :
 *	Count the number of times a Bezier control polygon 
 *	crosses the 0-axis. This number is >= the number of roots.
 *
 */
var CrossingCount = function(V, degree) {
    var 	i;	
    var 	n_crossings = 0;	/*  Number of zero-crossings	*/
    var		sign, old_sign;		/*  Sign of coefficients	*/

	var SGN = function(x) { return x == 0 ? 0 : x > 0 ? 1 :-1; };

    sign = old_sign = SGN(V[0].y);
    for (i = 1; i <= degree; i++) {
		sign = SGN(V[i].y);
		if (sign != old_sign) n_crossings++;
		old_sign = sign;
    }
    return n_crossings;
};

/*
 *  ControlPolygonFlatEnough :
 *	Check if the control polygon of a Bezier curve is flat enough
 *	for recursive subdivision to bottom out.
 *
 *  Corrections by James Walker, jw@jwwalker.com, as follows:

There seem to be errors in the ControlPolygonFlatEnough function in the
Graphics Gems book and the repository (NearestPoint.c). This function
is briefly described on p. 413 of the text, and appears on pages 793-794.
I see two main problems with it.

The idea is to find an upper bound for the error of approximating the x
intercept of the Bezier curve by the x intercept of the line through the
first and last control points. It is claimed on p. 413 that this error is
bounded by half of the difference between the intercepts of the bounding
box. I don't see why that should be true. The line joining the first and
last control points can be on one side of the bounding box, and the actual
curve can be near the opposite side, so the bound should be the difference
of the bounding box intercepts, not half of it.

Second, we come to the implementation. The values distance[i] computed in
the first loop are not actual distances, but squares of distances. I
realize that minimizing or maximizing the squares is equivalent to
minimizing or maximizing the distances.  But when the code claims that
one of the sides of the bounding box has equation
a * x + b * y + c + max_distance_above, where max_distance_above is one of
those squared distances, that makes no sense to me.

I have appended my version of the function. If you apply my code to the
cubic Bezier curve used to test NearestPoint.c,

 static Point2 bezCurve[4] = {    /  A cubic Bezier curve    /
    { 0.0, 0.0 },
    { 1.0, 2.0 },
    { 3.0, 3.0 },
    { 4.0, 2.0 },
    };

my code computes left_intercept = -3.0 and right_intercept = 0.0, which you
can verify by sketching a graph. The original code computes
left_intercept = 0.0 and right_intercept = 0.9.

 */

var ControlPolygonFlatEnough = function(V, degree) {
    var     i;        /* Index variable        */
    var  value;
    var  max_distance_above;
    var  max_distance_below;
    var  error;        /* Precision of root        */
    var  intercept_1,
            intercept_2,
            left_intercept,
            right_intercept;
    var  a, b, c;    /* Coefficients of implicit    */
            /* eqn for line from V[0]-V[deg]*/
    var  det, dInv;
    var  a1, b1, c1, a2, b2, c2;

    /* Derive the implicit equation for line connecting first *'
    /*  and last control points */
    a = V[0].y - V[degree].y;
    b = V[degree].x - V[0].x;
    c = V[0].x * V[degree].y - V[degree].x * V[0].y;

    max_distance_above = max_distance_below = 0.0;
    
    for (i = 1; i < degree; i++)
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

    /*  Implicit equation for zero line */
    a1 = 0.0;
    b1 = 1.0;
    c1 = 0.0;

    /*  Implicit equation for "above" line */
    a2 = a;
    b2 = b;
    c2 = c - max_distance_above;

    det = a1 * b2 - a2 * b1;
    dInv = 1.0/det;

    intercept_1 = (b1 * c2 - b2 * c1) * dInv;

    /*  Implicit equation for "below" line */
    a2 = a;
    b2 = b;
    c2 = c - max_distance_below;

    det = a1 * b2 - a2 * b1;
    dInv = 1.0/det;

    intercept_2 = (b1 * c2 - b2 * c1) * dInv;

    /* Compute intercepts of bounding box    */
    left_intercept = Math.min(intercept_1, intercept_2);
    right_intercept = Math.max(intercept_1, intercept_2);

    error = right_intercept - left_intercept;

    return (error < EPSILON)? 1 : 0;
};


/*
 *  ComputeXIntercept :
 *	Compute intersection of chord from first control point to last
 *  	with 0-axis.
 * 
 */
/* NOTE: "T" and "Y" do not have to be computed, and there are many useless
 * operations in the following (e.g. "0.0 - 0.0").
 */
var ComputeXIntercept = function(V, degree) {
    var	XLK, YLK, XNM, YNM, XMK, YMK;
    var	det, detInv;
    var	S, T;
    var	X, Y;

    XLK = 1.0 - 0.0;
    YLK = 0.0 - 0.0;
    XNM = V[degree].x - V[0].x;
    YNM = V[degree].y - V[0].y;
    XMK = V[0].x - 0.0;
    YMK = V[0].y - 0.0;

    det = XNM*YLK - YNM*XLK;
    detInv = 1.0/det;

    S = (XNM*YMK - YNM*XMK) * detInv;
/*  T = (XLK*YMK - YLK*XMK) * detInv; */

    X = 0.0 + XLK * S;
/*  Y = 0.0 + YLK * S; */

    return X;
};


/*
 *  Bezier : 
 *	Evaluate a Bezier curve at a particular parameter value
 *      Fill in control points for resulting sub-curves if "Left" and
 *	"Right" are non-null.
 * 
 */
var Bezier = function(V, degree, t, Left, Right) {
    var 	i, j;		/* Index variables	*/
    var 	Vtemp = new Array();//[W_DEGREE+1][W_DEGREE+1];


    /* Copy control points	*/
    for (j =0; j <= degree; j++) {
		if (!Vtemp[0]) Vtemp[0] = [];
		Vtemp[0][j] = V[j];
    }

    /* Triangle computation	*/
    for (i = 1; i <= degree; i++) {	
		for (j =0 ; j <= degree - i; j++) {
			if (!Vtemp[i]) Vtemp[i] = [];
			if (!Vtemp[i][j]) Vtemp[i][j] = {};
	    	Vtemp[i][j].x =
	      		(1.0 - t) * Vtemp[i-1][j].x + t * Vtemp[i-1][j+1].x;
	    	Vtemp[i][j].y =
	      		(1.0 - t) * Vtemp[i-1][j].y + t * Vtemp[i-1][j+1].y;
		}
    }
    
    if (Left != null) {
		for (j = 0; j <= degree; j++) {
	    	Left[j]  = Vtemp[j][0];
		}
    }
    if (Right != null) {
		for (j = 0; j <= degree; j++) {
	    	Right[j] = Vtemp[degree-j][j];
		}
    }

    return (Vtemp[degree][0]);
};


var bezCurve = [	
            	{ x:0.0, y:0.0 },
            	{ x:1.0, y:2.0 },
            	{ x:3.0, y:3.0 },
            	{ x:4.0, y:2.0 },
                ];
                var arbPoint = { x:3.5, y:2.0 }; 
            	var	pointOnCurve;		 

//            	print("EPSILON : " + EPSILON);
            //print(Math.pow(parseFloat(1.0), -65));
                pointOnCurve = NearestPointOnCurve(arbPoint, bezCurve);
                //alert("pointOnCurve : " + pointOnCurve.x + "," + pointOnCurve.y);


                window.DistanceFromCurve = DistanceFromCurve;
                window.NearestPointOnCurve = NearestPointOnCurve;
                
})();







/*
 *  main :
 *	Given a cubic Bezier curve (i.e., its control points), and some
 *	arbitrary point in the plane, find the point on the curve
 *	closest to that arbitrary point.
 *
var NearestPoint = function()
{
   
 var bezCurve = [	
	{ x:0.0, y:0.0 },
	{ x:1.0, y:2.0 },
	{ x:3.0, y:3.0 },
	{ x:4.0, y:2.0 },
    ];
    var arbPoint = { x:3.5, y:2.0 }; 
	var	pointOnCurve;		 

//	print("EPSILON : " + EPSILON);
//print(Math.pow(parseFloat(1.0), -65));
    pointOnCurve = NearestPointOnCurve(arbPoint, bezCurve);
    print("pointOnCurve : " + pointOnCurve.x + "," + pointOnCurve.y);
};*/
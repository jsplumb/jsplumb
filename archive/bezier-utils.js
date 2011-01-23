var MAX_DEPTH = 64;                                 // maximum recursion depth
var EPSILON = 1.0 * Math.pow(2, -MAX_DEPTH-1);    // flatness tolerance
  	
  	// pre-computed z(i,j)
var Z_CUBIC = [1.0, 0.6, 0.3, 0.1, 0.4, 0.6, 0.6, 0.4, 0.1, 0.3, 0.6, 1.0];
var Z_QUAD = [1.0, 2/3, 1/3, 1/3, 2/3, 1.0];

var Point = function(x, y) { return { x:x, y:y }; };

/**
 * computes the intersection of line segment from first to last control point with horizontal axis
 */
var computeXIntercept = function(_v/*:Array*/, _degree/*:uint*/)/*:Number*/ {
	var XNM/*:Number */= _v[_degree].x - _v[0].x;
	var YNM/*:Number */= _v[_degree].y - _v[0].y;
	var XMK/*:Number */= _v[0].x;
	var YMK/*:Number */= _v[0].y;

	var detInv/*:Number */= - 1.0/YNM;

	return (XNM*YMK - YNM*XMK) * detInv;
};

/**
 * returns how many times the Bezier curve cross the horizontal axis - the number of roots is less than or equal to this count.
 * @param _v
 * @param _degree
 * @return
 */
var crossingCount = function(_v/*:Array*/, _degree/*:uint*/)/*:uint*/ {
	var nCrossings/*:uint */= 0;
	var sign/*:int        */= _v[0].y < 0 ? -1 : 1;
	var oldSign/*:int     */= sign;
	for( var i/*:int*/=1; i<=_degree; ++i) {
		sign = _v[i].y < 0 ? -1 : 1;
		if( sign != oldSign ) 
			nCrossings++;
         
		oldSign = sign;
	}
  
	return nCrossings;
};

/**
 * return roots in [0,1] of a polynomial in Bernstein-Bezier form
 */
var findRoots = function(_w/*:Array*/, _degree/*:uint*/, _depth/*:uint*/)/*:Array*/ {  
	var t = new Array(); // t-values of roots
	//var m = 2*_degree-1;
	var m = _degree;
  
	switch( crossingCount(_w, _degree) ) {
    	case 0: 
    		return [];   
    		break;
       
    	case 1: 
    		// Unique solution - stop recursion when the tree is deep enough (return 1 solution at midpoint)
    		if( _depth >= MAX_DEPTH ) {
    			t[0] = 0.5*(_w[0].x + _w[m].x);
    			return t;
    		}
        
    		if( isControlPolygonLinear(_w, _degree) ) {
    			t[0] = computeXIntercept(_w, _degree);
    			return t;
    		}
    		break;
	}

	// Otherwise, solve recursively after subdividing control polygon
	var left = new Array(), right = new Array();
   
	// child solutions
     
	subdivide(_w, 0.5, left, right);
	var leftT = findRoots(left,  _degree, _depth+1);
	var rightT = findRoots(right, _degree, _depth+1);
 
	// Gather solutions together
	for( var i = 0; i<leftT.length; ++i) 
		t[i] = leftT[i];
   
	for( i=0; i<rightT.length; ++i) 
		t[i+leftT.length] = rightT[i];

	return t;
};

/**
 * convert 2D array indices in a k x n matrix to a linear index (this is an interim step ahead of a future implementation optimized for 1D array indexing)
 * @param _n
 * @param _row
 * @param _col
 * @return
 */
var getLinearIndex = function(_n/*:uint*/, _row/*:uint*/, _col/*:uint*/)/*:uint*/ {
	// no range-checking; you break it ... you buy it!
	return _row*_n + _col;
};

/**
 * returns whether or not the control polygon for a Bezier curve is suitably linear for subdivision to terminate.
 */
var isControlPolygonLinear = function(_v/*:Array*/, _degree/*:uint*/)/*:Boolean*/ {
  // Given array of control points, _v, find the distance from each interior control point to line connecting v[0] and v[degree]

	// implicit equation for line connecting first and last control points
	var a/*:Number */= _v[0].y - _v[_degree].y;
	var b/*:Number */= _v[_degree].x - _v[0].x;
	var c/*:Number */= _v[0].x * _v[_degree].y - _v[_degree].x * _v[0].y;

	var abSquared/*:Number */= a*a + b*b;
	var distance/*:Array   */= new Array();       // Distances from control points to line

	for( var i/*:uint*/=1; i<_degree; ++i) {
		// Compute distance from each of the points to that line
		distance[i] = a * _v[i].x + b * _v[i].y + c;
		if( distance[i] > 0.0 )
			distance[i] = (distance[i] * distance[i]) / abSquared;
		if( distance[i] < 0.0 )
			distance[i] = -((distance[i] * distance[i]) / abSquared);    
	}

	// Find the largest distance
	var maxDistanceAbove/*:Number*/ = 0.0;
	var maxDistanceBelow/*:Number*/ = 0.0;
	for( i=1; i<_degree; ++i) {
		if( distance[i] < 0.0 ) 
			maxDistanceBelow = Math.min(maxDistanceBelow, distance[i]);
    
		if( distance[i] > 0.0 ) 
			maxDistanceAbove = Math.max(maxDistanceAbove, distance[i]);    
	}

	// Implicit equation for zero line
	var a1 = 0.0, b1 = 1.0, c1 = 0.0;

	// Implicit equation for "above" line
	var a2 = a, b2 = b, c2 = c + maxDistanceAbove;

	var det = a1*b2 - a2*b1, dInv = 1.0/det, intercept1 = (b1*c2 - b2*c1)*dInv;

	//  	Implicit equation for "below" line
	a2 = a;
	b2 = b;
	c2 = c + maxDistanceBelow;
    
	var intercept2 = (b1*c2 - b2*c1)*dInv;

	// Compute intercepts of bounding box
	var leftIntercept = Math.min(intercept1, intercept2);
	var rightIntercept = Math.max(intercept1, intercept2);

	var error  = 0.5*(rightIntercept-leftIntercept);    
    
	return error < EPSILON;
};   

/**
* Returns the point at t(0-1) on the path.
**
var pathPointAt = function(curve, t) {
	
	//if(!source.length){return new Point(0,0);}   perhaps reinstate this at some stage
	
	var cleant = function(t, base) {
		base = base || NaN;
		if (isNaN(t)) t = base;
		else if (t < 0 || t > 1){
			t %= 1;
			if (t == 0) t = base;
			else if (t < 0) t += 1;
		}
		return t;
	};
	
	t = cleant(t);
	
	var curLength = 0;
	
	if (t == 0){
		var firstSegment= firstSegmentWithLength;
		curLength = firstSegment.segmentLength;
		return adjustPointToLayoutAndTransform(firstSegment.segmentPointAt(t));
	}
	else if (t == 1){
		return adjustPointToLayoutAndTransform(lastSegmentWithLength.segmentPointAt(t));
	}
	
	var tLength= t*pathLength;
	var lastLength= 0;
	var item;
	var n= source.length;
	
	for each (item in source){
		
		with(item){
			if (type != 0){
				curLength += segmentLength;
			}
			else{
				continue;
			}
			if (tLength <= curLength){
				return adjustPointToLayoutAndTransform(segmentPointAt((tLength - lastLength)/segmentLength));
			}
		}
		
		lastLength = curLength;
	}
	
	return new Point(0, 0);
};*/

/**
* subdivide( _c:Array, _t:Number, _left:Array, _right:Array ) - deCasteljau subdivision of an arbitrary-order Bezier curve
*
* @param _c:Array array of control points for the Bezier curve
* @param _t:Number t-parameter at which the curve is subdivided (must be in (0,1) = no check at this point
* @param _left:Array reference to an array in which the control points, <code>Array</code> of <code>Point</code> references, of the left control cage after subdivision are stored
* @param _right:Array reference to an array in which the control points, <code>Array</code> of <code>Point</code> references, of the right control cage after subdivision are stored
* @return nothing 
*
* @since 1.0
*
*/
var subdivide = function( _c/*:Array*/, _t/*:Number*/, _left/*:Array*/, _right/*:Array */)
{
	var degree = _c.length-1;
    var n = degree+1;
    var p= _c.slice();
    var t1 = 1.0 - _t;
      
    for( var i =1; i<=degree; ++i ) 
    {  
    	for( var j = 0; j<=degree-i; ++j ) 
        {
          var vertex = new Point();
          var ij       = getLinearIndex(n, i, j);
          var im1j = getLinearIndex(n, i-1, j);
          var im1jp1 = getLinearIndex(n, i-1, j+1);
          
          vertex.x = t1*p[im1j].x + _t*p[im1jp1].x;
          vertex.y = t1*p[im1j].y + _t*p[im1jp1].y;
          p[ij]    = vertex;
        }
     }
      
     for(j = 0; j <= degree; ++j ) {
    	 var index = getLinearIndex(n, j, 0);
        _left[j]       = p[index];
     }
        
     for(j = 0; j <= degree; ++j) {
      	 index     = getLinearIndex(n, degree-j, j);
        _right[j] = p[index];
     }
};

/**
 * computes control points of the polynomial resulting from the inner product of B(t)-P and B'(t), constructing the result as a Bezier
 * curve of order 2n-1, where n is the degree of B(t).
 * @param _p
 * @param _v
 * @return
 */
var toBezierForm = function (_p/*:Point*/, _v/*:Array*/)
{
	var row = 0;  // row index
	var column = 0;	// column index

	var c = new Array();  // V(i) - P
	var d = new Array();  // V(i+1) - V(i)
	var w = new Array();  // control-points for Bezier curve whose zeros represent candidates for closest point to the input parametric curve

	var n = _v.length-1;    // degree of B(t)
	var degree = 2*n-1;          // degree of B(t) . P

	var pX = _p.x, pY = _p.y;

	for( var i =0; i<=n; ++i ) {
		var v = _v[i];
		c[i] = new Point(v.x - pX, v.y - pY);
	}

	var s = Number(n);
	for( i=0; i<=n-1; ++i ) {
		v = _v[i];
		var v1 = _v[i+1];
		d[i] = new Point( s*(v1.x-v.x), s*(v1.y-v.y) );
	}

	var cd = new Array();

	// inner product table
	for( row=0; row<=n-1; ++row ) {
		var di = d[row];
		var dX = di.x;
		var dY = di.y;
	
		for( var col =0; col<=n; ++col ) {
			var k = getLinearIndex(n+1, row, col);
			cd[k] = dX*c[col].x + dY*c[col].y;
			k++;
		}
	}

	// Bezier is uniform parameterized
	var dInv = 1.0/Number(degree);
	for( i=0; i<=degree; ++i ) {
		w[i] = new Point(Number(i)*dInv, 0);
	}

	// reference to appropriate pre-computed coefficients
	var z = n == 3 ? Z_CUBIC : Z_QUAD;

	// accumulate y-coords of the control points along the skew diagonal of the (n-1) x n matrix of c.d and z values
	var m = n-1;
	for( k=0; k<=n+m; ++k ) {
		var lb = Math.max(0, k-m);
		var ub = Math.min(k, n);
		for( i=lb; i<=ub; ++i){
			var j = k - i;
			var p = w[i+j];
			var index = getLinearIndex(n+1, j, i);
			p.y += cd[index]*z[index];
			w[i+j] = p;
		}
	}

	return w;	
};


  var BezierUtils = window.BezierUtils = 
  {  	
  	
  	__dMinimum:0, // minimum distance (cached for accessor)
    
/**
* minDistance():Number [get] access the minimum distance
*
* @return Number mimimum distance from specified point to point on the Bezier curve.  Call after <code>closestPointToBezier()</code>.
*
* @since 1.0
*
*/   
    minDistance:function(){ return __dMinimum; },
    
/**
* closestPointToBezier Find the closest point on a quadratic or cubic Bezier curve to an arbitrary point
*
* @param _curve:Geometry reference that must be a quadratic or cubic Bezier3
* @param _p:Point reference to <code>Point</code> to which the closest point on the Bezier curve is desired
*
* @return Number t-parameter of the closest point on the parametric curve.  Returns 0 if inputs are <code>null</code> or not a valid reference to a Bezier curve.
*
* This code is derived from the Graphic Gem, "Solving the Nearest-Point-On-Curve Problem", by P.J. Schneider, published in 'Graphic Gems', 
* A.S. Glassner, ed., Academic Press, Boston, 1990, pp. 607-611.
*
* @since 1.0
*
*/
    // curve.pointAt(0)
    // curve.pointAt(1)
    // curve.x0, curve.y0, curve.cx, curve.cy, curve.cx1, curve.cy1, curve.x1, curve.y  <--  start/end points and two control points. jsplumb has these. 
    closestPointToBezier : function( _curve/*:Geometry*/, _p/*:Point */)/*:Number*/
    {
      // Note - until issue is resolved with pointAt() for cubic Beziers, you should always used AdvancedCubicBezier for closest point to a cubic
      // Bezier when you need to visually identify the point in an application.
      if( _curve == null || _p == null )
      {
      	return 0;
      }
      
      // tbd - dispatch a warning event in this instance
      /*if( !(_curve is QuadraticBezier) && !(_curve is CubicBezier) )
      {
      	return 0;
      }*/               //?? how to handle this in JS?
      
      // record distances from point to endpoints
      var p = _curve.pointAt(0);
      var deltaX = p.x-_p.x;
      var deltaY = p.y-_p.y;
      var d0 = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
      
      p             = _curve.pointAt(1);
      deltaX        = p.x-_p.x;
      deltaY        = p.y-_p.y;
      var d1 = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
      
      var n = _curve.isQuadraticBezier() ? 2 : 3;  // degree of input Bezier curve
      
      // array of control points
      var v = new Array();
      if( n == 2 )
      {
        var quad = _curve;// as QuadraticBezier;
        v[0]                     = new Point(quad.x0, quad.y0);
        v[1]                     = new Point(quad.cx, quad.cy);
        v[2]                     = new Point(quad.x1, quad.y1);
      }
      else
      {
        var cubic = _curve; //as CubicBezier;
        v[0]                  = new Point(cubic.x0 , cubic.y0 );
        v[1]                  = new Point(cubic.cx , cubic.cy );
        v[2]                  = new Point(cubic.cx1, cubic.cy1);
        v[3]                  = new Point(cubic.x1 , cubic.y1 );
      }
      
      // instaead of power form, convert the function whose zeros are required to Bezier form
      var w = toBezierForm(_p, v);
      
      // Find roots of the Bezier curve with control points stored in 'w' (algorithm is recursive, this is root depth of 0)
      var roots = findRoots(w, 2*n-1, 0);
      
      // compare the candidate distances to the endpoints and declare a winner :)
      if( d0 < d1 )
      {
      	var tMinimum = 0;
      	__dMinimum          = d0;
      }
      else
      {
      	tMinimum   = 1;
      	__dMinimum = d1;
      }
      
      // tbd - compare 2-norm squared
      for( var i =0; i<roots.length; ++i )
      {
      	 var t = roots[i];
      	 if( t >= 0 && t <= 1 )
      	 {
      	   try { 
      		   p = _curve.pointAt(t);
      		 deltaX       = p.x - _p.x;
        	   deltaY       = p.y - _p.y;
      	   }
      	   catch (e) {
      		   var www = 0;
      	   }
      	   
      	   var d = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
      	  
      	   if( d < __dMinimum )
      	   {
      	     tMinimum    = t;
      	     __dMinimum = d;
      	   }
      	 }
      }
      
      // tbd - alternate optima.
      return [__dMinimum, tMinimum];
    }                                     
};
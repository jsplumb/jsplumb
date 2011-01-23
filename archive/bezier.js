    function closestPointToBezier( _curve, _p )
    {
      if( _curve == null )
      {
      	return 0;
      }      
      
      // record distances from point to endpoints
      var x0 = _curve.start.x;
      var y0     = _curve.start.y;
      var deltaX = x0-_p.x;
      var deltaY = y0-_p.y;
      var d0 = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
      
      var x1 = _curve.end.x;
      var y1 = _curve.end.y;
      deltaX = x1-_p.x;
      deltaY = y1-_p.y;
      var d1 = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
      
      var n = 2; // degree of input Bezier curve
      
      // array of control points
      var v = [];
      v.push(_curve.cp1);v.push(_curve.cp2);
      /*for( var i=0; i<=n; ++i )
      {
      	v.push(_curve.getControlPoint(i));
      }*/
      
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
      for( i=0; i<roots.length; ++i )
      {
      	var t = roots[i];
      	if( t >= 0 && t <= 1 )
      	{
      	  deltaX       = _curve.getX(t) - _p.x;
      	  deltaY       = _curve.getY(t) - _p.y;
      	  var d = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
      	  
      	  if( d < __dMinimum )
      	  {
      	    tMinimum    = t;
      	    __dMinimum = d;
      	  }
      	}
      }
      
      // tbd - alternate optima.
      return tMinimum;
    } 
    
    // compute control points of the polynomial resulting from the inner product of B(t)-P and B'(t), constructing the result as a Bezier
    // curve of order 2n-1, where n is the degree of B(t).
    function toBezierForm(_p, _v)
    {
      var row = 0;  // row index
      var column = 0;	// column index
      
      var c = [];  // V(i) - P
      var d = [];  // V(i+1) - V(i)
      var w = [];  // control-points for Bezier curve whose zeros represent candidates for closest point to the input parametric curve
   
      var n      = _v.length-1;    // degree of B(t)
      var degree = 2*n-1;          // degree of B(t) . P
      
      var pX = _p.x;
      var pY = _p.y;
      
      for( var i =0; i<=n; ++i )
      {
        var v = _v[i];
        c[i]        = new Point(v.x - pX, v.y - pY);
      }
      
      var s = Number(n);
      for( i=0; i<=n-1; ++i )
      {
      	v            = _v[i];
      	var v1 = _v[i+1];
      	d[i]         = new Point( s*(v1.x-v.x), s*(v1.y-v.y) );
      }
      
      var cd = [];
      
      // inner product table
      for( row=0; row<=n-1; ++row )
      {
      	var di = d[row];
      	var dX = di.x;
      	var dY = di.y;
      	
      	for( var col =0; col<=n; ++col )
      	{
      	  var k = getLinearIndex(n+1, row, col);
      	  cd[k]      = dX*c[col].x + dY*c[col].y;
      	  k++;
      	}
      }
      
      // Bezier is uniform parameterized
      var dInv = 1.0 / degree;
      for( i=0; i<=degree; ++i )
      {
      	w[i] = new Point(Number(i)*dInv, 0);
      }
      
      // reference to appropriate pre-computed coefficients
      var z  = n == 3 ? Z_CUBIC : Z_QUAD;
      
      // accumulate y-coords of the control points along the skew diagonal of the (n-1) x n matrix of c.d and z values
      var m = n-1;
      for( k=0; k<=n+m; ++k ) 
      {
        var lb = Math.max(0, k-m);
        var ub = Math.min(k, n);
        for( i=lb; i<=ub; ++i) 
        {
          var j = k - i;
          var p = w[i+j];
          var index = getLinearIndex(n+1, j, i);
          p.y           += cd[index]*z[index];
          w[i+j]         = p;
        }
      }
      
      return w;	
    }
    
    // convert 2D array indices in a k x n matrix to a linear index (this is an interim step ahead of a future implementation optimized for 1D array indexing)
    function getLinearIndex(_n, _row, _col)
    {
      // no range-checking; you break it ... you buy it!
      return _row*_n + _col;
    }

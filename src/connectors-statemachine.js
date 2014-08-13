/*
 * jsPlumb
 * 
 * Title:jsPlumb 1.6.4
 * 
 * Provides a way to visually connect elements on an HTML page, using SVG or VML.  
 * 
 * This file contains the state machine connectors.
 *
 * Copyright (c) 2010 - 2014 Simon Porritt (simon@jsplumbtoolkit.com)
 * 
 * http://jsplumbtoolkit.com
 * http://github.com/sporritt/jsplumb
 * 
 * Dual licensed under the MIT and GPL2 licenses.
 */
 ;(function() {
	 
	"use strict";

	var Line = function(x1, y1, x2, y2) {

		this.m = (y2 - y1) / (x2 - x1);
		this.b = -1 * ((this.m * x1) - y1);
	
		this.rectIntersect = function(x,y,w,h) {
			var results = [], xInt, yInt;
		
			// 	try top face
			// 	the equation of the top face is y = (0 * x) + b; y = b.
			xInt = (y - this.b) / this.m;
			// test that the X value is in the line's range.
			if (xInt >= x && xInt <= (x + w)) results.push([ xInt, (this.m * xInt) + this.b ]);
		
			// try right face
			yInt = (this.m * (x + w)) + this.b;
			if (yInt >= y && yInt <= (y + h)) results.push([ (yInt - this.b) / this.m, yInt ]);
		
			// 	bottom face
			xInt = ((y + h) - this.b) / this.m;
			// test that the X value is in the line's range.
			if (xInt >= x && xInt <= (x + w)) results.push([ xInt, (this.m * xInt) + this.b ]);
		
			// try left face
			yInt = (this.m * x) + this.b;
			if (yInt >= y && yInt <= (y + h)) results.push([ (yInt - this.b) / this.m, yInt ]);

			if (results.length == 2) {
				var midx = (results[0][0] + results[1][0]) / 2, midy = (results[0][1] + results[1][1]) / 2;
				results.push([ midx,midy ]);
				// now calculate the segment inside the rectangle where the midpoint lies.
				var xseg = midx <= x + (w / 2) ? -1 : 1,
					yseg = midy <= y + (h / 2) ? -1 : 1;
				results.push([xseg, yseg]);
				return results;
			}
		
			return null;

		};
	},
	_segment = function(x1, y1, x2, y2) {
		if (x1 <= x2 && y2 <= y1) return 1;
		else if (x1 <= x2 && y1 <= y2) return 2;
		else if (x2 <= x1 && y2 >= y1) return 3;
		return 4;
	},
		
		// the control point we will use depends on the faces to which each end of the connection is assigned, specifically whether or not the
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
	_findControlPoint = function(midx, midy, segment, sourceEdge, targetEdge, dx, dy, distance, proximityLimit) {
        // TODO (maybe)
        // - if anchor pos is 0.5, make the control point take into account the relative position of the elements.
        if (distance <= proximityLimit) return [midx, midy];

        if (segment === 1) {
            if (sourceEdge[3] <= 0 && targetEdge[3] >= 1) return [ midx + (sourceEdge[2] < 0.5 ? -1 * dx : dx), midy ];
            else if (sourceEdge[2] >= 1 && targetEdge[2] <= 0) return [ midx, midy + (sourceEdge[3] < 0.5 ? -1 * dy : dy) ];
            else return [ midx + (-1 * dx) , midy + (-1 * dy) ];
        }
        else if (segment === 2) {
            if (sourceEdge[3] >= 1 && targetEdge[3] <= 0) return [ midx + (sourceEdge[2] < 0.5 ? -1 * dx : dx), midy ];
            else if (sourceEdge[2] >= 1 && targetEdge[2] <= 0) return [ midx, midy + (sourceEdge[3] < 0.5 ? -1 * dy : dy) ];
            else return [ midx + (1 * dx) , midy + (-1 * dy) ];
        }
        else if (segment === 3) {
            if (sourceEdge[3] >= 1 && targetEdge[3] <= 0) return [ midx + (sourceEdge[2] < 0.5 ? -1 * dx : dx), midy ];
            else if (sourceEdge[2] <= 0 && targetEdge[2] >= 1) return [ midx, midy + (sourceEdge[3] < 0.5 ? -1 * dy : dy) ];
            else return [ midx + (-1 * dx) , midy + (-1 * dy) ];
        }
        else if (segment === 4) {
            if (sourceEdge[3] <= 0 && targetEdge[3] >= 1) return [ midx + (sourceEdge[2] < 0.5 ? -1 * dx : dx), midy ];
            else if (sourceEdge[2] <= 0 && targetEdge[2] >= 1) return [ midx, midy + (sourceEdge[3] < 0.5 ? -1 * dy : dy) ];
            else return [ midx + (1 * dx) , midy + (-1 * dy) ];
        }

	};	
	
	/**
     * Class: Connectors.StateMachine
     * Provides 'state machine' connectors.
     */
	/*
	 * Function: Constructor
	 * 
	 * Parameters:
	 * curviness -	measure of how "curvy" the connectors will be.  this is translated as the distance that the
     *                Bezier curve's control point is from the midpoint of the straight line connecting the two
     *              endpoints, and does not mean that the connector is this wide.  The Bezier curve never reaches
     *              its control points; they act as gravitational masses. defaults to 10.
	 * margin	-	distance from element to start and end connectors, in pixels.  defaults to 5.
	 * proximityLimit  -   sets the distance beneath which the elements are consider too close together to bother
	 *						with fancy curves. by default this is 80 pixels.
	 * loopbackRadius	-	the radius of a loopback connector.  optional; defaults to 25.
	 * showLoopback   -   If set to false this tells the connector that it is ok to paint connections whose source and target is the same element with a connector running through the element. The default value for this is true; the connector always makes a loopback connection loop around the element rather than passing through it.
	*/
	var StateMachine = function(params) {
		params = params || {};
		this.type = "StateMachine";

		var self = this,
			_super =  jsPlumb.Connectors.AbstractConnector.apply(this, arguments),
			curviness = params.curviness || 10,
			margin = params.margin || 5,
			proximityLimit = params.proximityLimit || 80,
			clockwise = params.orientation && params.orientation === "clockwise",
			loopbackRadius = params.loopbackRadius || 25,
			showLoopback = params.showLoopback !== false;
		
		this._compute = function(paintInfo, params) {
			var w = Math.abs(params.sourcePos[0] - params.targetPos[0]),
				h = Math.abs(params.sourcePos[1] - params.targetPos[1]),
				x = Math.min(params.sourcePos[0], params.targetPos[0]),
				y = Math.min(params.sourcePos[1], params.targetPos[1]);				
		
			if (!showLoopback || (params.sourceEndpoint.elementId !== params.targetEndpoint.elementId)) {                            
				var _sx = params.sourcePos[0] < params.targetPos[0] ? 0  : w,
					_sy = params.sourcePos[1] < params.targetPos[1] ? 0:h,
					_tx = params.sourcePos[0] < params.targetPos[0] ? w : 0,
					_ty = params.sourcePos[1] < params.targetPos[1] ? h : 0;
            
				// now adjust for the margin
				if (params.sourcePos[2] === 0) _sx -= margin;
            	if (params.sourcePos[2] === 1) _sx += margin;
            	if (params.sourcePos[3] === 0) _sy -= margin;
            	if (params.sourcePos[3] === 1) _sy += margin;
            	if (params.targetPos[2] === 0) _tx -= margin;
            	if (params.targetPos[2] === 1) _tx += margin;
            	if (params.targetPos[3] === 0) _ty -= margin;
            	if (params.targetPos[3] === 1) _ty += margin;

            	//
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

				var _midx = (_sx + _tx) / 2, _midy = (_sy + _ty) / 2, 
            	    m2 = (-1 * _midx) / _midy, theta2 = Math.atan(m2),
            	    dy =  (m2 == Infinity || m2 == -Infinity) ? 0 : Math.abs(curviness / 2 * Math.sin(theta2)),
				    dx =  (m2 == Infinity || m2 == -Infinity) ? 0 : Math.abs(curviness / 2 * Math.cos(theta2)),
				    segment = _segment(_sx, _sy, _tx, _ty),
				    distance = Math.sqrt(Math.pow(_tx - _sx, 2) + Math.pow(_ty - _sy, 2)),			
	            	// calculate the control point.  this code will be where we'll put in a rudimentary element avoidance scheme; it
	            	// will work by extending the control point to force the curve to be, um, curvier.
					_controlPoint = _findControlPoint(_midx,
                                                  _midy,
                                                  segment,
                                                  params.sourcePos,
                                                  params.targetPos,
                                                  curviness, curviness,
                                                  distance,
                                                  proximityLimit);

				_super.addSegment(this, "Bezier", {
					x1:_tx, y1:_ty, x2:_sx, y2:_sy,
					cp1x:_controlPoint[0], cp1y:_controlPoint[1],
					cp2x:_controlPoint[0], cp2y:_controlPoint[1]
				});				
            }
            else {
            	// a loopback connector.  draw an arc from one anchor to the other.            	
        		var x1 = params.sourcePos[0], x2 = params.sourcePos[0], y1 = params.sourcePos[1] - margin, y2 = params.sourcePos[1] - margin, 				
					cx = x1, cy = y1 - loopbackRadius,				
					// canvas sizing stuff, to ensure the whole painted area is visible.
					_w = 2 * loopbackRadius, 
					_h = 2 * loopbackRadius,
					_x = cx - loopbackRadius, 
					_y = cy - loopbackRadius;

				paintInfo.points[0] = _x;
				paintInfo.points[1] = _y;
				paintInfo.points[2] = _w;
				paintInfo.points[3] = _h;
				
				// ADD AN ARC SEGMENT.
				_super.addSegment(this, "Arc", {
					loopback:true,
					x1:(x1 - _x) + 4,
					y1:y1 - _y,
					startAngle:0,
					endAngle: 2 * Math.PI,
					r:loopbackRadius,
					ac:!clockwise,
					x2:(x1 - _x) - 4,
					y2:y1 - _y,
					cx:cx - _x,
					cy:cy - _y
				});
            }                           
        };                        
	};
	jsPlumb.registerConnectorType(StateMachine, "StateMachine");
})();

/*
    	// a possible rudimentary avoidance scheme, old now, perhaps not useful.
        //      if (avoidSelector) {
		//		    var testLine = new Line(sourcePos[0] + _sx,sourcePos[1] + _sy,sourcePos[0] + _tx,sourcePos[1] + _ty);
		//		    var sel = jsPlumb.getSelector(avoidSelector);
		//		    for (var i = 0; i < sel.length; i++) {
		//			    var id = jsPlumb.getId(sel[i]);
		//			    if (id != sourceEndpoint.elementId && id != targetEndpoint.elementId) {
		//				    o = jsPlumb.getOffset(id), s = jsPlumb.getSize(id);
//
//						    if (o && s) {
//							    var collision = testLine.rectIntersect(o.left,o.top,s[0],s[1]);
//							    if (collision) {
								    // set the control point to be a certain distance from the midpoint of the two points that
								    // the line crosses on the rectangle.
								    // TODO where will this 75 number come from?
					//			    _controlX = collision[2][0] + (75 * collision[3][0]);
				//	/			    _controlY = collision[2][1] + (75 * collision[3][1]);
//							    }
//						    }
					//  }
	//			    }
              //}
    */
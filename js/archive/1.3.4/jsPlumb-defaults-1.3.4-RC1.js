/*
 * jsPlumb
 * 
 * Title:jsPlumb 1.3.5
 * 
 * Provides a way to visually connect elements on an HTML page, using either SVG, Canvas
 * elements, or VML.  
 * 
 * This file contains the default Connectors, Endpoint and Overlay definitions.
 *
 * Copyright (c) 2010 - 2012 Simon Porritt (http://jsplumb.org)
 * 
 * http://jsplumb.org
 * http://github.com/sporritt/jsplumb
 * http://code.google.com/p/jsplumb
 * 
 * Dual licensed under the MIT and GPL2 licenses.
 */

(function() {	
				
	/**
	 * 
	 * Helper class to consume unused mouse events by components that are DOM elements and
	 * are used by all of the different rendering modes.
	 * 
	 */
	jsPlumb.DOMElementComponent = function(params) {
		jsPlumb.jsPlumbUIComponent.apply(this, arguments);
		// when render mode is canvas, these functions may be called by the canvas mouse handler.  
		// this component is safe to pipe this stuff to /dev/null.
		this.mousemove = 
		this.dblclick  = 
		this.click = 
		this.mousedown = 
		this.mouseup = function(e) { };					
	};
	                                   
    /**
     * Class: Connectors.Straight
     * The Straight connector draws a simple straight line between the two anchor points.  It does not have any constructor parameters.
     */
    jsPlumb.Connectors.Straight = function() {
    	this.type = "Straight";
		var self = this,
		currentPoints = null,
		_m, _m2, _b, _dx, _dy, _theta, _theta2, _sx, _sy, _tx, _ty, _segment, _length;

        /**
         * Computes the new size and position of the canvas.
         * @param sourceAnchor Absolute position on screen of the source object's anchor.
         * @param targetAnchor Absolute position on screen of the target object's anchor.
         * @param positionMatrix  Indicates the relative positions of the left,top of the
         *  two plumbed objects.  so [0,0] indicates that the source is to the left of, and
         *  above, the target.  [1,0] means the source is to the right and above.  [0,1] means
         *  the source is to the left and below.  [1,1] means the source is to the right
         *  and below.  this is used to figure out which direction to draw the connector in.
         * @returns an array of positioning information.  the first two values are
         * the [left, top] absolute position the canvas should be placed on screen.  the
         * next two values are the [width,height] the canvas should be.  after that each
         * Connector can put whatever it likes into the array:it will be passed back in
         * to the paint call.  This particular function stores the origin and destination of
         * the line it is going to draw.  a more involved implementation, like a Bezier curve,
         * would store the control point info in this array too.
         */
        this.compute = function(sourcePos, targetPos, sourceEndpoint, targetEndpoint, sourceAnchor, targetAnchor, lineWidth, minWidth) {
        	var w = Math.abs(sourcePos[0] - targetPos[0]),
            h = Math.abs(sourcePos[1] - targetPos[1]),
            // these are padding to ensure the whole connector line appears
            xo = 0.45 * w, yo = 0.45 * h;
            // these are padding to ensure the whole connector line appears
            w *= 1.9; h *=1.9;
            
            var x = Math.min(sourcePos[0], targetPos[0]) - xo;
            var y = Math.min(sourcePos[1], targetPos[1]) - yo;
            
            // minimum size is 2 * line Width if minWidth was not given.
            var calculatedMinWidth = Math.max(2 * lineWidth, minWidth);
            
            if (w < calculatedMinWidth) { 
        		w = calculatedMinWidth; 
        		x = sourcePos[0]  + ((targetPos[0] - sourcePos[0]) / 2) - (calculatedMinWidth / 2);
        		xo = (w - Math.abs(sourcePos[0]-targetPos[0])) / 2;
        	}
            if (h < calculatedMinWidth) {         
        		h = calculatedMinWidth; 
        		y = sourcePos[1]  + ((targetPos[1] - sourcePos[1]) / 2) - (calculatedMinWidth / 2);
        		yo = (h - Math.abs(sourcePos[1]-targetPos[1])) / 2;
        	}
                            
            _sx = sourcePos[0] < targetPos[0] ?  xo : w-xo;
            _sy = sourcePos[1] < targetPos[1] ? yo:h-yo;
            _tx = sourcePos[0] < targetPos[0] ? w-xo : xo;
            _ty = sourcePos[1] < targetPos[1] ? h-yo : yo;
            currentPoints = [ x, y, w, h, _sx, _sy, _tx, _ty ];                        
            _dx = _tx - _sx, _dy = _ty - _sy;
			//_m = _dy / _dx, _m2 = -1 / _m;
            _m = jsPlumb.util.gradient({x:_sx, y:_sy}, {x:_tx, y:_ty}), _m2 = -1 / _m;
			_b = -1 * ((_m * _sx) - _sy);
			_theta = Math.atan(_m); _theta2 = Math.atan(_m2);
            //_segment = jsPlumb.util.segment({x:_sx, y:_sy}, {x:_tx, y:_ty});
            _length = Math.sqrt((_dx * _dx) + (_dy * _dy));
                             
            return currentPoints;
        };
        
        
        /**
         * returns the point on the connector's path that is 'location' along the length of the path, where 'location' is a decimal from
         * 0 to 1 inclusive. for the straight line connector this is simple maths.  for Bezier, not so much.
         */
        this.pointOnPath = function(location) {
        	if (location == 0)
                return { x:_sx, y:_sy };
            else if (location == 1)
                return { x:_tx, y:_ty };
            else
                return jsPlumb.util.pointOnLine({x:_sx, y:_sy}, {x:_tx, y:_ty}, location * _length);
        };
        
        /**
         * returns the gradient of the connector at the given point - which for us is constant.
         */
        this.gradientAtPoint = function(location) {
            return _m;
        };
        
        /**
         * returns the point on the connector's path that is 'distance' along the length of the path from 'location', where 
         * 'location' is a decimal from 0 to 1 inclusive, and 'distance' is a number of pixels.
         * this hands off to jsPlumb.util to do the maths, supplying our gradient and position and whether or
         * not the coords should be flipped
         */
        this.pointAlongPathFrom = function(location, distance) {
        	var p = self.pointOnPath(location);
			return jsPlumb.util.pointOnLine(p, {x:_tx,y:_ty}, distance);
        };
    };
                
    
    /**
     * Class:Connectors.Bezier
     * This Connector draws a Bezier curve with two control points.  You can provide a 'curviness' value which gets applied to jsPlumb's
     * internal voodoo machine and ends up generating locations for the two control points.  See the constructor documentation below.
     */
    /**
     * Function:Constructor
     * 
     * Parameters:
     * 	curviness - How 'curvy' you want the curve to be! This is a directive for the placement of control points, not endpoints of the curve, so your curve does not 
     * actually touch the given point, but it has the tendency to lean towards it.  The larger this value, the greater the curve is pulled from a straight line.
     * Optional; defaults to 150.
     * 
     */
    jsPlumb.Connectors.Bezier = function(params) {
    	var self = this;
    	params = params || {};
    	this.majorAnchor = params.curviness || 150;
        this.minorAnchor = 10;
        var currentPoints = null;
        this.type = "Bezier";
        
        this._findControlPoint = function(point, sourceAnchorPosition, targetAnchorPosition, sourceEndpoint, targetEndpoint, sourceAnchor, targetAnchor) {
        	// determine if the two anchors are perpendicular to each other in their orientation.  we swap the control 
        	// points around if so (code could be tightened up)
        	var soo = sourceAnchor.getOrientation(sourceEndpoint), 
        		too = targetAnchor.getOrientation(targetEndpoint),
        		perpendicular = soo[0] != too[0] || soo[1] == too[1],
            	p = [],            
            	ma = self.majorAnchor, mi = self.minorAnchor;                
            	
            if (!perpendicular) {
                if (soo[0] == 0) // X
                    p.push(sourceAnchorPosition[0] < targetAnchorPosition[0] ? point[0] + mi : point[0] - mi);
                else p.push(point[0] - (ma * soo[0]));
                                 
                if (soo[1] == 0) // Y
                	p.push(sourceAnchorPosition[1] < targetAnchorPosition[1] ? point[1] + mi : point[1] - mi);
                else p.push(point[1] + (ma * too[1]));
            }
             else {
                if (too[0] == 0) // X
                	p.push(targetAnchorPosition[0] < sourceAnchorPosition[0] ? point[0] + mi : point[0] - mi);
                else p.push(point[0] + (ma * too[0]));
                
                if (too[1] == 0) // Y
                	p.push(targetAnchorPosition[1] < sourceAnchorPosition[1] ? point[1] + mi : point[1] - mi);
                else p.push(point[1] + (ma * soo[1]));
             }

            return p;                
        };
        
//        this.isFlipX = function() { return 

        var _CP, _CP2, _sx, _tx, _ty, _sx, _sy, _canvasX, _canvasY, _w, _h;
        this.compute = function(sourcePos, targetPos, sourceEndpoint, targetEndpoint, sourceAnchor, targetAnchor, lineWidth, minWidth)
        {
        	lineWidth = lineWidth || 0;
            _w = Math.abs(sourcePos[0] - targetPos[0]) + lineWidth; 
            _h = Math.abs(sourcePos[1] - targetPos[1]) + lineWidth;
            _canvasX = Math.min(sourcePos[0], targetPos[0])-(lineWidth/2);
            _canvasY = Math.min(sourcePos[1], targetPos[1])-(lineWidth/2);
            _sx = sourcePos[0] < targetPos[0] ? _w - (lineWidth/2): (lineWidth/2);
            _sy = sourcePos[1] < targetPos[1] ? _h - (lineWidth/2) : (lineWidth/2);
            _tx = sourcePos[0] < targetPos[0] ? (lineWidth/2) : _w - (lineWidth/2);
            _ty = sourcePos[1] < targetPos[1] ? (lineWidth/2) : _h - (lineWidth/2);
            _CP = self._findControlPoint([_sx,_sy], sourcePos, targetPos, sourceEndpoint, targetEndpoint, sourceAnchor, targetAnchor);
            _CP2 = self._findControlPoint([_tx,_ty], targetPos, sourcePos, sourceEndpoint, targetEndpoint, targetAnchor, sourceAnchor);                
            var minx1 = Math.min(_sx,_tx), minx2 = Math.min(_CP[0], _CP2[0]), minx = Math.min(minx1,minx2),
            	maxx1 = Math.max(_sx,_tx), maxx2 = Math.max(_CP[0], _CP2[0]), maxx = Math.max(maxx1,maxx2);
            
            if (maxx > _w) _w = maxx;
            if (minx < 0) {
                _canvasX += minx; var ox = Math.abs(minx);
                _w += ox; _CP[0] += ox; _sx += ox; _tx +=ox; _CP2[0] += ox;
            }                

            var miny1 = Math.min(_sy,_ty), miny2 = Math.min(_CP[1], _CP2[1]), miny = Math.min(miny1,miny2),
            	maxy1 = Math.max(_sy,_ty), maxy2 = Math.max(_CP[1], _CP2[1]), maxy = Math.max(maxy1,maxy2);
            	
            if (maxy > _h) _h = maxy;
            if (miny < 0) {
                _canvasY += miny; var oy = Math.abs(miny);
                _h += oy; _CP[1] += oy; _sy += oy; _ty +=oy; _CP2[1] += oy;
            }
            
            if (minWidth && _w < minWidth) {
            	var posAdjust = (minWidth - _w) / 2;
        		_w = minWidth;        		
        		_canvasX -= posAdjust; _sx = _sx + posAdjust ; _tx = _tx + posAdjust; _CP[0] =  _CP[0] + posAdjust; _CP2[0] = _CP2[0] + posAdjust;
        	}
            
            if (minWidth && _h < minWidth) {
            	var posAdjust = (minWidth - _h) / 2;
        		_h = minWidth;        		
        		_canvasY -= posAdjust; _sy = _sy + posAdjust ; _ty = _ty + posAdjust; _CP[1] =  _CP[1] + posAdjust; _CP2[1] = _CP2[1] + posAdjust;
        	}

            currentPoints = [_canvasX, _canvasY, _w, _h, _sx, _sy, _tx, _ty, _CP[0], _CP[1], _CP2[0], _CP2[1] ];            
            return currentPoints;            
        };        
        
        var _makeCurve = function() {
        	return [	
	        	{ x:_sx, y:_sy },
	        	{ x:_CP[0], y:_CP[1] },
	        	{ x:_CP2[0], y:_CP2[1] },
	        	{ x:_tx, y:_ty }
         	];
        };     
        
        /**
         * returns the point on the connector's path that is 'location' along the length of the path, where 'location' is a decimal from
         * 0 to 1 inclusive. for the straight line connector this is simple maths.  for Bezier, not so much.
         */
        this.pointOnPath = function(location) {        	
        	return jsBezier.pointOnCurve(_makeCurve(), location);
        };
        
        /**
         * returns the gradient of the connector at the given point.
         */
        this.gradientAtPoint = function(location) {
        	return jsBezier.gradientAtPoint(_makeCurve(), location);        	
        };	              
        
        /**
         * for Bezier curves this method is a little tricky, cos calculating path distance algebraically is notoriously difficult.
         * this method is iterative, jumping forward .05% of the path at a time and summing the distance between this point and the previous
         * one, until the sum reaches 'distance'. the method may turn out to be computationally expensive; we'll see.
         * another drawback of this method is that if the connector gets quite long, .05% of the length of it is not necessarily smaller
         * than the desired distance, in which case the loop returns immediately and the arrow is mis-shapen. so a better strategy might be to
         * calculate the step as a function of distance/distance between endpoints.  
         */
        this.pointAlongPathFrom = function(location, distance) {        	
        	return jsBezier.pointAlongCurveFrom(_makeCurve(), location, distance);
        };           
    };        
    
    
    /**
     * Class: Connectors.Flowchart
     * Provides 'flowchart' connectors, consisting of vertical and horizontal line segments.
     */
    /**
     * Function: Constructor
     * 
     * Parameters:
     * 	stub - minimum length for the stub at each end of the connector. defaults to 30 pixels. 
     */
    jsPlumb.Connectors.Flowchart = function(params) {
    	this.type = "Flowchart";
    	params = params || {};
		var self = this, 
		minStubLength = params.stub || params.minStubLength /* bwds compat. */ || 30, 
		segments = [],
        totalLength = 0,
		segmentProportions = [],
		segmentProportionalLengths = [],
		points = [],
		swapX, 
		swapY,
		/**
		 * recalculates the points at which the segments begin and end, proportional to the total length travelled
		 * by all the segments that constitute the connector.   we use this to help with pointOnPath calculations.
		 */
		updateSegmentProportions = function(startX, startY, endX, endY) {
			var curLoc = 0;
			for (var i = 0; i < segments.length; i++) {
				segmentProportionalLengths[i] = segments[i][5] / totalLength;
				segmentProportions[i] = [curLoc, (curLoc += (segments[i][5] / totalLength)) ];
			}
		},
		appendSegmentsToPoints = function() {
			points.push(segments.length);
			for (var i = 0; i < segments.length; i++) {
				points.push(segments[i][0]);
				points.push(segments[i][1]);
			}
		},		
		/**
		 * helper method to add a segment.
		 */
		addSegment = function(x, y, sx, sy, tx, ty) {
			var lx = segments.length == 0 ? sx : segments[segments.length - 1][0],
			    ly = segments.length == 0 ? sy : segments[segments.length - 1][1],
                m = x == lx ? Infinity : 0,
				l = Math.abs(x == lx ? y - ly : x - lx);
			segments.push([x, y, lx, ly, m, l]);
            totalLength += l;
		},
		/**
		 * returns [segment, proportion of travel in segment, segment index] for the segment 
		 * that contains the point which is 'location' distance along the entire path, where 
		 * 'location' is a decimal between 0 and 1 inclusive. in this connector type, paths 
		 * are made up of a list of segments, each of which contributes some fraction to
		 * the total length.  
		 */
		findSegmentForLocation = function(location) {
			var idx = segmentProportions.length - 1, inSegmentProportion = 0;
			for (var i = 0; i < segmentProportions.length; i++) {
				if (segmentProportions[i][1] >= location) {
					idx = i;
					inSegmentProportion = (location - segmentProportions[i][0]) / segmentProportionalLengths[i];
 					break;
				}
			}
			return { segment:segments[idx], proportion:inSegmentProportion, index:idx };
		};
		
		this.compute = function(sourcePos, targetPos, sourceEndpoint, targetEndpoint, sourceAnchor, targetAnchor, lineWidth, minWidth) {
	    	
			segments = [];
            totalLength = 0;
			segmentProportionalLengths = [];
			
            swapX = targetPos[0] < sourcePos[0]; 
            swapY = targetPos[1] < sourcePos[1];
			
			var lw = lineWidth || 1,
            offx = (lw / 2) + (minStubLength * 2), 
            offy = (lw / 2) + (minStubLength * 2),
            so = sourceAnchor.orientation || sourceAnchor.getOrientation(sourceEndpoint), 
            to = targetAnchor.orientation || targetAnchor.getOrientation(targetEndpoint),
            x = swapX ? targetPos[0] : sourcePos[0], 
            y = swapY ? targetPos[1] : sourcePos[1],
            w = Math.abs(targetPos[0] - sourcePos[0]) + 2*offx, 
            h = Math.abs(targetPos[1] - sourcePos[1]) + 2*offy;
            if (w < minWidth) {      
            	offx += (minWidth - w) / 2;
            	w = minWidth;
            }
            if (h < minWidth) {            	
            	offy += (minWidth - h) / 2;
            	h = minWidth;
            }
            var sx = swapX ? w-offx  : offx, 
            sy = swapY ? h-offy  : offy, 
            tx = swapX ? offx : w-offx ,
            ty = swapY ? offy : h-offy,
            startStubX = sx + (so[0] * minStubLength), 
            startStubY = sy + (so[1] * minStubLength),
            endStubX = tx + (to[0] * minStubLength), 
            endStubY = ty + (to[1] * minStubLength),
            midx = startStubX + ((endStubX - startStubX) / 2),
            midy = startStubY + ((endStubY - startStubY) / 2);
            
            x -= offx; y -= offy;
            points = [x, y, w, h, sx, sy, tx, ty];
            var extraPoints = [];
      
            addSegment(startStubX, startStubY, sx, sy, tx, ty);                        
            
            if (so[0] == 0) {        		
        		var startStubIsBeforeEndStub = startStubY < endStubY;             		        	
        		// when start point's stub is less than endpoint's stub
        		if (startStubIsBeforeEndStub) {
        			addSegment(startStubX, midy, sx, sy, tx, ty);
        			addSegment(midx, midy, sx, sy, tx, ty);
        			addSegment(endStubX, midy, sx, sy, tx, ty);
        		} else {
        			// when start point's stub is greater than endpoint's stub
        			addSegment(midx, startStubY, sx, sy, tx, ty);
        			addSegment(midx, endStubY, sx, sy, tx, ty);
        		}
        	}
        	else {
        		var startStubIsBeforeEndStub = startStubX < endStubX;
        		// when start point's stub is less than endpoint's stub
        		if (startStubIsBeforeEndStub) { 
        			addSegment(midx, startStubY, sx, sy, tx, ty);
        			addSegment(midx, midy, sx, sy, tx, ty);
        			addSegment(midx, endStubY, sx, sy, tx, ty);
        		} else {
        			// when start point's stub is greater than endpoint's stub        			
        			addSegment(startStubX, midy, sx, sy, tx, ty);
        			addSegment(endStubX, midy, sx, sy, tx, ty);
        		}
        	}            
            
            addSegment(endStubX, endStubY, sx, sy, tx, ty);
            addSegment(tx, ty, sx, sy, tx, ty);
            
            appendSegmentsToPoints();
            updateSegmentProportions(sx, sy, tx, ty);
            
			return points;
		};
		
		/**
         * returns the point on the connector's path that is 'location' along the length of the path, where 'location' is a decimal from
         * 0 to 1 inclusive. for this connector we must first figure out which segment the given point lies in, and then compute the x,y position
         * from our knowledge of the segment's start and end points.
         */
        this.pointOnPath = function(location) {
        	return self.pointAlongPathFrom(location, 0);
        };
        
        /**
         * returns the gradient of the connector at the given point; the gradient will be either 0 or Infinity, depending on the direction of the
         * segment the point falls in. segment gradients are calculated in the compute method.  
         */
        this.gradientAtPoint = function(location) { 
        	return segments[findSegmentForLocation(location)["index"]][4];
        };
        
        /**
         * returns the point on the connector's path that is 'distance' along the length of the path from 'location', where 
         * 'location' is a decimal from 0 to 1 inclusive, and 'distance' is a number of pixels.  when you consider this concept from the point of view
         * of this connector, it starts to become clear that there's a problem with the overlay paint code: given that this connector makes several
         * 90 degree turns, it's entirely possible that an arrow overlay could be forced to paint itself around a corner, which would look stupid. this is
         * because jsPlumb uses this method (and pointOnPath) so determine the locations of the various points that go to make up an overlay.  a better
         * solution would probably be to just use pointOnPath along with gradientAtPoint, and draw the overlay so that its axis ran along
         * a tangent to the connector.  for straight line connectors this would obviously mean the overlay was painted directly on the connector, since a 
         * tangent to a straight line is the line itself, which is what we want; for this connector, and for beziers, the results would probably be better.  an additional
         * advantage is, of course, that there's less computation involved doing it that way. 
         */
        this.pointAlongPathFrom = function(location, distance) {
        	var s = findSegmentForLocation(location), seg = s.segment, p = s.proportion, sl = segments[s.index][5], m = segments[s.index][4];
        	var e = {         		
        		x 	: m == Infinity ? seg[2] : seg[2] > seg[0] ? seg[0] + ((1 - p) * sl) - distance : seg[2] + (p * sl) + distance,
        		y 	: m == 0 ? seg[3] : seg[3] > seg[1] ? seg[1] + ((1 - p) * sl) - distance  : seg[3] + (p * sl) + distance,
        		segmentInfo : s
        	};
        	
        	return e;
        };
    };

 // ********************************* END OF CONNECTOR TYPES *******************************************************************
    
 // ********************************* ENDPOINT TYPES *******************************************************************
    
    /**
     * Class: Endpoints.Dot
     * A round endpoint, with default radius 10 pixels.
     */    	
    	
	/**
	 * Function: Constructor
	 * 
	 * Parameters:
	 * 
	 * 	radius	-	radius of the endpoint.  defaults to 10 pixels.
	 */
	jsPlumb.Endpoints.Dot = function(params) {
		this.type = "Dot";
		var self = this;
		params = params || {};				
		this.radius = params.radius || 10;
		this.defaultOffset = 0.5 * this.radius;
		this.defaultInnerRadius = this.radius / 3;			
		
		this.compute = function(anchorPoint, orientation, endpointStyle, connectorPaintStyle) {
			var r = endpointStyle.radius || self.radius,
				x = anchorPoint[0] - r,
				y = anchorPoint[1] - r;
			return [ x, y, r * 2, r * 2, r ];
		};
	};
	
	/**
	 * Class: Endpoints.Rectangle
	 * A Rectangular Endpoint, with default size 20x20.
	 */
	/**
	 * Function: Constructor
	 * 
	 * Parameters:
	 * 
	 * 	width	- width of the endpoint. defaults to 20 pixels.
	 * 	height	- height of the endpoint. defaults to 20 pixels.	
	 */
	jsPlumb.Endpoints.Rectangle = function(params) {
		this.type = "Rectangle";
		var self = this;
		params = params || {};
		this.width = params.width || 20;
		this.height = params.height || 20;
		
		this.compute = function(anchorPoint, orientation, endpointStyle, connectorPaintStyle) {
			var width = endpointStyle.width || self.width,
				height = endpointStyle.height || self.height,
				x = anchorPoint[0] - (width/2),
				y = anchorPoint[1] - (height/2);
			return [ x, y, width, height];
		};
	};
	
	/**
	 * Class: Endpoints.Image
	 * Draws an image as the Endpoint.
	 */
	/**
	 * Function: Constructor
	 * 
	 * Parameters:
	 * 
	 * 	src	-	location of the image to use.
	 */
	jsPlumb.Endpoints.Image = function(params) {
				
		this.type = "Image";
		jsPlumb.DOMElementComponent.apply(this, arguments);
		
		var self = this, 
			initialized = false,
			widthToUse = params.width,
			heightToUse = params.height,
            _onload = null,
            _endpoint = params.endpoint;
			
		this.img = new Image();
		self.ready = false;

		this.img.onload = function() {
			self.ready = true;
			widthToUse = widthToUse || self.img.width;
			heightToUse = heightToUse || self.img.height;
            if (_onload) {
                _onload(this);
            }
		};

        _endpoint.setImage = function(img, onload) {
            var s = img.constructor == String ? img : img.src;
            _onload = onload;
            self.img.src = img;
        };

        _endpoint.setImage(params.src || params.url, params.onload);

		this.compute = function(anchorPoint, orientation, endpointStyle, connectorPaintStyle) {
			self.anchorPoint = anchorPoint;
			if (self.ready) return [anchorPoint[0] - widthToUse / 2, anchorPoint[1] - heightToUse / 2, 
									widthToUse, heightToUse];
			else return [0,0,0,0];
		};
		
		self.canvas = document.createElement("img"), initialized = false;
		self.canvas.style["margin"] = 0;
		self.canvas.style["padding"] = 0;
		self.canvas.style["outline"] = 0;
		self.canvas.style["position"] = "absolute";
		var clazz = params.cssClass ? " " + params.cssClass : "";
		self.canvas.className = jsPlumb.endpointClass + clazz;
		if (widthToUse) self.canvas.setAttribute("width", widthToUse);
		if (heightToUse) self.canvas.setAttribute("height", heightToUse);		
		jsPlumb.appendElement(self.canvas, params.parent);
		self.attachListeners(self.canvas, self);
		
		var actuallyPaint = function(d, style, anchor) {
			if (!initialized) {
				self.canvas.setAttribute("src", self.img.src);
				initialized = true;
			}
			var x = self.anchorPoint[0] - (widthToUse / 2),
				y = self.anchorPoint[1] - (heightToUse / 2);
			jsPlumb.sizeCanvas(self.canvas, x, y, widthToUse, heightToUse);
		};
		
		this.paint = function(d, style, anchor) {
			if (self.ready) {
    			actuallyPaint(d, style, anchor);
			}
			else { 
				window.setTimeout(function() {    					
					self.paint(d, style, anchor);
				}, 200);
			}
		};				
	};
	
	/**
	 * Class: Endpoints.Blank
	 * An Endpoint that paints nothing (visible) on the screen.  Supports cssClass and hoverClass parameters like all Endpoints.
	 */
	jsPlumb.Endpoints.Blank = function(params) {
		var self = this;
		this.type = "Blank";
		jsPlumb.DOMElementComponent.apply(this, arguments);		
		this.compute = function(anchorPoint, orientation, endpointStyle, connectorPaintStyle) {
			return [anchorPoint[0], anchorPoint[1],10,0];
		};
		
		self.canvas = document.createElement("div");
		self.canvas.style.display = "block";
		self.canvas.style.width = "1px";
		self.canvas.style.height = "1px";
		self.canvas.style.background = "transparent";
		self.canvas.style.position = "absolute";
		self.canvas.className = self._jsPlumb.endpointClass;
		jsPlumb.appendElement(self.canvas, params.parent);
		
		this.paint = function(d, style, anchor) {
			jsPlumb.sizeCanvas(self.canvas, d[0], d[1], d[2], d[3]);	
		};
	};
	
	/**
	 * Class: Endpoints.Triangle
	 * A triangular Endpoint.  
	 */
	/**
	 * Function: Constructor
	 * 
	 * Parameters:
	 * 
	 * 	width	-	width of the triangle's base.  defaults to 55 pixels.
	 * 	height	-	height of the triangle from base to apex.  defaults to 55 pixels.
	 */
	jsPlumb.Endpoints.Triangle = function(params) {
		this.type = "Triangle";
		params = params || {  };
		params.width = params.width || 55;
		params.height = params.height || 55;
		this.width = params.width;
		this.height = params.height;
		this.compute = function(anchorPoint, orientation, endpointStyle, connectorPaintStyle) {
			var width = endpointStyle.width || self.width,
			height = endpointStyle.height || self.height,
			x = anchorPoint[0] - (width/2),
			y = anchorPoint[1] - (height/2);
			return [ x, y, width, height ];
		};
	};
// ********************************* END OF ENDPOINT TYPES *******************************************************************
	

// ********************************* OVERLAY DEFINITIONS ***********************************************************************    

	var AbstractOverlay = function(params) {
		var visible = true, self = this;
        this.isAppendedAtTopLevel = true;
		this.connection = params.connection;
		this.loc = params.location == null ? 0.5 : params.location;
		this.setVisible = function(val) { 
			visible = val;
			self.connection.repaint();
		};
    	this.isVisible = function() { return visible; };
    	this.hide = function() { self.setVisible(false); };
    	this.show = function() { self.setVisible(true); };
    	
    	this.incrementLocation = function(amount) {
    		self.loc += amount;
    		self.connection.repaint();
    	};
    	this.setLocation = function(l) {
    		self.loc = l;
    		self.connection.repaint();
    	};
    	this.getLocation = function() {
    		return self.loc;
    	};
	};
	
	
	/**
	 * Class: Overlays.Arrow
	 * 
	 * An arrow overlay, defined by four points: the head, the two sides of the tail, and a 'foldback' point at some distance along the length
	 * of the arrow that lines from each tail point converge into.  The foldback point is defined using a decimal that indicates some fraction
	 * of the length of the arrow and has a default value of 0.623.  A foldback point value of 1 would mean that the arrow had a straight line
	 * across the tail.  
	 */
	/**
	 * Function: Constructor
	 * 
	 * Parameters:
	 * 
	 * 	length - distance in pixels from head to tail baseline. default 20.
	 * 	width - width in pixels of the tail baseline. default 20.
	 * 	fillStyle - style to use when filling the arrow.  defaults to "black".
	 * 	strokeStyle - style to use when stroking the arrow. defaults to null, which means the arrow is not stroked.
	 * 	lineWidth - line width to use when stroking the arrow. defaults to 1, but only used if strokeStyle is not null.
	 * 	foldback - distance (as a decimal from 0 to 1 inclusive) along the length of the arrow marking the point the tail points should fold back to.  defaults to 0.623.
	 * 	location - distance (as a decimal from 0 to 1 inclusive) marking where the arrow should sit on the connector. defaults to 0.5.
	 * 	direction - indicates the direction the arrow points in. valid values are -1 and 1; 1 is default.
	 */
	jsPlumb.Overlays.Arrow = function(params) {
		this.type = "Arrow";
		AbstractOverlay.apply(this, arguments);
        this.isAppendedAtTopLevel = false;
		params = params || {};
		var self = this;
		
    	this.length = params.length || 20;
    	this.width = params.width || 20;
    	this.id = params.id;
    	var direction = (params.direction || 1) < 0 ? -1 : 1,
    	    paintStyle = params.paintStyle || { lineWidth:1 },
    	    // how far along the arrow the lines folding back in come to. default is 62.3%.
    	    foldback = params.foldback || 0.623;

    	    	
    	this.computeMaxSize = function() { return self.width * 1.5; };
    	
    	this.cleanup = function() { };  // nothing to clean up for Arrows
    	
    	this.draw = function(connector, currentConnectionPaintStyle, connectorDimensions) {

            var hxy, mid, txy, tail, cxy;

            if (self.loc == 1) {
                hxy = connector.pointOnPath(self.loc);
                mid = connector.pointAlongPathFrom(self.loc, -1);
                txy = jsPlumb.util.pointOnLine(hxy, mid, self.length);
            }
            else if (self.loc == 0) {
                txy = connector.pointOnPath(self.loc);
                mid = connector.pointAlongPathFrom(self.loc, 1);
                hxy = jsPlumb.util.pointOnLine(txy, mid, self.length);
            }
            else {
			    hxy = connector.pointAlongPathFrom(self.loc, direction * self.length / 2),
                mid = connector.pointOnPath(self.loc),
                txy = jsPlumb.util.pointOnLine(hxy, mid, self.length);
            }

            tail = jsPlumb.util.perpendicularLineTo(hxy, txy, self.width);
            cxy = jsPlumb.util.pointOnLine(hxy, txy, foldback * self.length);

			var minx = Math.min(hxy.x, tail[0].x, tail[1].x),
				maxx = Math.max(hxy.x, tail[0].x, tail[1].x),
				miny = Math.min(hxy.y, tail[0].y, tail[1].y),
				maxy = Math.max(hxy.y, tail[0].y, tail[1].y);
			
			var d = { hxy:hxy, tail:tail, cxy:cxy },
			    strokeStyle = paintStyle.strokeStyle || currentConnectionPaintStyle.strokeStyle,
			    fillStyle = paintStyle.fillStyle || currentConnectionPaintStyle.strokeStyle,
			    lineWidth = paintStyle.lineWidth || currentConnectionPaintStyle.lineWidth;
			
			self.paint(connector, d, lineWidth, strokeStyle, fillStyle, connectorDimensions);							
			
			return [ minx, maxx, miny, maxy]; 
    	};
    };          
    
    /**
     * Class: Overlays.PlainArrow
	 * 
	 * A basic arrow.  This is in fact just one instance of the more generic case in which the tail folds back on itself to some
	 * point along the length of the arrow: in this case, that foldback point is the full length of the arrow.  so it just does
	 * a 'call' to Arrow with foldback set appropriately.       
	 */
    /**
     * Function: Constructor
     * See <Overlays.Arrow> for allowed parameters for this overlay.
     */
    jsPlumb.Overlays.PlainArrow = function(params) {
    	params = params || {};    	
    	var p = jsPlumb.extend(params, {foldback:1});
    	jsPlumb.Overlays.Arrow.call(this, p);
    	this.type = "PlainArrow";
    };
        
    /**
     * Class: Overlays.Diamond
     * 
	 * A diamond. Like PlainArrow, this is a concrete case of the more generic case of the tail points converging on some point...it just
	 * happens that in this case, that point is greater than the length of the the arrow.    
	 * 
	 *      this could probably do with some help with positioning...due to the way it reuses the Arrow paint code, what Arrow thinks is the
	 *      center is actually 1/4 of the way along for this guy.  but we don't have any knowledge of pixels at this point, so we're kind of
	 *      stuck when it comes to helping out the Arrow class. possibly we could pass in a 'transpose' parameter or something. the value
	 *      would be -l/4 in this case - move along one quarter of the total length.
	 */
    /**
     * Function: Constructor
     * See <Overlays.Arrow> for allowed parameters for this overlay.
     */
    jsPlumb.Overlays.Diamond = function(params) {
    	params = params || {};    	
    	var l = params.length || 40,
    	    p = jsPlumb.extend(params, {length:l/2, foldback:2});
    	jsPlumb.Overlays.Arrow.call(this, p);
    	this.type = "Diamond";
    };
    
    
    
    /**
     * Class: Overlays.Label
     * A Label overlay. For all different renderer types (SVG/Canvas/VML), jsPlumb draws a Label overlay as a styled DIV.  Version 1.3.0 of jsPlumb
     * introduced the ability to set css classes on the label; this is now the preferred way for you to style a label.  The 'labelStyle' parameter
     * is still supported in 1.3.0 but its usage is deprecated.  Under the hood, jsPlumb just turns that object into a bunch of CSS directive that it 
     * puts on the Label's 'style' attribute, so the end result is the same. 
     */
    /**
     * Function: Constructor
     * 
     * Parameters:
     * 	cssClass - optional css class string to append to css class. This string is appended "as-is", so you can of course have multiple classes
     *             defined.  This parameter is preferred to using labelStyle, borderWidth and borderStyle.
     * 	label - the label to paint.  May be a string or a function that returns a string.  Nothing will be painted if your label is null or your
     *         label function returns null.  empty strings _will_ be painted.
     * 	location - distance (as a decimal from 0 to 1 inclusive) marking where the label should sit on the connector. defaults to 0.5.
     * 	
     */
    jsPlumb.Overlays.Label = function(params) {
    	this.type = "Label";
    	jsPlumb.DOMElementComponent.apply(this, arguments);
    	AbstractOverlay.apply(this, arguments);
    	this.labelStyle = params.labelStyle || jsPlumb.Defaults.LabelStyle;
        this.id = params.id;
        this.cachedDimensions = null;             // setting on 'this' rather than using closures uses a lot less memory.  just don't monkey with it!
	    var label = params.label || "",
            self = this,
    	    initialised = false,
    	    div = document.createElement("div"),
            labelText = null;
    	div.style["position"] 	= 	"absolute";    	
    	
    	var clazz = params["_jsPlumb"].overlayClass + " " + 
    		(self.labelStyle.cssClass ? self.labelStyle.cssClass : 
    		params.cssClass ? params.cssClass : "");
    	
    	div.className =	clazz;
    	
    	jsPlumb.appendElement(div, params.connection.parent);
    	jsPlumb.getId(div);		
    	self.attachListeners(div, self);
    	self.canvas = div;
    	
    	//override setVisible
    	var osv = self.setVisible;
    	self.setVisible = function(state) {
    		osv(state); // call superclass
    		div.style.display = state ? "block" : "none";
    	};
    	
    	this.getElement = function() {
    		return div;
    	};
    	
    	this.cleanup = function() {
    		if (div != null) jsPlumb.CurrentLibrary.removeElement(div);
    	};
    	
    	/*
    	 * Function: setLabel
    	 * sets the label's, um, label.  you would think i'd call this function
    	 * 'setText', but you can pass either a Function or a String to this, so
    	 * it makes more sense as 'setLabel'.
    	 */
    	this.setLabel = function(l) {
    		label = l;
    		labelText = null;
    		self.connection.repaint();
    	};
    	
    	this.getLabel = function() {
    		return label;
    	};
    	
    	this.paint = function(connector, d, connectorDimensions) {
			if (!initialised) {	
				connector.appendDisplayElement(div);
				self.attachListeners(div, connector);
				initialised = true;
			}
			div.style.left = (connectorDimensions[0] + d.minx) + "px";
			div.style.top = (connectorDimensions[1] + d.miny) + "px";			
    	};
    	
    	this.getTextDimensions = function(connector) {
    		if (typeof label == "function") {
    			var lt = label(self);
    			div.innerHTML = lt.replace(/\r\n/g, "<br/>");
    		}
    		else {
    			if (labelText == null) {
    				labelText = label;
    				div.innerHTML = labelText.replace(/\r\n/g, "<br/>");
    			}
    		}
    		var de = jsPlumb.CurrentLibrary.getElementObject(div),
    		s = jsPlumb.CurrentLibrary.getSize(de);
    		return {width:s[0], height:s[1]};
    	};
    	
    	this.computeMaxSize = function(connector) {
    		var td = self.getTextDimensions(connector);
    		return td.width ? Math.max(td.width, td.height) * 1.5 : 0;
    	};    	
    	
	    this.draw = function(connector, currentConnectionPaintStyle, connectorDimensions) {
	    	var td = self.getTextDimensions(connector);
	    	if (td.width !=  null) {
				var cxy = connector.pointOnPath(self.loc),												
				minx = cxy.x - (td.width / 2),
				miny = cxy.y - (td.height / 2);
				
				self.paint(connector, {
					minx:minx,
					miny:miny,
					td:td,
					cxy:cxy
				}, connectorDimensions);
				
				return [minx, minx+td.width, miny, miny+td.height];
        	}
	    	else return [0,0,0,0];
	    };
	    
	    this.reattachListeners = function() {
	    	if (div) self.reattachListenersForElement(div, self);
	    };
    };

    // this is really just a test overlay, so its undocumented and doesnt take any parameters. but i was loth to delete it.
    jsPlumb.Overlays.GuideLines = function() {
        var self = this;
        self.length = 50;
        self.lineWidth = 5;
        this.type = "GuideLines";
		AbstractOverlay.apply(this, arguments);
        jsPlumb.jsPlumbUIComponent.apply(this, arguments);
        this.draw = function(connector, currentConnectionPaintStyle, connectorDimensions) {

            var head = connector.pointAlongPathFrom(self.loc, self.length / 2),
                mid = connector.pointOnPath(self.loc),
                tail = jsPlumb.util.pointOnLine(head, mid, self.length),
                tailLine = jsPlumb.util.perpendicularLineTo(head, tail, 40),
                headLine = jsPlumb.util.perpendicularLineTo(tail, head, 20);

            self.paint(connector, [head, tail, tailLine, headLine], self.lineWidth, "red", null, connectorDimensions);

            return [Math.min(head.x, tail.x), Math.min(head.y, tail.y), Math.max(head.x, tail.x), Math.max(head.y,tail.y)];
        };

        this.computeMaxSize = function() { return 50; };

    	this.cleanup = function() { };  // nothing to clean up for GuideLines
    };

 // ********************************* END OF OVERLAY DEFINITIONS ***********************************************************************
    
 // ********************************* OVERLAY CANVAS RENDERERS***********************************************************************
    
 // ********************************* END OF OVERLAY CANVAS RENDERERS ***********************************************************************
})();
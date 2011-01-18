/*
* jsPlumb-defaults-1.2.4-RC1
*
* This script contains the default Anchors, Endpoints, Connectors and Overlays for jsPlumb.  It should be used with jsPlumb 1.1.0 and above; 
* prior to version 1.1.0 of jsPlumb the defaults were included inside the main script.
*
* NOTE: for production usage you should use jsPlumb-all-x.x.x-min.js, which contains the main jsPlumb script and this script together,
* in a minified file.
* 
* Dual licensed under MIT and GPL2.
*/

(function() {
	
	var ie = !!!document.createElement('canvas').getContext;

    /**
    * Places you can anchor a connection to.  These are helpers for common locations; they all just return an instance
    * of Anchor that has been configured appropriately.  
    * 
    * You can write your own one of these; you
    * just need to provide a 'compute' method and an 'orientation'.  so you'd say something like this:
    * 
    * jsPlumb.Anchors.MY_ANCHOR = {
    * 	compute : function(xy, wh, txy, twh) { return some mathematics on those variables; },
    *   getOrientation : function() { return [ox, oy]; }
    * };
    *
    * compute takes the [x,y] position of the top left corner of the anchored element,
    * and the element's [width,height] (all in pixels), as well as the location and dimension of the element it's plumbed to,
    * and returns where the anchor should be located.
    *
    * the 'orientation' array (returned here as [ox,oy]) indicates the general direction a connection from the anchor
    * should go in, if possible.  it is an [x,y] matrix where a value of 0 means no preference,
    * -1 means go in a negative direction for the given axis, and 1 means go in a positive
    * direction.  so consider a TopCenter anchor: the orientation matrix for it is [0,-1],
    * meaning connections naturally want to go upwards on screen.  in a Bezier implementation, for example, 
    * the curve would start out going in that direction, before bending towards the target anchor.
    */
	var _curryAnchor = function(x,y,ox,oy) {
		return function() {
			return jsPlumb.makeAnchor(x,y,ox,oy);
		};
	};
	jsPlumb.Anchors["TopCenter"] 		= _curryAnchor(0.5, 0, 0,-1);
	jsPlumb.Anchors["BottomCenter"] 	= _curryAnchor(0.5, 1, 0, 1);
	jsPlumb.Anchors["LeftMiddle"] 		= _curryAnchor(0, 0.5, -1, 0);
	jsPlumb.Anchors["RightMiddle"] 	= _curryAnchor(1, 0.5, 1, 0);
	jsPlumb.Anchors["Center"] 			= _curryAnchor(0.5, 0.5, 0, 0);
	jsPlumb.Anchors["TopRight"] 		= _curryAnchor(1, 0, 0,-1);
	jsPlumb.Anchors["BottomRight"] 	= _curryAnchor(1, 1, 0, 1);
	jsPlumb.Anchors["TopLeft"] 		= _curryAnchor(0, 0, 0, -1);
	jsPlumb.Anchors["BottomLeft"] 		= _curryAnchor(0, 1, 0, 1);
	
	
	jsPlumb.Defaults.DynamicAnchors = function() {
		return jsPlumb.makeAnchors(["TopCenter", "RightMiddle", "BottomCenter", "LeftMiddle"]);
	};
	jsPlumb.Anchors["AutoDefault"]  = function() { return jsPlumb.makeDynamicAnchor(jsPlumb.Defaults.DynamicAnchors()); };
	                                   
        /**
         * The Straight connector draws a simple straight line between the two anchor points.
         */
    jsPlumb.Connectors.Straight = function() {
	 
		var self = this;
		var currentPoints = null;
		var _m, _m2, _b, _dx, _dy, _theta, _theta2, _sx, _sy, _tx, _ty;

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
        this.compute = function(sourcePos, targetPos, sourceAnchor, targetAnchor, lineWidth, minWidth) {
        	var w = Math.abs(sourcePos[0] - targetPos[0]);
            var h = Math.abs(sourcePos[1] - targetPos[1]);
            var widthAdjusted = false, heightAdjusted = false;
            // these are padding to ensure the whole connector line appears
            var xo = 0.45 * w, yo = 0.45 * h;
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
            
            _dx = _tx - _sx, _dy = (_ty - _sy);
			_m = _dy / _dx, _m2 = -1 / _m;
			_b = -1 * ((_m * _sx) - _sy);
			_theta = Math.atan(_m); _theta2 = Math.atan(_m2);
                             
            return currentPoints;
        };

        this.paint = function(dimensions, ctx)
        {
            ctx.beginPath();
            ctx.moveTo(dimensions[4], dimensions[5]);
            ctx.lineTo(dimensions[6], dimensions[7]);
            ctx.stroke();            
        };        
        
        /**
         * returns the point on the connector's path that is 'location' along the length of the path, where 'location' is a decimal from
         * 0 to 1 inclusive. for the straight line connector this is simple maths.  for Bezier, not so much.
         */
        this.pointOnPath = function(location) {
        	var xp = _sx + (location * _dx);
        	var yp = _m == Infinity ? xp + _b : (_m * xp) + _b;
        	return {x:xp, y:yp};
        };
        
        /**
         * returns the gradient of the connector at the given point - which for us is constant.
         */
        this.gradientAtPoint = function(location) { return _m; };	
        
        /**
         * returns the point on the connector's path that is 'distance' along the length of the path from 'location', where 
         * 'location' is a decimal from 0 to 1 inclusive, and 'distance' is a number of pixels.
         */
        this.pointAlongPathFrom = function(location, distance) {
        	var p = self.pointOnPath(location);
        	var orientation = distance > 0 ? 1 : -1;
        	var y =  Math.abs(distance * Math.sin(_theta));
        	if (_sy > _ty) y = y * -1;
			var x =  Math.abs(distance * Math.cos(_theta));
			if (_sx > _tx) x = x * -1;
			return {x:p.x + (orientation * x), y:p.y + (orientation * y)};
        };
        
        /**
         * calculates a line that is perpendicular to, and centered on, the path at 'distance' pixels from the given location.
         * the line is 'length' pixels long.
         */
        this.perpendicularToPathAt = function(location, length, distance) {
        	var p = self.pointAlongPathFrom(location, distance);
        	var m = self.gradientAtPoint(p.location);
        	var _theta2 = Math.atan(-1 / m);
        	var y =  length / 2 * Math.sin(_theta2);
			var x =  length / 2 * Math.cos(_theta2);
			return [{x:p.x + x, y:p.y + y}, {x:p.x - x, y:p.y - y}];
        };        
        
        this.createGradient = function(dim, ctx) {
        	return ctx.createLinearGradient(dim[4], dim[5], dim[6], dim[7]);
        };
    };
                
    /**
     * This Connector draws a Bezier curve with two control points.
     * @param curviness How 'curvy' you want the curve to be! This is a directive for the
     * placement of control points, not endpoints of the curve, so your curve does not 
     * actually touch the given point, but it has the tendency to lean towards it.  the larger
     * this value, the greater the curve is pulled from a straight line.
     * 
     * a future implementation of this could take the control points as arguments, rather
     * than fixing the curve to one basic shape.
     */
    jsPlumb.Connectors.Bezier = function(curviness) {
    	var self = this;
    	this.majorAnchor = curviness || 150;
        this.minorAnchor = 10;
        var currentPoints = null;
        
        this._findControlPoint = function(point, sourceAnchorPosition, targetAnchorPosition, sourceAnchor, targetAnchor) {
        	// determine if the two anchors are perpendicular to each other in their orientation.  we swap the control 
        	// points around if so (code could be tightened up)
        	var soo = sourceAnchor.getOrientation(), too = targetAnchor.getOrientation();
        	var perpendicular = soo[0] != too[0] || soo[1] == too[1]; 
            var p = [];            
            var ma = self.majorAnchor, mi = self.minorAnchor;                
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

        var _CP, _CP2, _sx, _tx, _sx, _sy, _canvasX, _canvasY, _w, _h;
        this.compute = function(sourcePos, targetPos, sourceAnchor, targetAnchor, lineWidth, minWidth)
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
            _CP = self._findControlPoint([_sx,_sy], sourcePos, targetPos, sourceAnchor, targetAnchor);
            _CP2 = self._findControlPoint([_tx,_ty], targetPos, sourcePos, targetAnchor, sourceAnchor);                
            var minx1 = Math.min(_sx,_tx); var minx2 = Math.min(_CP[0], _CP2[0]); var minx = Math.min(minx1,minx2);
            var maxx1 = Math.max(_sx,_tx); var maxx2 = Math.max(_CP[0], _CP2[0]); var maxx = Math.max(maxx1,maxx2);
            
            if (maxx > _w) _w = maxx;
            if (minx < 0) {
                _canvasX += minx; var ox = Math.abs(minx);
                _w += ox; _CP[0] += ox; _sx += ox; _tx +=ox; _CP2[0] += ox;
            }                

            var miny1 = Math.min(_sy,_ty); var miny2 = Math.min(_CP[1], _CP2[1]); var miny = Math.min(miny1,miny2);
            var maxy1 = Math.max(_sy,_ty); var maxy2 = Math.max(_CP[1], _CP2[1]); var maxy = Math.max(maxy1,maxy2);
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

        this.paint = function(d, ctx) {
        	ctx.beginPath();
            ctx.moveTo(d[4],d[5]);
            ctx.bezierCurveTo(d[8],d[9],d[10],d[11],d[6],d[7]);	            
            ctx.stroke();            
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
         * returns the distance the given point is from the curve.  not enabled for 1.2.3.  didnt make the cut.  next time.
         */
        this.distanceFrom = function(point) {
        	var curve = [ {x:currentPoints[4], y:currentPoints[5]},
        				  {x:currentPoints[8], y:currentPoints[9]}, 
        				  {x:currentPoints[10], y:currentPoints[11]}, 
        				  {x:currentPoints[6], y:currentPoints[7]}];
        	return (jsBezier.distanceFromCurve(point, curve));        	        	
        }; 
        
        this.nearestPointTo = function(point) {
        	var curve = [ {x:currentPoints[4], y:currentPoints[5]},
        				  {x:currentPoints[8], y:currentPoints[9]}, 
        				  {x:currentPoints[10], y:currentPoints[11]}, 
        				  {x:currentPoints[6], y:currentPoints[7]}];
        	return (jsBezier.nearestPointOnCurve(point, curve));
        	
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
        
        /**
         * calculates a line that is perpendicular to, and centered on, the path at 'distance' pixels from the given location.
         * the line is 'length' pixels long.
         */
        this.perpendicularToPathAt = function(location, length, distance) {        	
        	return jsBezier.perpendicularToCurveAt(_makeCurve(), location, length, distance);
        };
        
        this.createGradient = function(dim, ctx, swap) {
        	return (swap) ? ctx.createLinearGradient(dim[4], dim[5], dim[6], dim[7]) : ctx.createLinearGradient(dim[6], dim[7], dim[4], dim[5]);
        };
    };
    
    
    /**
     * Types of endpoint UIs.  we supply four - a circle of default radius 10px, a rectangle of
     * default size 20x20, an image (with no default), and a Triangle, of default size 15.  
     * you can supply others of these if you want to - see the documentation for a howto.
     */    	
    	
	/**
	 * a round endpoint, with default radius 10 pixels.
	 */
	jsPlumb.Endpoints.Dot = function(params) {
	
		params = params || { radius:10 };
		var self = this;
		this.radius = params.radius;
		var defaultOffset = 0.5 * this.radius;
		var defaultInnerRadius = this.radius / 3;
		
		var parseValue = function(value) {
			try {
				return parseInt(value); 
			}
			catch(e) {
				if (value.substring(value.length - 1) == '%')
					return parseInt(value.substring(0, value - 1));
			}
		}
		
		var calculateAdjustments = function(gradient) {
			var offsetAdjustment = defaultOffset;
			var innerRadius = defaultInnerRadius;
			if (gradient.offset) offsetAdjustment = parseValue(gradient.offset);
        	if(gradient.innerRadius) innerRadius = parseValue(gradient.innerRadius);
        	return [offsetAdjustment, innerRadius];
		};
		
    	this.paint = function(anchorPoint, orientation, canvas, endpointStyle, connectorPaintStyle) {
			var radius = endpointStyle.radius || self.radius;
			var x = anchorPoint[0] - radius;
			var y = anchorPoint[1] - radius;
			jsPlumb.sizeCanvas(canvas, x, y, radius * 2, radius * 2);
			var ctx = canvas.getContext('2d');
			var style = jsPlumb.extend({}, endpointStyle);
			if (style.fillStyle ==  null) style.fillStyle = connectorPaintStyle.strokeStyle;
			jsPlumb.extend(ctx, style);
						
            if (endpointStyle.gradient && !ie) {            	
            	var adjustments = calculateAdjustments(endpointStyle.gradient); 
            	var yAdjust = orientation[1] == 1 ? adjustments[0] * -1 : adjustments[0];
            	var xAdjust = orientation[0] == 1 ? adjustments[0] * -1:  adjustments[0];
            	var g = ctx.createRadialGradient(radius, radius, radius, radius + xAdjust, radius + yAdjust, adjustments[1]);
	            for (var i = 0; i < endpointStyle.gradient.stops.length; i++)
	            	g.addColorStop(endpointStyle.gradient.stops[i][0], endpointStyle.gradient.stops[i][1]);
	            ctx.fillStyle = g;
            }
			
			ctx.beginPath();    			
			ctx.arc(radius, radius, radius, 0, Math.PI*2, true);
			ctx.closePath();
			ctx.fill();
    	};
	};
	
	/**
	 * A Rectangular endpoint, with default size 20x20.
	 */
	jsPlumb.Endpoints.Rectangle = function(params) {
    	
		params = params || { width:20, height:20 };
		var self = this;
		this.width = params.width;
		this.height = params.height;
		
    	this.paint = function(anchorPoint, orientation, canvas, endpointStyle, connectorPaintStyle) {    		
			var width = endpointStyle.width || self.width;
			var height = endpointStyle.height || self.height;
			var x = anchorPoint[0] - (width/2);
			var y = anchorPoint[1] - (height/2);
			jsPlumb.sizeCanvas(canvas, x, y, width, height);
			var ctx = canvas.getContext('2d');
			var style = jsPlumb.extend({}, endpointStyle);
			if (style.fillStyle ==  null) style.fillStyle = connectorPaintStyle.strokeStyle;
			jsPlumb.extend(ctx, style);
			
			var ie = (/MSIE/.test(navigator.userAgent) && !window.opera);
		    if (endpointStyle.gradient && !ie) {
			// first figure out which direction to run the gradient in (it depends on the orientation of the anchors)
			var y1 = orientation[1] == 1 ? height : orientation[1] == 0 ? height / 2 : 0;
			var y2 = orientation[1] == -1 ? height : orientation[1] == 0 ? height / 2 : 0;
			var x1 = orientation[0] == 1 ? width : orientation[0] == 0 ? width / 2 : 0;
			var x2 = orientation[0] == -1 ? width : orientation[0] == 0 ? height / 2 : 0;
			    var g = ctx.createLinearGradient(x1,y1,x2,y2);
			    for (var i = 0; i < endpointStyle.gradient.stops.length; i++)
				g.addColorStop(endpointStyle.gradient.stops[i][0], endpointStyle.gradient.stops[i][1]);
			    ctx.fillStyle = g;
		    }
			
			ctx.beginPath();
			ctx.rect(0, 0, width, height);
			ctx.closePath();
			ctx.fill();
    	};
	};
	
	jsPlumb.Endpoints.Triangle = function(params) {
	        	
		params = params || { width:15, height:15 };
		var self = this;
		this.width = params.width;
		this.height = params.height;
		
    	this.paint = function(anchorPoint, orientation, canvas, endpointStyle, connectorPaintStyle) 
		{    		
			var width = endpointStyle.width || self.width;
			var height = endpointStyle.height || self.height;
			var x = anchorPoint[0] - width/2;
			var y = anchorPoint[1] - height/2;
			
			jsPlumb.sizeCanvas(canvas, x, y, width, height);
			
			var ctx = canvas.getContext('2d');
			var offsetX = 0, offsetY = 0, angle = 0;
			
			if( orientation[0] == 1 )
			{
				offsetX = width;
				offsetY = height;
				angle = 180;
			}
			if( orientation[1] == -1 )
			{
				offsetX = width;
				angle = 90;
			}
			if( orientation[1] == 1 )
			{
				offsetY = height;
				angle = -90;
			}
			
			ctx.fillStyle = endpointStyle.fillStyle;
			
			ctx.translate(offsetX, offsetY);
			ctx.rotate(angle * Math.PI/180);

			ctx.beginPath();
			ctx.moveTo(0, 0);
			ctx.lineTo(width/2, height/2);
			ctx.lineTo(0, height);
			ctx.closePath();
			ctx.fill();				
    	};
	};
	
	/**
	 * Image endpoint - draws an image as the endpoint.  You must provide a 'url' or, since 1.2.4, a 'src' property in the params object..
	 */
	jsPlumb.Endpoints.Image = function(params) {
		var self = this;
		this.img = new Image();
		var ready = false;
		this.img.onload = function() {
			self.ready = true;
		};
		this.img.src = params.src || params.url;
		
		var actuallyPaint = function(anchorPoint, orientation, canvas, endpointStyle, connectorPaintStyle) {
			var width = self.img.width || endpointStyle.width;
			var height = self.img.height || endpointStyle.height;
			var x = anchorPoint[0] - (width/2);
			var y = anchorPoint[1] - (height/2);
			jsPlumb.sizeCanvas(canvas, x, y, width, height);
			var ctx = canvas.getContext('2d');
			ctx.drawImage(self.img,0,0);
		};
		
		this.paint = function(anchorPoint, orientation, canvas, endpointStyle, connectorPaintStyle) {
			if (self.ready) {
    			actuallyPaint(anchorPoint, orientation, canvas, endpointStyle, connectorPaintStyle)
			}
			else 
				window.setTimeout(function() {    					
					self.paint(anchorPoint, orientation, canvas, endpointStyle, connectorPaintStyle);
				}, 200);
		};    		
	};    		
	
	/**
	 * An arrow overlay.  you can provide:
	 * 
	 * length - distance in pixels from head to tail baseline. default 20.
	 * width - width in pixels of the tail baseline. default 20.
	 * fillStyle - style to use when filling the arrow.  defaults to "black".
	 * strokeStyle - style to use when stroking the arrow. defaults to null, which means the arrow is not stroked.
	 * lineWidth - line width to use when stroking the arrow. defaults to 1, but only used if strokeStyle is not null.
	 * foldback - distance (as a decimal from 0 to 1 inclusive) along the length of the arrow marking the point the tail points should fold back to.  defaults to 0.623.
	 * location - distance (as a decimal from 0 to 1 inclusive) marking where the arrow should sit on the connector. defaults to 0.5.
	 */
	jsPlumb.Overlays.Arrow = function(params) {
		params = params || {};
		var self = this;
    	var length = params.length || 20;
    	var width = params.width || 20;
    	var fillStyle = params.fillStyle || "black";
    	var strokeStyle = params.strokeStyle;
    	var lineWidth = params.lineWidth || 1;
    	this.loc = params.location || 0.5;
    	// how far along the arrow the lines folding back in come to. default is 62.3%. 
    	var foldback = params.foldback || 0.623;
    	var _getFoldBackPoint = function(connector, loc) {
    		if (foldback == 0.5) return connector.pointOnPath(loc);
    		else {
    			var adj = 0.5 - foldback; // we calculate relative to the center
    			return connector.pointAlongPathFrom(loc, length * adj);        			
    		}
    	};
    	
    	this.computeMaxSize = function() { return width * 1.5; }
    	
    	this.draw = function(connector, ctx) {
    		// this is the arrow head position    		
			var hxy = connector.pointAlongPathFrom(self.loc, length / 2);		
			// this is the center of the tail
			var txy = connector.pointAlongPathFrom(self.loc, -length / 2), tx = txy.x, ty = txy.y;
			// this is the tail vector
			var tail = connector.perpendicularToPathAt(self.loc, width, -length / 2);
			// this is the point the tail goes in to
			var cxy = _getFoldBackPoint(connector, self.loc);
			
			ctx.lineWidth = lineWidth;
			ctx.beginPath();
			ctx.moveTo(hxy.x, hxy.y);
			ctx.lineTo(tail[0].x, tail[0].y);
			ctx.lineTo(cxy.x, cxy.y);
			ctx.lineTo(tail[1].x, tail[1].y);
			ctx.lineTo(hxy.x, hxy.y);
			ctx.closePath();
			
			if (strokeStyle) {
				ctx.strokeStyle = strokeStyle;
				ctx.stroke();
			}
			ctx.fillStyle = fillStyle;			
			ctx.fill();
    	}
    };
    
    /**
	 * a basic arrow.  this is in fact just one instance of the more generic case in which the tail folds back on itself to some
	 * point along the length of the arrow: in this case, that foldback point is the full length of the arrow.  so it just does
	 * a 'call' to Arrow with foldback set appropriately.  See Arrow for params.     
	 */
    jsPlumb.Overlays.PlainArrow = function(params) {
    	params = params || {};
    	var p = jsPlumb.extend(params, {foldback:1});
    	jsPlumb.Overlays.Arrow.call(this, p);    	
    };
    
    /**
	 * a diamond.  like PlainArrow, this is a concrete case of the more generic case of the tail points converging on some point...it just
	 * happens that in this case, that point is greater than the length of the the arrow.  See Arrow for params.  
	 * 
	 *      this could probably do with some help with positioning...due to the way it reuses the Arrow paint code, what Arrow thinks is the
	 *      center is actually 1/4 of the way along for this guy.  but we don't have any knowledge of pixels at this point, so we're kind of
	 *      stuck when it comes to helping out the Arrow class. possibly we could pass in a 'transpose' parameter or something. the value
	 *      would be -l/4 in this case - move along one quarter of the total length.
	 */
    jsPlumb.Overlays.Diamond = function(params) {
    	params = params || {};
    	var l = params.length || 40;    	
    	var p = jsPlumb.extend(params, {length:l/2, foldback:2});
    	jsPlumb.Overlays.Arrow.call(this, p);    	
    };
    
    /**
     * A Label overlay.  Params you can provide:
     * 
     * labelStyle - js object containing style instructions for the label. defaults to jsPlumb.Defaults.LabelStyle.
     * label - the label to paint.  may be a string or a function that returns a string.  nothing will be painted if your label is null or your
     *         label function returns null.  empty strings _will_ be painted.
     * location - distance (as a decimal from 0 to 1 inclusive) marking where the label should sit on the connector. defaults to 0.5.
     * borderWidth - width of a border to paint.  defaults to zero.
     * borderStyle - strokeStyle to use when painting the border, if necessary.
     */
    jsPlumb.Overlays.Label = function(params) {
    	this.labelStyle = params.labelStyle || jsPlumb.Defaults.LabelStyle;
	    this.label = params.label;
    	var self = this;
    	var labelWidth = null, labelHeight =  null, labelText = null, labelPadding = null;
    	this.location = params.location || 0.5;
    	this.cachedDimensions = null;             // setting on 'this' rather than using closures uses a lot less memory.  just don't monkey with it! 
    	var _textDimensions = function(ctx) {
    		if (self.cachedDimensions) return self.cachedDimensions;   // return cached copy if we can.  if we add a setLabel function remember to clear the cache. 
    		labelText = typeof self.label == 'function' ? self.label(self) : self.label;
    		var d = {};
    		if (labelText) {
    			var lines = labelText.split(/\n|\r\n/);
    			ctx.save();
	            if (self.labelStyle.font) ctx.font = self.labelStyle.font;
	            var t = _widestLine(lines, ctx);
				// a fake text height measurement: use the width of upper case M
				var h = ctx.measureText("M").width;					
				labelPadding = self.labelStyle.padding || 0.25;
				labelWidth = t + (2 * t * labelPadding);
				labelHeight = (lines.length * h) + (2 * h * labelPadding);
				var textHeight = lines.length * h;
				ctx.restore();
				d = {width:labelWidth, height:labelHeight, lines:lines, oneLine:h, padding:labelPadding, textHeight:textHeight};
    		}
    		if (typeof self.label != 'function') self.cachedDimensions = d;  // cache it if we can. 
    		return d;
    	};
    	this.computeMaxSize = function(connector, ctx) {
    		var td = _textDimensions(ctx);
    		return td.width ? Math.max(td.width, td.height) * 1.5 : 0;
    	};
    	var _widestLine = function(lines, ctx) {
    		var max = 0;
    		for (var i = 0; i < lines.length; i++) {
    			var t = ctx.measureText(lines[i]).width;
    			if (t > max) max = t;
    		}
    		return max;
    	};
    	
	    this.draw = function(connector, ctx) {	
	    	var td = _textDimensions(ctx);
	    	if (td.width) {
				var cxy = connector.pointOnPath(self.location);
				if (self.labelStyle.font) ctx.font = self.labelStyle.font;		            		            		           
				if (self.labelStyle.fillStyle) 
					ctx.fillStyle = self.labelStyle.fillStyle;
				else 
					ctx.fillStyle = "rgba(0,0,0,0)";
				ctx.fillRect(cxy.x - (td.width / 2), cxy.y - (td.height / 2) , td.width , td.height );
				
				if (self.labelStyle.color) ctx.fillStyle = self.labelStyle.color;					
				ctx.textBaseline = "middle";
				ctx.textAlign = "center";
				for (i = 0; i < td.lines.length; i++) { 
					ctx.fillText(td.lines[i],cxy.x, cxy.y - (td.textHeight / 2) + (td.oneLine/2) + (i*td.oneLine));
				}
				
				// border
				if (self.labelStyle.borderWidth > 0) {
					ctx.strokeStyle = self.labelStyle.borderStyle || "black";
					ctx.strokeRect(cxy.x - (td.width / 2), cxy.y - (td.height / 2) , td.width , td.height );
				}
        	}
	    };
    };
    
    /**
     * an image overlay.  params may contain:
     * 
     * location			:			proportion along the connector to draw the image. optional.
     * src				:			image src.  required.
     * events			:			map of event names to functions; each event listener will be bound to the img.
     */
    jsPlumb.Overlays.Image = function(params) {
    	var self = this;
    	this.location = params.location || 0.5;    	
    	this.img = new Image();
    	var imgDiv = null;
    	var notReadyInterval = null;
    	var notReadyConnector, notReadyContext;
    	var events = params.events || {};
    	var _init = function() {
    		if (self.ready) {
    			window.clearInterval(notReadyInterval);
	    		imgDiv = document.createElement("img");
				imgDiv.src = self.img.src;
				imgDiv.style.position = "absolute";
				imgDiv.style.display="none";
				imgDiv.className = "_jsPlumb_overlay";
				document.body.appendChild(imgDiv);// HMM
				// attach events
				for (var e in events) {
					jsPlumb.CurrentLibrary.bind(imgDiv, e, events[e]);
				}
				if (notReadyConnector && notReadyContext) {
					_draw(notReadyConnector, notReadyContext);
					notReadyContext = null;
					notReadyConnector = null;
				}
    		}
    	};
		this.img.onload = function() {						
			self.ready = true;
		};
		this.img.src = params.src || params.url;
		
		notReadyInterval = window.setInterval(_init, 250);
    	
    	this.computeMaxSize = function(connector, ctx) {
    		return [self.img.width, self.img.height]
    	};
    	
    	var _draw = function(connector, ctx) {
    		var cxy = connector.pointOnPath(self.location);
    		var canvas = jsPlumb.CurrentLibrary.getElementObject(ctx.canvas);
    		var canvasOffset = jsPlumb.CurrentLibrary.getOffset(canvas);    		
    		var o = {left:canvasOffset.left + cxy.x - (self.img.width/2), top:canvasOffset.top + cxy.y - (self.img.height/2)};
    		jsPlumb.CurrentLibrary.setOffset(imgDiv, o);
    		imgDiv.style.display = "block";
    	};
    	
    	this.draw = function(connector, ctx) {
    		if (self.ready)
	    		_draw(connector, ctx);
    		else {
    			notReadyConnector = connector;
    			notReadyContext = ctx;
    		}
    	};
    };       
})();
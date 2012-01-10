/**
* jsPlumb-defaults-1.2-RC1
*
* This script contains the default Anchors, Endpoints and Connectors for jsPlumb.  It should be used with jsPlumb 1.1.0 and above; 
* prior to version 1.1.0 of jsPlumb the defaults were included inside the main script.
*
* Version 1.1.1 of this script adds the Triangle Endpoint, written by __________ and featured on this demo:
*
* http://www.mintdesign.ru/blog/javascript-jsplumb-making-graph
* http://www.mintdesign.ru/site/samples/jsplumb/jsPlumb-graph-sample.htm
*
* NOTE: for production usage you should use jsPlumb-all-1.1.1-min.js, which contains the main jsPlumb script and this script together,
* in a minified file.
*/

(function() {

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
	jsPlumb.Anchors.TopCenter 		= jsPlumb.makeAnchor(0.5, 0, 0,-1);
	jsPlumb.Anchors.BottomCenter 	= jsPlumb.makeAnchor(0.5, 1, 0, 1);
	jsPlumb.Anchors.LeftMiddle 		= jsPlumb.makeAnchor(0, 0.5, -1, 0);
	jsPlumb.Anchors.RightMiddle 	= jsPlumb.makeAnchor(1, 0.5, 1, 0);
	jsPlumb.Anchors.Center 			= jsPlumb.makeAnchor(0.5, 0.5, 0, 0);
	jsPlumb.Anchors.TopRight 		= jsPlumb.makeAnchor(1, 0, 0,-1);
	jsPlumb.Anchors.BottomRight 	= jsPlumb.makeAnchor(1, 1, 0, 1);
	jsPlumb.Anchors.TopLeft 		= jsPlumb.makeAnchor(0, 0, 0, -1);
	jsPlumb.Anchors.BottomLeft 		= jsPlumb.makeAnchor(0, 1, 0, 1);
	
	
        /**
         * The Straight connector draws a simple straight line between the two anchor points.
         */
    jsPlumb.Connectors.Straight = function() {
	
		var self = this;

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
        this.compute = function(sourcePos, targetPos, sourceAnchor, targetAnchor, lineWidth) {
			var w = Math.abs(sourcePos[0] - targetPos[0]);
            var h = Math.abs(sourcePos[1] - targetPos[1]);
            var widthAdjusted = false, heightAdjusted = false;
            // these are padding to ensure the whole connector line appears
            var xo = 0.45 * w, yo = 0.45 * h;
            // these are padding to ensure the whole connector line appears
            w *= 1.9; h *=1.9;
            
            var x = Math.min(sourcePos[0], targetPos[0]) - xo;
            var y = Math.min(sourcePos[1], targetPos[1]) - yo;
            
            if (w < 2 * lineWidth) { 
        		w = 2 * lineWidth; 
        		x = sourcePos[0]  + ((targetPos[0] - sourcePos[0]) / 2) - lineWidth;
        		xo = (w - Math.abs(sourcePos[0]-targetPos[0])) / 2;
        	}
            if (h < 2 * lineWidth) { 
        		// minimum size is 2 * line Width
        		h = 2 * lineWidth; 
        		y = sourcePos[1]  + ((targetPos[1] - sourcePos[1]) / 2) - lineWidth;
        		yo = (h - Math.abs(sourcePos[1]-targetPos[1])) / 2;
        	}
                            
            var sx = sourcePos[0] < targetPos[0] ? w-xo : xo;
            var sy = sourcePos[1] < targetPos[1] ? h-yo : yo;
            var tx = sourcePos[0] < targetPos[0] ? xo : w-xo;
            var ty = sourcePos[1] < targetPos[1] ? yo : h-yo;
            var retVal = [ x, y, w, h, sx, sy, tx, ty ];
                             
            return retVal;
        };

        this.paint = function(dimensions, ctx)
        {
            ctx.beginPath();
            ctx.moveTo(dimensions[4], dimensions[5]);
            ctx.lineTo(dimensions[6], dimensions[7]);
            ctx.stroke();
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

        this.compute = function(sourcePos, targetPos, sourceAnchor, targetAnchor, lineWidth)
        {
        	lineWidth = lineWidth || 0;
            var w = Math.abs(sourcePos[0] - targetPos[0]) + lineWidth, h = Math.abs(sourcePos[1] - targetPos[1]) + lineWidth;
            var canvasX = Math.min(sourcePos[0], targetPos[0])-(lineWidth/2), canvasY = Math.min(sourcePos[1], targetPos[1])-(lineWidth/2);
            var sx = sourcePos[0] < targetPos[0] ? w - (lineWidth/2): (lineWidth/2), sy = sourcePos[1] < targetPos[1] ? h-(lineWidth/2) : (lineWidth/2);
            var tx = sourcePos[0] < targetPos[0] ? (lineWidth/2) : w-(lineWidth/2), ty = sourcePos[1] < targetPos[1] ? (lineWidth/2) : h-(lineWidth/2);
            var CP = self._findControlPoint([sx,sy], sourcePos, targetPos, sourceAnchor, targetAnchor);
            var CP2 = self._findControlPoint([tx,ty], targetPos, sourcePos, targetAnchor, sourceAnchor);                
            var minx1 = Math.min(sx,tx); var minx2 = Math.min(CP[0], CP2[0]); var minx = Math.min(minx1,minx2);
            var maxx1 = Math.max(sx,tx); var maxx2 = Math.max(CP[0], CP2[0]); var maxx = Math.max(maxx1,maxx2);
            
            if (maxx > w) w = maxx;
            if (minx < 0) {
                canvasX += minx; var ox = Math.abs(minx);
                w += ox; CP[0] += ox; sx += ox; tx +=ox; CP2[0] += ox;
            }                

            var miny1 = Math.min(sy,ty); var miny2 = Math.min(CP[1], CP2[1]); var miny = Math.min(miny1,miny2);
            var maxy1 = Math.max(sy,ty); var maxy2 = Math.max(CP[1], CP2[1]); var maxy = Math.max(maxy1,maxy2);
            if (maxy > h) h = maxy;
            if (miny < 0) {
                canvasY += miny; var oy = Math.abs(miny);
                h += oy; CP[1] += oy; sy += oy; ty +=oy; CP2[1] += oy;
            }

            // return [ canvasx, canvasy, canvasWidth, canvasHeight,
            //          sourceX, sourceY, targetX, targetY,
            //          controlPoint1_X, controlPoint1_Y, controlPoint2_X, controlPoint2_Y
            return [canvasX, canvasY, w, h, sx, sy, tx, ty, CP[0], CP[1], CP2[0], CP2[1] ];
        };

        this.paint = function(d, ctx) {
        	
        	/*var img = new Image();
        	img.src = "../img/pattern.jpg";
        	ctx.fillStyle = ctx.createPattern(img, 'repeat-y');*/
        	
            ctx.beginPath();
            ctx.moveTo(d[4],d[5]);
            ctx.bezierCurveTo(d[8],d[9],d[10],d[11],d[6],d[7]);	            
            ctx.stroke();
            //ctx.fill();
        }
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
			
			var ie = (/MSIE/.test(navigator.userAgent) && !window.opera);
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
			//todo: the fillStyle needs some thought. we want to support a few options:
			// 1. nothing supplied; use the stroke color or the default if no stroke color.
			// 2. a fill color supplied - use it
			// 3. a gradient supplied - use it
			// 4. setting the endpoint to the same color as the bg of the element it is attached to.
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
					var 
						offsetX = 0,
						offsetY = 0,
						angle = 0;
					
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
	 * Image endpoint - draws an image as the endpoint.  You must provide a 'url' property in the params object..
	 */
	jsPlumb.Endpoints.Image = function(params) {
		var self = this;
		this.img = new Image();
		var ready = false;
		this.img.onload = function() {
			self.ready = true;
		};
		this.img.src = params.url;
		
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
})();
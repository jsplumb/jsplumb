    jsPlumb.Connectors.ExampleConnector = function() {
	
		var self = this;
		
		// variables to use for arrow dimensions
		var arrowWidth = 10; 		// width of the arrow's baseline
		var arrowLength = 10;		// distance from baseline to tip of arrow 
		var arrowFill = "black";	// fill color for arrows.
		
		/**
		 * draws one arrow.
		 * @param x1 x loc of source endpoint
		 * @param y1 y loc of source endpoint
		 * @param x2 x loc of target endpoint
		 * @param y2 y loc of target endpoint
		 * @param location a number between 0 and 1 indicating how far along the connector to draw the arrow
		 * @param ctx the canvas context 
		 */		
		var _arrow = function(x1, y1, x2, y2, location, ctx) {
			// first get the slope of the connector
			var dx = x2 - x1, dy = y2 - y1;
			var m = dy / dx, m2 = -1 / m;
			console.log("m2 = " + m2);
			var b = -1 * ((m * x1) - y1);
			var perpAngle = Math.atan(m2);
			console.log("perpAngle = " + perpAngle);
			var ox = x1 < x2 ? 1 : -1;
			var oy = y1 < y2 ? 1 : -1;
			
			var orientation = (x1 < x2 && y1 > y2) || (x1 > x2 && y1 > y2) ? 1 : -1;
			
			// now get the center point of this arrow 
			var cx = x1 + (location * dx), cy = (m * cx) + b;
			// now the arrow head
			var hx = cx - (arrowLength / 2), hy = (m * hx) + b;
			// and the tail
			var tx = cx + (arrowLength / 2), ty = (m * tx) + b;
			// project out 90 degrees for tail
			var tx1 = tx - (orientation * Math.sin(perpAngle) * arrowWidth);
			var tx2 = tx + (orientation * Math.sin(perpAngle) * arrowWidth);
			var ty1 = ty - (orientation * Math.cos(perpAngle) * arrowWidth);
			var ty2 = ty + (orientation * Math.cos(perpAngle)* arrowWidth);
			
			console.log(x1 + "," + y1 + " - " + x2 + "," + y2);
			
			ctx.fillStyle=arrowFill;
			ctx.beginPath();
			ctx.moveTo(hx, hy);
			ctx.lineTo(tx1, ty1);
			ctx.lineTo(tx2,ty2);
			ctx.lineTo(hx, hy);
			ctx.closePath();
			ctx.fill();
			
			ctx.fillStyle = "rgba(200,0,0,0.7)";
			ctx.beginPath();    			
			ctx.arc(cx, cy, 5, 0, Math.PI*2, true);
			ctx.closePath();
			ctx.fill();
			
			ctx.fillStyle = "rgba(0,200,0,0.7)";
			ctx.beginPath();    			
			ctx.arc(hx, hy, 5, 0, Math.PI*2, true);
			ctx.closePath();
			ctx.fill();
			/*ctx.fillStyle = "rgba(0,0,200,0.7)";
			ctx.beginPath();    			
			ctx.arc(tx, ty, 5, 0, Math.PI*2, true);
			ctx.closePath();
			ctx.fill();
			*/
			
			
			
			//return {source:{x:x1 - (orientation * x),y:y1 - (orientation * y)}, target:{x:x2-(orientation * x),y:y2-(orientation * y)}};
		};
		
		
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
        
        var _dot = function(x,y,color,ctx) {
        	/*ctx.fillStyle = color;
			ctx.beginPath();    			
			ctx.arc(x, y, 5, 0, Math.PI*2, true);
			ctx.closePath();
			ctx.fill();*/
        };
        
        // parallel lines test
        var _plines = function(x1, y1, x2, y2, location, ctx) {
        	var dx = x2 - x1, dy = y2 - y1;
			var m = dy / dx, m2 = -1 / m;
			var b = -1 * ((m * x1) - y1);
			var perpAngle = Math.atan(m2);
			var width = 10;
			var y =  width * Math.sin(perpAngle);
			var x =  width * Math.cos(perpAngle);
			
			console.log("m=" + m + "; b =  " + b + ",dx=" + dx + ",dy=" + dy);
			
			var orientation = (x1 < x2 && y1 > y2) || (x1 > x2 && y1 > y2) ? 1 : -1;			
			var l = {source:{x:x1-(orientation * x),y:y1-(orientation * y)}, target:{x:x2-(orientation * x),y:y2-(orientation * y)}};
			var dx1 = l.target.x - l.source.x, dy1 = l.target.y - l.source.y;
			console.log("dx1,dy1:" + dx1 + "," + dy1);
			ctx.beginPath();
			ctx.moveTo(l.source.x, l.source.y);
			ctx.lineTo(l.target.x, l.target.y);
			ctx.stroke();
			
			orientation = -orientation;			
			var l2 = {source:{x:x1-(orientation * x),y:y1-(orientation * y)}, target:{x:x2-(orientation * x),y:y2-(orientation * y)}};			
			ctx.beginPath();
			ctx.moveTo(l2.source.x, l2.source.y);
			ctx.lineTo(l2.target.x, l2.target.y);
			ctx.stroke();
			
			//console.log("x1,y1=[" + x1+ "," + y1 + "], lx1,ly1=[" + l.source.x + "," + l.source.y + "],l2x1,l2y1=[" + l2.source.x +"," + l2.source.y + "]");
			//console.log("x2,y2=[" + x2+ "," + y2 + "], l2x1,l2y1=[" + l.target.x + "," + l.target.y + "],l2x2,l2y2=[" + l2.target.x +"," + l2.target.y + "]");
			
			_dot(l.source.x, l.source.y, "#000", ctx);//_dot(l.target.x, l.target.y, "#f00", ctx);
			_dot(l2.source.x, l2.source.y, "#000", ctx);//_dot(l2.target.x, l2.target.y, "#00f", ctx);
			_dot(x1, y1, "#000", ctx);
			
			// this is the arrow center position
			var cx = x1 + (location * dx), cy = (m * cx) + b;
			//var cx1 = l.source.x + (location * dx), cy1 = l.source.y + (cy - y1);
			var b1 = -1 * ((m * l.source.x) - l.source.y);
			var b2 = -1 * ((m * l2.source.x) - l2.source.y);
			var cx1 = l.source.x + (location * dx), cy1 = (m * cx1) + b1;
			var cx2 = l2.source.x + (location * dx), cy2 = (m * cx2) + b2;
			
			console.log("cx is " + cx + "; cx1 is " + cx1 + "; difference is " + (cx - cx1));
			console.log("x1 is " + x1 + "; lx1 is " + l.source.x + "; difference is " + (x1 - l.source.x));
			console.log("cy is " + cy + "; cy1 is " + cy1 + "; difference is " + (cy - cy1));
			console.log("y1 is " + y1 + "; ly1 is " + l.source.y + "; difference is " + (y1 - l.source.y));
						
			//var cx2 = l2.source.x + (location * dx), cy2 = l2.source.y - ( y2 - cy);
			//console.log(cx + "," + cx1 + "," + cx2);
			//console.log(cy + "," + cy1 + "," + cy2);
			
			_dot(cx,cy, "#f00", ctx);
			_dot(cx1,cy1, "#f00", ctx);
			_dot(cx2,cy2, "#f00", ctx);
			
			// this is the arrow head position
			var hx = cx - (arrowLength / 2), hy = (m * hx) + b;
			var hx1 = cx1 - (arrowLength / 2), hy1 = (m * hx1) + b1;
			var hx2 = cx2 - (arrowLength / 2), hy2 = (m * hx2) + b2;
			
			_dot(hx,hy, "#00f", ctx);
			_dot(hx1,hy1, "#00f", ctx);
			_dot(hx2,hy2, "#00f", ctx);
			
			// and the tail
			//var tx = cx + (arrowLength / 2), ty = (m * tx) + b;
			var tx = cx + (arrowLength / 2), ty = (m * tx) + b;
			var tx1 = cx1 + (arrowLength / 2), ty1 = (m * tx1) + b1;
			var tx2 = cx2 + (arrowLength / 2), ty2 = (m * tx2) + b2;
			
			_dot(tx,ty, "#0f0", ctx);
			_dot(tx1,ty1, "#0f0", ctx);
			_dot(tx2,ty2, "#0f0", ctx);
			
			
			ctx.fillStyle=arrowFill;
			ctx.beginPath();
			ctx.moveTo(hx, hy);
			ctx.lineTo(tx1, ty1);
			ctx.lineTo(tx2,ty2);
			ctx.lineTo(hx, hy);
			ctx.closePath();
			ctx.fill();
									
        }

        this.paint = function(dimensions, ctx)
        {
            ctx.beginPath();
            ctx.moveTo(dimensions[4], dimensions[5]);
            
            ctx.lineTo(dimensions[6], dimensions[7]);
            ctx.stroke();
            
            _plines(dimensions[4], dimensions[5], dimensions[6], dimensions[7], 0.3, ctx);
            
            _plines(dimensions[4], dimensions[5], dimensions[6], dimensions[7], 0.7, ctx);
			
			// EXAMPLE: puts a circle in the middle of the line...
/*			var x = dimensions[4] + ((dimensions[6] - dimensions[4]) / 2);
			var y = dimensions[5] + ((dimensions[7] - dimensions[5]) / 2);			
			ctx.fillStyle = "rgba(200,0,0,0.7)";
			ctx.beginPath();    			
			ctx.arc(x, y, 15, 0, Math.PI*2, true);
			ctx.closePath();
			ctx.fill();*/
			
			//_arrow(dimensions[4], dimensions[5], dimensions[6], dimensions[7], 0.333333, ctx);
			//_arrow(dimensions[4], dimensions[5], dimensions[6], dimensions[7], 0.666666, ctx);
			
        };
    };